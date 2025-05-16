-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_examId_fkey";

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "assignmentRe" INTEGER,
ADD COLUMN     "courseName" TEXT,
ADD COLUMN     "midexam" INTEGER;
