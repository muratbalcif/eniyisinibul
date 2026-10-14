CREATE TABLE "Category" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "name" TEXT NOT NULL, CONSTRAINT "Category_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TABLE "Product" ("id" TEXT NOT NULL, "slug" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT, "categoryId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Product_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE TABLE "AffiliateLink" ("id" TEXT NOT NULL, "productId" TEXT NOT NULL, "merchant" TEXT NOT NULL, "url" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AffiliateLink_pkey" PRIMARY KEY ("id"));
CREATE INDEX "AffiliateLink_productId_idx" ON "AffiliateLink"("productId");
ALTER TABLE "AffiliateLink" ADD CONSTRAINT "AffiliateLink_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
