-- Rename ShapeColor values to generic names so the actual colors can change.
CREATE TYPE "ShapeColor_new" AS ENUM ('a', 'b', 'c', 'd', 'e');

ALTER TABLE "shapes" ALTER COLUMN "color" TYPE "ShapeColor_new" USING (
  CASE "color"::text
    WHEN 'red' THEN 'a'
    WHEN 'orange' THEN 'b'
    WHEN 'green' THEN 'c'
    WHEN 'blue' THEN 'd'
    WHEN 'purple' THEN 'e'
  END::"ShapeColor_new"
);

DROP TYPE "ShapeColor";
ALTER TYPE "ShapeColor_new" RENAME TO "ShapeColor";
