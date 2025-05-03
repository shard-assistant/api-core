/*
  Warnings:

  - The values [GOOGLE] on the enum `AuthMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuthMethod_new" AS ENUM ('CREDENTIALS', 'GITHUB', 'YANDEX');
ALTER TABLE "users" ALTER COLUMN "method" TYPE "AuthMethod_new" USING ("method"::text::"AuthMethod_new");
ALTER TYPE "AuthMethod" RENAME TO "AuthMethod_old";
ALTER TYPE "AuthMethod_new" RENAME TO "AuthMethod";
DROP TYPE "AuthMethod_old";
COMMIT;
