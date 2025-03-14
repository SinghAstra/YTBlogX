/*
  Warnings:

  - You are about to drop the column `hasTranscript` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Video` table. All the data in the column will be lost.
  - Added the required column `channelThumbnail` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoThumbnail` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "hasTranscript",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "channelThumbnail" TEXT NOT NULL,
ADD COLUMN     "videoThumbnail" TEXT NOT NULL;
