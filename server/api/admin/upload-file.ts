import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // อ่านไฟล์ที่ถูกส่งมา
    const formData = await readMultipartFormData(event);

    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded.' });
    }

    const uploadDir = path.resolve('./public/file');
    await mkdir(uploadDir, { recursive: true }); // สร้างโฟลเดอร์หากไม่มี

    // ดึงไฟล์ออกจาก formData
    const fileData = formData.find((field) => field.name === 'file');
    if (!fileData || !fileData.filename) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid file data.' });
    }

    const filePath = path.join(uploadDir, fileData.filename);

    // บันทึกไฟล์ลงในโฟลเดอร์ /public/file
    await writeFile(filePath, fileData.data);

    // บันทึกข้อมูลลงในฐานข้อมูล
    const savedFile = await prisma.file.create({
      data: {
        name: fileData.filename,
        path: `/file/${fileData.filename}`,
      },
    });

    return {
      success: true,
      file: savedFile,
    };
  } catch (error) {
    console.error(error);
    throw createError({ statusCode: 500, statusMessage: 'Upload failed.' });
  }
});
