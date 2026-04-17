-- CreateTable
CREATE TABLE "wallPostReaction" (
    "id" SERIAL NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wallPostId" INTEGER NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "wallPostReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wallPostReaction_wallPostId_idx" ON "wallPostReaction"("wallPostId");

-- CreateIndex
CREATE INDEX "wallPostReaction_userId_idx" ON "wallPostReaction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wallPostReaction_wallPostId_userId_key" ON "wallPostReaction"("wallPostId", "userId");

-- AddForeignKey
ALTER TABLE "wallPostReaction" ADD CONSTRAINT "wallPostReaction_wallPostId_fkey" FOREIGN KEY ("wallPostId") REFERENCES "wallPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallPostReaction" ADD CONSTRAINT "wallPostReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("userid") ON DELETE CASCADE ON UPDATE CASCADE;
