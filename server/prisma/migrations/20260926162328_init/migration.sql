-- CreateEnum
CREATE TYPE "Category" AS ENUM ('sofas', 'chairs', 'tables', 'beds', 'storage', 'lighting');

-- CreateEnum
CREATE TYPE "Material" AS ENUM ('oak', 'walnut', 'ash', 'rattan', 'linen', 'leather', 'steel', 'marble');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('natural', 'walnut', 'charcoal', 'sage', 'cream', 'ochre', 'ink', 'terracotta');

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "material" "Material" NOT NULL,
    "color" "Color" NOT NULL,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- CreateIndex
CREATE INDEX "product_category_idx" ON "product"("category");
