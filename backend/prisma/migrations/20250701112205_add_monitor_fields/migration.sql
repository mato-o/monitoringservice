-- AlterTable
ALTER TABLE "Monitor" ADD COLUMN     "checkStatus" BOOLEAN,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "port" INTEGER;
