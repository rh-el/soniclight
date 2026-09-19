-- Rename ShapeColor values to the client color names.
CREATE TYPE "ShapeColor_new" AS ENUM ('red', 'orange', 'green', 'blue', 'purple');

ALTER TABLE "shapes" ALTER COLUMN "color" TYPE "ShapeColor_new" USING (
  CASE "color"::text
    WHEN 'COLOR_1' THEN 'red'
    WHEN 'COLOR_2' THEN 'orange'
    WHEN 'COLOR_3' THEN 'green'
    WHEN 'COLOR_4' THEN 'blue'
    WHEN 'COLOR_5' THEN 'purple'
  END::"ShapeColor_new"
);

DROP TYPE "ShapeColor";
ALTER TYPE "ShapeColor_new" RENAME TO "ShapeColor";

ALTER TABLE "shapes" ADD COLUMN "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "shapes" ADD COLUMN "z" INTEGER NOT NULL DEFAULT 0;
