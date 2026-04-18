create type orderProduct as (
  productId UUID,
   quantity INT
);

create type orderCreationDTO as (
  customerId UUID,
      userId UUID,
     comment TEXT,
    products orderProduct[]
);

create or replace function create_order(new_order orderCreationDTO)
returns void
language plpgsql
as $$
declare
  product          orderProduct;
  order_id         int;
  stock_quantity   int;
  product_name     text;
  child_id         UUID;
  child_name       text; 
  child_quantity   int;
begin
  
  insert into "Order" ("userId", "customerId", "comment") 
  values (
    new_order.userId, 
    new_order.customerId, 
    new_order.comment
  )
  returning id into order_id;
  
  foreach product in array new_order.products
  loop
  
    select s.quantity, p.name
      into stock_quantity, product_name
      from "Stock" as s
      join "Product" p on p.id = s."productId"
     where s."productId" = product.productId 
       for update;

    if stock_quantity < product.quantity then
      raise exception 'Não há estoque suficiente do produto %.', product_name;
    end if; 
  
    for child_id, child_name, child_quantity in
    (
        with recursive tree as (
            select m."parentId", 
                   m."childId", 
                   m."childQuantity" * product.quantity as required_quantity,
                   array[m."parentId"] as path 
              from "MaterialTree" m
             where m."parentId" = product.productId
          
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
         where "childId" <> product.productId  
         group by 1, 2
    )
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

    update "Stock" 
    set "quantity" = "quantity" - product.quantity
    where "productId" = product.productId;
  
    insert into "OrderProduct" ("orderId", "productId", "quantity") 
    values (
      order_id, 
      product.productId, 
      product.quantity
    );

  end loop;
  
end;
$$