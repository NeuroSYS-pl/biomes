-- Create Users --
CREATE TABLE "Users" (
  "uuid" UUID PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "token" CHAR(64),
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "modified" TIMESTAMP(3) WITH TIME ZONE
);
CREATE INDEX "Users.email" ON "Users" ("email");
CREATE INDEX "Users.token" ON "Users" ("token");

-- Create Species --
CREATE TABLE "Species" (
  "uuid" UUID PRIMARY KEY,
  "tag" TEXT NOT NULL,
  "generation" INTEGER NOT NULL,
  "description" TEXT,
  "link" TEXT,
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUuid" UUID NOT NULL REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  "modified" TIMESTAMP(3) WITH TIME ZONE,
  "modifiedByUuid" UUID REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  UNIQUE("tag", "generation")
);

-- Create Biomes --
CREATE TABLE "Biomes" (
  "uuid" UUID PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "link" TEXT,
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUuid" UUID NOT NULL REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  "modified" TIMESTAMP(3) WITH TIME ZONE,
  "modifiedByUuid" UUID REFERENCES "Users" ("uuid") ON DELETE RESTRICT
);

-- Habitats: Species and Biomes join table --
CREATE TABLE "Habitats" (
  "uuid" UUID PRIMARY KEY,
  "speciesByUuid" UUID NOT NULL REFERENCES "Species" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  "biomesByUuid" UUID NOT NULL REFERENCES "Biomes" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE,
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUuid" UUID NOT NULL REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  UNIQUE("speciesByUuid", "biomesByUuid")
);
CREATE INDEX "Habitats.species" ON "Habitats" ("speciesByUuid");
CREATE INDEX "Habitats.biomes" ON "Habitats" ("biomesByUuid");

-- Create Assets --
CREATE TYPE "AssetStatus" AS ENUM (
  'uploading',
  'processing',
  'invalid',
  'ready'
);
CREATE TYPE "AssetInvalidityReason" AS ENUM ('timeout', 'checksum', 'internal');
CREATE TABLE "Assets" (
  "uuid" UUID PRIMARY KEY,
  "binary" TEXT,
  "digest" CHAR(64) NOT NULL,
  "compressed" BOOLEAN NOT NULL,
  "filename" TEXT NOT NULL,
  "status" "AssetStatus" NOT NULL,
  "draftRequestId" UUID,
  "draftExpectedParts" INTEGER,
  "invalidReason" "AssetInvalidityReason",
  "invalidTimestamp" TIMESTAMP(3) WITH TIME ZONE,
  "created" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdByUuid" UUID NOT NULL REFERENCES "Users" ("uuid") ON DELETE RESTRICT,
  "modified" TIMESTAMP(3) WITH TIME ZONE,
  "modifiedByUuid" UUID REFERENCES "Users" ("uuid") ON DELETE RESTRICT
);
CREATE TABLE "Fragments" (
  "uuid" UUID PRIMARY KEY,
  "assetsByUuid" UUID REFERENCES "Assets" ("uuid") ON DELETE SET NULL ON UPDATE CASCADE,
  "part" INTEGER NOT NULL,
  "binary" TEXT NOT NULL,
  UNIQUE("assetsByUuid", "part")
);

-- Add Species To Assets Relation --
ALTER TABLE "Species"
  ADD COLUMN "assetByUuid" UUID NOT NULL UNIQUE REFERENCES "Assets" ("uuid") ON DELETE RESTRICT;
