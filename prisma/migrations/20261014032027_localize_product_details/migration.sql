-- AlterTable
ALTER TABLE `translation` ADD COLUMN `capacity` VARCHAR(500) NULL,
    ADD COLUMN `machinery` TEXT NULL,
    ADD COLUMN `products` JSON NULL;
