create type create_production_dto as (
  product_id uuid,
  quantity int
);

create or replace function create_production(production create_production_dto)
returns void
language plpgsql
as $$
declare
product_name text;
product_type "ProductType";
child_id         UUID;
child_name       text; 
child_quantity   int;
stock_quantity   int;
  
begin

  select "name", "type"
    into product_name, product_type
    from "Product"
   where "Product".id = production.product_id
     and "Product".active;

  if   not found
    then
       raise exception 'O produto informado não existe';
  end if;

  if   product_type = 'PURCHASE'
    then
       raise exception 'Só é possível produzir produtos vendáveis';
  end if;

  insert into "Production" ("productId", "quantity", "date") values (production.product_id, production.quantity, default);

  update "Stock" set quantity = quantity + production.quantity
   where "productId" = production.product_id;

  if not found then
    raise exception 'Produto % não possui estoque inicializado', product_name;
  end if;

  for child_id, child_name, child_quantity in
        with recursive tree as (
            select m."parentId", 
                   m."childId", 
                   m."childQuantity" * production.quantity as required_quantity,
                   array[m."parentId"] as path 
              from "MaterialTree" m
             where m."parentId" = production.product_id
          
            union all
          
            select m."parentId", 
                   m."childId", 
                   m."childQuantity" * t.required_quantity,
                   t.path || m."parentId"
              from "MaterialTree" m 
              join tree t on t."childId" = m."parentId"
             where not m."parentId" = any(path)
        )
          
        select "childId", p."name", sum("required_quantity") as child_quantity
          from tree
          join "Product" p on p."id" = "childId" 
         where "childId" <> production.product_id  
           and p."consumptionType" = 'PRODUCTION'
           and p.type <> 'PACKAGING'
           and p.active
         group by 1, 2
    loop

      select s.quantity
        into stock_quantity
        from "Stock" as s
       where s."productId" = child_id
         for update;

      if stock_quantity < child_quantity then
        raise exception 'Não há estoque suficiente do produto %.', child_name;
      end if;

      update "Stock" 
         set "quantity" = "quantity" - child_quantity
       where "productId" = child_id;

    end loop;
  
end;
$$