/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_userworkspaces` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userworkspaces` DROP FOREIGN KEY `_UserWorkspaces_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userworkspaces` DROP FOREIGN KEY `_UserWorkspaces_B_fkey`;

-- DropForeignKey
ALTER TABLE `workspace` DROP FOREIGN KEY `workspace_userId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `role`;

-- AlterTable
ALTER TABLE `workspace` MODIFY `userId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_userworkspaces`;

-- CreateTable
CREATE TABLE `_usersToworkspace` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_usersToworkspace_AB_unique`(`A`, `B`),
    INDEX `_usersToworkspace_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_usersToworkspace` ADD CONSTRAINT `_usersToworkspace_A_fkey` FOREIGN KEY (`A`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_usersToworkspace` ADD CONSTRAINT `_usersToworkspace_B_fkey` FOREIGN KEY (`B`) REFERENCES `workspace`(`workSpaceId`) ON DELETE CASCADE ON UPDATE CASCADE;
