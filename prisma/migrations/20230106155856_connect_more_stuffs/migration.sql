-- AddForeignKey
ALTER TABLE "OrderFinalized" ADD CONSTRAINT "OrderFinalized_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFinalized" ADD CONSTRAINT "OrderFinalized_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "OrderCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Placement" ADD CONSTRAINT "Placement_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "OrderCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
