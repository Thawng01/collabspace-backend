/*
  Warnings:

  - You are about to drop the column `permissionId` on the `role_permissions` table. All the data in the column will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[roleId,permission]` on the table `role_permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permission` to the `role_permissions` table without a default value. This is not possible if the table is not empty.
  - Made the column `workspaceId` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "roles_workspaceId_fkey";

-- DropIndex
DROP INDEX "public"."role_permissions_roleId_permissionId_key";

-- AlterTable
ALTER TABLE "public"."role_permissions" DROP COLUMN "permissionId",
ADD COLUMN     "permission" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."roles" ALTER COLUMN "workspaceId" SET NOT NULL;

-- DropTable
DROP TABLE "public"."permissions";

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permission_key" ON "public"."role_permissions"("roleId", "permission");

-- AddForeignKey
ALTER TABLE "public"."roles" ADD CONSTRAINT "roles_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
