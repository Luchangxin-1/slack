-- CreateTable
CREATE TABLE `workspace` (
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `workSpaceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`workSpaceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
