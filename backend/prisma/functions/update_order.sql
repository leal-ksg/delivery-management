create type orderProduct as (
  productId UUID,
   quantity INT
);

create type orderUpdateDTO as (
  id         INT,
  comment    TEXT,
  customerId UUID,
  status     "OrderStatus",
  userId     UUID,
  products   orderProduct[]
);

create or replace function update_order(order_data orderUpdateDTO)
returns void
language plpgsql
as $$
  
declare
  order_product_quantity int;
  order_product_id       UUID;
  stock_quantity   int;
  product          orderProduct;
  product_name     text;
  
  child_id         UUID;
  child_name       text; 
  child_quantity   int;

begin
  
  for order_product_id, order_product_quantity in 
    select "productId", "quantity"
      from "OrderProduct"
     where "orderId" = order_data.id
       for update
  loop

    for child_id, child_name, child_quantity in
    (
        with recursive tree as (
            select m."parentId", 
                   m."childId", 
                   m."childQuantity" * order_product_quantity as required_quantity,
                   array[m."parentId"] as path 
              from "MaterialTree" m
             where m."parentId" = order_product_id
          
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
         where "childId" <> order_product_id
         group by 1, 2
    )
    loop

      update "Stock" 
         set "quantity" = "quantity" + child_quantity
       where "productId" = child_id;

    end loop;

    update "Stock"
         set "quantity" = "quantity" + order_product_quantity
       where "productId" = order_product_id;

  end loop;

  update "Order"
     set "comment" = coalesce(order_data.comment, "comment"),
         "customerId" = coalesce(order_data.customerId, "customerId"),
         "status" = coalesce(order_data.status, "status")
    where "id" = order_data.id;

  if   order_data.status = 'CANCELLED'
    then
       return;
  end if;

  delete
    from "OrderProduct"
   where "orderId" = order_data.id;

  foreach product in array order_data.products
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
      order_data.id, 
      product.productId, 
      product.quantity
    );

  end loop;
  
end;
$$