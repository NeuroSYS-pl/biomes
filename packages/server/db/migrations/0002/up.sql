-- Characteristics: Species and Biomes join table --
CREATE TABLE "Characteristics" (
  "uuid" UUID PRIMARY KEY,
  "key" VARCHAR(255) NOT NULL,
  "value" TEXT NOT NULL,
  "speciesByUuid" UUID NOT NULL REFERENCES "Species" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUuid" UUID NOT NULL REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  "modified" TIMESTAMP(3) WITH TIME ZONE,
  "modifiedByUuid" UUID REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  UNIQUE("speciesByUuid", "key")
);
CREATE INDEX "Characteristics.species" ON "Characteristics" ("speciesByUuid");
