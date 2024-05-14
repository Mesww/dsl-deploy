/*
  Warnings:

  - Added the required column `status` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `status` ENUM('WAIT', 'PROCESS', 'FINISH', 'SKIP', 'STOP') NOT NULL;
