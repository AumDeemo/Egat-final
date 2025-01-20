import fs from 'fs';
import path from 'path';
import { H3Event } from 'h3';
import formidable from 'formidable';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  // Directory for uploads
  const uploadDir = path.join(process.cwd(), 'public', 'file');

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max size
      filter: (part) =>
        part.mimetype?.startsWith('image/') || part.originalFilename?.endsWith('.xlsx'),
    });

    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable parse error:', err);
        return reject(
          createError({
            statusCode: 400,
            statusMessage: 'File upload failed',
            message: err.message,
          })
        );
      }

      try {
        // Validate fields
        const name = fields.name?.toString() || '';
        const brand = fields.brand?.toString() || '';
        const model = fields.model?.toString() || '';
        const num = fields.num?.toString() || '';
        const capacity = fields.capacity?.toString() || '';
        const carry = fields.carry?.toString() || '';
        const carNum = fields.carNum?.toString() || '';

        if (!name || !brand || !model || !num || !capacity || !carry || !carNum) {
          return reject(
            createError({
              statusCode: 400,
              statusMessage: 'Missing required fields',
              message: 'Please fill in all required fields',
            })
          );
        }

        // Handle file upload
        const fileArray = files.file as formidable.File[] | formidable.File | undefined;
        const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
        let imagePath: string | null = null;

        if (file && file.filepath) {
          const fileName = `${Date.now()}_${file.originalFilename}`;
          const newPath = path.join(uploadDir, fileName);

          // Rename file to final destination
          fs.renameSync(file.filepath, newPath);
          imagePath = `/file/${fileName}`;
        }

        // Save machine data in the database
        const newMachine = await prisma.machine.create({
          data: {
            name,
            brand,
            model,
            num,
            capacity,
            carry,
            carNum,
            image: imagePath || null, // Save the file path or null
          },
        });

        // Send back the response
        resolve({
          success: true,
          data: {
            id: newMachine.id,
            name: newMachine.name,
            brand: newMachine.brand,
            model: newMachine.model,
            num: newMachine.num,
            capacity: newMachine.capacity,
            carry: newMachine.carry,
            carNum: newMachine.carNum,
            image: newMachine.image,
          },
        });
      } catch (error) {
        console.error('Error processing machine data:', error);
        reject(
          createError({
            statusCode: 500,
            statusMessage: 'Processing error',
            message: 'Unable to process machine data',
          })
        );
      } finally {
        // Ensure Prisma disconnects
        await prisma.$disconnect();
      }
    });
  });
});
