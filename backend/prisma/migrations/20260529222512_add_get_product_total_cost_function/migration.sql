CREATE OR REPLACE FUNCTION get_product_total_cost(p_product_id uuid)
RETURNS numeric
LANGUAGE sql
AS $$
WITH RECURSIVE bom AS (

    SELECT
        "childId",
        "childQuantity",
        p."unitPrice",
        "childQuantity"::numeric as accumulated_qty,
        ("childQuantity" * p."unitPrice") as total_cost,
        ARRAY["parentId", "childId"] as path
    FROM "ProductTree" pt
    JOIN "Product" p
      ON pt."childId" = p."id"
    WHERE "parentId" = p_product_id

    UNION ALL

    SELECT
        pt."childId",
        pt."childQuantity",
        p."unitPrice",

        b.accumulated_qty * pt."childQuantity",

        (b.accumulated_qty * pt."childQuantity" * p."unitPrice"),

        b.path || pt."childId"
    FROM "ProductTree" pt
    JOIN bom b
      ON pt."parentId" = b."childId"
    JOIN "Product" p
      ON pt."childId" = p."id"

    WHERE NOT pt."childId" = ANY(b.path)

)

SELECT COALESCE(SUM(total_cost),0)
FROM bom;
$$;