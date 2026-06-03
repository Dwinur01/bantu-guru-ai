/*
  Warnings:

  - You are about to drop the column `deletion_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `scheduled_deletion` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "subscriptions_user_id_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "input_data" TEXT NOT NULL,
    "gcs_path" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "shared_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_documents" ("created_at", "gcs_path", "id", "input_data", "title", "type", "user_id") SELECT "created_at", "gcs_path", "id", "input_data", "title", "type", "user_id" FROM "documents";
DROP TABLE "documents";
ALTER TABLE "new_documents" RENAME TO "documents";
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "google_id" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "quota_remaining" INTEGER NOT NULL DEFAULT 5,
    "quota_reset_at" DATETIME,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "email", "email_verified", "google_id", "id", "name", "password_hash", "plan", "quota_remaining", "quota_reset_at", "verification_token") SELECT "created_at", "email", "email_verified", "google_id", "id", "name", "password_hash", "plan", "quota_remaining", "quota_reset_at", "verification_token" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
