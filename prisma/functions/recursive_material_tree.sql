with recursive tree as (
  select "parentId", "childId", "childQuantity"
    from "MaterialTree"
   where "parentId" = '06761a56-8d4d-4019-a6ee-fd72eaa2be61'

  union all

  select m."parentId", m."childId", m."childQuantity"
    from "MaterialTree" m 
    inner join tree t on t."childId" = m."parentId"
)

select "childId", p."name", sum("childQuantity") 
  from tree
  join "Product" p on p."id" = "childId"  
 group by 1, 2;