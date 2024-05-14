/*
  Warnings:

  - Added the required column `queueid` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `queueid` INTEGER NOT NULL;
