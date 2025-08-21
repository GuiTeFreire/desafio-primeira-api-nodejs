-- Backfill para evitar erro de NOT NULL em linhas existentes
ALTER TABLE "users" ALTER COLUMN "password" SET DEFAULT '';
UPDATE "users" SET "password" = '' WHERE "password" IS NULL;
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;