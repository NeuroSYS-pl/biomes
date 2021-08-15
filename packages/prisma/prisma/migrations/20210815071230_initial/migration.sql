-- CreateEnum
CREATE TYPE "AssetInvalidityReason" AS ENUM ('timeout', 'checksum', 'internal');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('uploading', 'processing', 'invalid', 'ready');

-- CreateTable
CREATE TABLE "Assets" (
    "uuid" UUID NOT NULL,
    "binary" TEXT,
    "digest" CHAR(64) NOT NULL,
    "compressed" BOOLEAN NOT NULL,
    "filename" TEXT NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "draftRequestId" UUID,
    "draftExpectedParts" INTEGER,
    "invalidReason" "AssetInvalidityReason",
    "invalidTimestamp" TIMESTAMPTZ(3),
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUuid" UUID NOT NULL,
    "modified" TIMESTAMPTZ(3),
    "modifiedByUuid" UUID,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Biomes" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUuid" UUID NOT NULL,
    "modified" TIMESTAMPTZ(3),
    "modifiedByUuid" UUID,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Fragments" (
    "uuid" UUID NOT NULL,
    "assetsByUuid" UUID,
    "part" INTEGER NOT NULL,
    "binary" TEXT NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Species" (
    "uuid" UUID NOT NULL,
    "tag" TEXT NOT NULL,
    "generation" INTEGER NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUuid" UUID NOT NULL,
    "modified" TIMESTAMPTZ(3),
    "modifiedByUuid" UUID,
    "assetByUuid" UUID NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Users" (
    "uuid" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "token" CHAR(64),
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified" TIMESTAMPTZ(3),

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Habitats" (
    "uuid" UUID NOT NULL,
    "speciesByUuid" UUID NOT NULL,
    "biomesByUuid" UUID NOT NULL,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUuid" UUID NOT NULL,

    PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Characteristics" (
    "uuid" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "speciesByUuid" UUID NOT NULL,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUuid" UUID NOT NULL,
    "modified" TIMESTAMPTZ(3),
    "modifiedByUuid" UUID,

    PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "assetPartKey" ON "Fragments"("assetsByUuid", "part");

-- CreateIndex
CREATE UNIQUE INDEX "Species.assetByUuid_unique" ON "Species"("assetByUuid");

-- CreateIndex
CREATE UNIQUE INDEX "tagGenerationKey" ON "Species"("tag", "generation");

-- CreateIndex
CREATE UNIQUE INDEX "Users.email_unique" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users.email" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users.token" ON "Users"("token");

-- CreateIndex
CREATE INDEX "Habitats.biomes" ON "Habitats"("biomesByUuid");

-- CreateIndex
CREATE INDEX "Habitats.species" ON "Habitats"("speciesByUuid");

-- CreateIndex
CREATE UNIQUE INDEX "habitatsKey" ON "Habitats"("speciesByUuid", "biomesByUuid");

-- CreateIndex
CREATE INDEX "Characteristics.species" ON "Characteristics"("speciesByUuid");

-- CreateIndex
CREATE UNIQUE INDEX "speciesByKey" ON "Characteristics"("speciesByUuid", "key");

-- AddForeignKey
ALTER TABLE "Assets" ADD FOREIGN KEY ("createdByUuid") REFERENCES "Users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD FOREIGN KEY ("modifiedByUuid") REFERENCES "Users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biomes" ADD FOREIGN KEY ("createdByUuid") REFERENCES "Users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biomes" ADD FOREIGN KEY ("modifiedByUuid") REFERENCES "Users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fragments" ADD FOREIGN KEY ("assetsByUuid") REFERENCES "Assets"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Species" ADD FOREIGN KEY ("assetByUuid") REFERENCES "Assets"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Species" ADD FOREIGN KEY ("createdByUuid") REFERENCES "Users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Species" ADD FOREIGN KEY ("modifiedByUuid") REFERENCES "Users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habitats" ADD FOREIGN KEY ("biomesByUuid") REFERENCES "Biomes"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habitats" ADD FOREIGN KEY ("createdByUuid") REFERENCES "Users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habitats" ADD FOREIGN KEY ("speciesByUuid") REFERENCES "Species"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristics" ADD FOREIGN KEY ("createdByUuid") REFERENCES "Users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristics" ADD FOREIGN KEY ("modifiedByUuid") REFERENCES "Users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristics" ADD FOREIGN KEY ("speciesByUuid") REFERENCES "Species"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
