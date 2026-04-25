CREATE OR REPLACE FUNCTION get_product_total_cost(p_product_id uuid)
RETURNS numeric
LANGUAGE sql
AS $$
WITH RECURSIVE bom AS (

    SELECT
        "childId",
        "childQuantity",
        "childUnitCost",
        "childQuantity"::numeric as accumulated_qty,
        ("childQuantity" * "childUnitCost") as total_cost,
        ARRAY["parentId", "childId"] as path
    FROM "ProductTree"
    WHERE "parentId" = p_product_id

    UNION ALL

    SELECT
        pt."childId",
        pt."childQuantity",
        pt."childUnitCost",

        b.accumulated_qty * pt."childQuantity",

        (b.accumulated_qty * pt."childQuantity" * pt."childUnitCost"),

        b.path || pt."childId"
    FROM "ProductTree" pt
    JOIN bom b
      ON pt."parentId" = b."childId"

    WHERE NOT pt."childId" = ANY(b.path)

)

SELECT COALESCE(SUM(total_cost),0)
FROM bom;
$$;