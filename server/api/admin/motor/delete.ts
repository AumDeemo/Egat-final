import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '', 10); // ดึง ID จาก URL

    if (!id || isNaN(id)) {
      throw createError({ statusCode: 400, message: 'Invalid ID' });
    }

    // ดึงข้อมูลเครื่องจักรก่อนลบเพื่อดูว่ามีรูปภาพหรือไม่
    const motor = await prisma.machine.findUnique({ where: { id } });
    if (!motor) {
      throw createError({ statusCode: 404, message: 'Motor not found' });
    }

    // ลบไฟล์รูปภาพในระบบ ถ้ามี
    if (motor.image) {
      const imagePath = path.join(process.cwd(), 'public', motor.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // ลบไฟล์
      }
    }

    // ลบข้อมูลในฐานข้อมูล
    await prisma.machine.delete({ where: { id } });

    return {
      success: true,
      message: 'ลบข้อมูลสำเร็จ',
    };
  } catch (error) {
    console.error('Error deleting motor:', error);
    throw createError({ statusCode: 500, message: 'Failed to delete motor' });
  } finally {
    await prisma.$disconnect();
  }
});
//api//admin//motor//delete.ts
