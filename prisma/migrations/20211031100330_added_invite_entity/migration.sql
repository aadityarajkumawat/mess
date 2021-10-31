-- CreateTable
CREATE TABLE "Invite" (
    "id" SERIAL NOT NULL,
    "fromUser" INTEGER NOT NULL,
    "toUser" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);
