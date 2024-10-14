/*
  Warnings:

  - You are about to alter the column `userId` on the `workspace` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `workspace` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `workspace` ADD CONSTRAINT `workspace_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
