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
     inner join "Product" as p
        on p.id = s.productId
     where s."productId" = product.productId
       for update;

    if stock_quantity < product.quantity then
      raise exception 'Produto % não tem estoque suficiente para o pedido', product_name;
    end if;
  
    insert into "OrderProduct" ("orderId", "productId", "quantity") 
    values (
      order_id, 
      product.productId, 
      product.quantity
    );

    update "Stock" 
    set "quantity" = "quantity" - product.quantity
    where "productId" = product.productId;

  end loop;
  
end;
$$