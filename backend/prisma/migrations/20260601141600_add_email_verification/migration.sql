-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
INSERT INTO "new_users" ("created_at", "email", "google_id", "id", "name", "password_hash", "plan", "quota_remaining", "quota_reset_at") SELECT "created_at", "email", "google_id", "id", "name", "password_hash", "plan", "quota_remaining", "quota_reset_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_verification_token_key" ON "users"("verification_token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
