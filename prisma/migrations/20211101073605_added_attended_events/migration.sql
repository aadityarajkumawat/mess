-- CreateTable
CREATE TABLE "AttendEvents" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AttendEvents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttendEvents" ADD CONSTRAINT "AttendEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendEvents" ADD CONSTRAINT "AttendEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
