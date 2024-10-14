/*
  Warnings:

  - You are about to drop the `_userstoworkspace` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `users` to the `workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_userstoworkspace` DROP FOREIGN KEY `_usersToworkspace_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userstoworkspace` DROP FOREIGN KEY `_usersToworkspace_B_fkey`;

-- DropIndex
DROP INDEX `workspace_userId_fkey` ON `workspace`;

-- AlterTable
ALTER TABLE `workspace` ADD COLUMN `users` JSON NOT NULL;

-- DropTable
DROP TABLE `_userstoworkspace`;
