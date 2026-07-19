/*
  Warnings:

  - A unique constraint covering the columns `[userId,id]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Invoice_userId_invoiceNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_userId_id_key" ON "Invoice"("userId", "id");
