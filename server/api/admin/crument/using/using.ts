import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET method
  if (method === 'GET') {
    return await prisma.using1.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // PUT method
    if (method === 'PUT') {
      const form = formidable({
        uploadDir: './public/crument/using',
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
  
        const usingId = parseInt(fields.id[0]);
        
        const existingusing = await prisma.using1.findUnique({
          where: { id: usingId }
        });
  
        if (!existingusing) {
          return {
            status: 'error',
            message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
          };
        }
  
        let imageUrl = existingusing.imageUrl;
        if (files.image && files.image[0]) {
          // Delete old image if exists
          if (existingusing.imageUrl) {
            const oldImagePath = `./public${existingusing.imageUrl}`;
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          
          const uploadedFile = files.image[0];
          imageUrl = `/crument/using/${uploadedFile.newFilename}`;
        }
  
        const updatedusing = await prisma.using1.update({
          where: { id: usingId },
          data: {
            number: fields.number ? parseInt(fields.number[0]) : existingusing.number,
            name: fields.name ? fields.name[0] : existingusing.name,
            brand: fields.brand ? fields.brand[0] : existingusing.brand,
            curunumber: fields.curunumber ? fields.curunumber[0] : existingusing.curunumber,
            partnumber: fields.partnumber ? fields.partnumber[0] : existingusing.partnumber,
            usenumber: fields.usenumber ? fields.usenumber[0] : existingusing.usenumber,
            date: fields.date ? fields.date[0] : existingusing.date,
            detial: fields.detial ? fields.detial[0] : existingusing.detial,
            detialnumber: fields.detialnumber ? fields.detialnumber[0] : existingusing.detialnumber,
            imageUrl: imageUrl,
          },
        });
  
        return {
          status: 'success',
          message: 'อัปเดตข้อมูลสำเร็จ',
          data: updatedusing,
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