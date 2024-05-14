/*
  Warnings:

  - You are about to alter the column `datetime` on the `Queue` table. The data in that column could be lost. The data in that column will be cast from `DateTime(6)` to `DateTime(1)`.

*/
-- AlterTable
ALTER TABLE `Queue` MODIFY `datetime` DATETIME(1) NOT NULL;
