-- Migration: add_subscriptions_table
-- Dibuat manual karena prisma migrate dev tidak bisa interaktif

CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id"                INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id"           INTEGER NOT NULL,
    "plan"              TEXT NOT NULL,
    "midtrans_order_id" TEXT NOT NULL UNIQUE,
    "status"            TEXT NOT NULL DEFAULT 'pending',
    "started_at"        DATETIME,
    "expires_at"        DATETIME,
    "amount"            REAL NOT NULL,
    CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions"("user_id");
