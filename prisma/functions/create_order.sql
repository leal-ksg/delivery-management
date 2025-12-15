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
  product  orderProduct;
  order_id int;
  
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