-- AlterTable: Tambah kolom scheduled_deletion dan deletion_token ke tabel users
ALTER TABLE "users" ADD COLUMN "scheduled_deletion" DATETIME;
ALTER TABLE "users" ADD COLUMN "deletion_token" TEXT;

-- CreateIndex: Tambah unique constraint untuk deletion_token
CREATE UNIQUE INDEX "users_deletion_token_key" ON "users"("deletion_token");
