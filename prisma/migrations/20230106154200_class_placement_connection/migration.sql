-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
