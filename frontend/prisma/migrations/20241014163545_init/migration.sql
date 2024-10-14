/*
  Warnings:

  - You are about to drop the `_userstoworkspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verificationtoken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userstoworkspace` DROP FOREIGN KEY `_usersToworkspace_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userstoworkspace` DROP FOREIGN KEY `_usersToworkspace_B_fkey`;

-- DropTable
DROP TABLE `_userstoworkspace`;

-- DropTable
DROP TABLE `account`;

-- DropTable
DROP TABLE `session`;

-- DropTable
DROP TABLE `verificationtoken`;

-- CreateTable
CREATE TABLE `_UserWorkspaces` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserWorkspaces_AB_unique`(`A`, `B`),
    INDEX `_UserWorkspaces_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserWorkspaces` ADD CONSTRAINT `_UserWorkspaces_A_fkey` FOREIGN KEY (`A`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserWorkspaces` ADD CONSTRAINT `_UserWorkspaces_B_fkey` FOREIGN KEY (`B`) REFERENCES `workspace`(`workSpaceId`) ON DELETE CASCADE ON UPDATE CASCADE;
