for child_id, child_name, child_quantity in
    (
        with recursive tree as (
            select m."parentId", 
                   m."childId", 
                   m."childQuantity" * product.quantity as required_quantity,
                   array[m."parentId"] as path 
              from "MaterialTree" m
             where m."parentId" = production.productId
          
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

  # Use the child materials infos here

end loop;