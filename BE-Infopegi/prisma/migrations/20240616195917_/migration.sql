/*
  Warnings:

  - Added the required column `anak` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dewasa` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jadwal` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasi` to the `Destination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Destination` ADD COLUMN `anak` INTEGER NOT NULL,
    ADD COLUMN `dewasa` INTEGER NOT NULL,
    ADD COLUMN `jadwal` VARCHAR(191) NOT NULL,
    ADD COLUMN `lokasi` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Review` ADD COLUMN `rating` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
