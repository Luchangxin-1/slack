-- CreateTable
CREATE TABLE `channel` (
    `channelId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`channelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `channel` ADD CONSTRAINT `channel_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `workspace`(`workSpaceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
