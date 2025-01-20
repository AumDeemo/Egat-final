import fs from 'fs';
import path from 'path';
import { H3Event } from 'h3';
import formidable from 'formidable';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const uploadDir = path.join(process.cwd(), 'public', 'file');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      filter: (part) => {
        if (part.mimetype && part.mimetype.includes('image')) {
          const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
          return allowedExtensions.some((ext) => 
            part.originalFilename?.toLowerCase().endsWith(ext)
          );
        }
        return true;
      },
    });

    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parse error:', err);
        return reject(createError({
          statusCode: 400,
          statusMessage: 'Form submission failed',
          message: err.message,
        }));
      }

      try {
        let imagePath = null;
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        if (file && file.filepath) {
          const fileName = `${Date.now()}_${file.originalFilename}`;
          const newPath = path.join(uploadDir, fileName);
          fs.renameSync(file.filepath, newPath);
          imagePath = `/file/${fileName}`;
        }

        const machine = await prisma.machine.create({
          data: {
            name: fields.name?.toString() || '',
            brand: fields.brand?.toString() || '',
            model: fields.model?.toString() || '',
            num: fields.num?.toString() || '',
            capacity: fields.capacity?.toString() || '',
            carry: fields.carry?.toString() || '',
            carNum: fields.carNum?.toString() || '',
            image: imagePath,
          },
        });

        resolve({
          success: true,
          data: {
            machine,
            message: 'เพิ่มข้อมูลเครื่องจักรสำเร็จ'
          }
        });

      } catch (error) {
        console.error('Error saving machine data:', error);
        reject(createError({
          statusCode: 500,
          statusMessage: 'Failed to save machine data',
          message: 'ไม่สามารถบันทึกข้อมูลเครื่องจักรได้',
        }));
      } finally {
        await prisma.$disconnect();
      }
    });
  });
});
//api/admin/motor/machines.post.ts