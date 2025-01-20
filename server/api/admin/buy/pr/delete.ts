// api/admin/pr/delete.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    throw createError({ statusCode: 400, message: "Missing file ID" });
  }

  try {
    // ลบไฟล์จากฐานข้อมูลตาม ID
    const deletedFile = await prisma.filePR.delete({
      where: { id },
    });

    return { message: "File deleted successfully", file: deletedFile };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, message: "Failed to delete file" });
  }
});
