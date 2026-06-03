/*
  Warnings:

  - The values [COMPLETED] on the enum `SyncStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SyncStatus_new" AS ENUM ('OPEN', 'FULL', 'CANCELLED');
ALTER TABLE "public"."Sync" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Sync" ALTER COLUMN "status" TYPE "SyncStatus_new" USING ("status"::text::"SyncStatus_new");
ALTER TYPE "SyncStatus" RENAME TO "SyncStatus_old";
ALTER TYPE "SyncStatus_new" RENAME TO "SyncStatus";
DROP TYPE "public"."SyncStatus_old";
ALTER TABLE "Sync" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
