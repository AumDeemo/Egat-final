import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET method
  if (method === 'GET') {
    return await prisma.using10000.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // PUT method
    if (method === 'PUT') {
      const form = formidable({
        uploadDir: './public/crument/using10000',
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024,
      });
  
      try {
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(event.node.req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });
  
        const using10000Id = parseInt(fields.id[0]);
        
        const existingusing10000 = await prisma.using10000.findUnique({
          where: { id: using10000Id }
        });
  
        if (!existingusing10000) {
          return {
            status: 'error',
            message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
          };
        }
  
        let imageUrl = existingusing10000.imageUrl;
        if (files.image && files.image[0]) {
          // Delete old image if exists
          if (existingusing10000.imageUrl) {
            const oldImagePath = `./public${existingusing10000.imageUrl}`;
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          
          const uploadedFile = files.image[0];
          imageUrl = `/crument/using10000/${uploadedFile.newFilename}`;
        }
  
        const updatedusing10000 = await prisma.using10000.update({
          where: { id: using10000Id },
          data: {
            number: fields.number ? parseInt(fields.number[0]) : existingusing10000.number,
            name: fields.name ? fields.name[0] : existingusing10000.name,
            brand: fields.brand ? fields.brand[0] : existingusing10000.brand,
            curunumber: fields.curunumber ? fields.curunumber[0] : existingusing10000.curunumber,
            partnumber: fields.partnumber ? fields.partnumber[0] : existingusing10000.partnumber,
            usenumber: fields.usenumber ? fields.usenumber[0] : existingusing10000.usenumber,
            date: fields.date ? fields.date[0] : existingusing10000.date,
            detial: fields.detial ? fields.detial[0] : existingusing10000.detial,
            detialnumber: fields.detialnumber ? fields.detialnumber[0] : existingusing10000.detialnumber,
            imageUrl: imageUrl,
          },
        });
  
        return {
          status: 'success',
          message: 'อัปเดตข้อมูลสำเร็จ',
          data: updatedusing10000,
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
          error: error.message,
        };
      }
    }
  
  });