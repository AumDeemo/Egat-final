import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import { parse } from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET method
  if (method === 'GET') {
    return await prisma.curu.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // PUT method
    if (method === 'PUT') {
      const form = formidable({
        uploadDir: './public/crument/curu',
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
  
        const curuId = parseInt(fields.id[0]);
        
        const existingcuru = await prisma.curu.findUnique({
          where: { id: curuId }
        });
  
        if (!existingcuru) {
          return {
            status: 'error',
            message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
          };
        }
  
        let imageUrl = existingcuru.imageUrl;
        if (files.image && files.image[0]) {
          // Delete old image if exists
          if (existingcuru.imageUrl) {
            const oldImagePath = `./public${existingcuru.imageUrl}`;
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
          
          const uploadedFile = files.image[0];
          imageUrl = `/crument/curu/${uploadedFile.newFilename}`;
        }
  
        const updatedcuru = await prisma.curu.update({
          where: { id: curuId },
          data: {
            number: fields.number ? parseInt(fields.number[0]) : existingcuru.number,
            name: fields.name ? fields.name[0] : existingcuru.name,
            brand: fields.brand ? fields.brand[0] : existingcuru.brand,
            curunumber: fields.curunumber ? fields.curunumber[0] : existingcuru.curunumber,
            partnumber: fields.partnumber ? fields.partnumber[0] : existingcuru.partnumber,
            usenumber: fields.usenumber ? fields.usenumber[0] : existingcuru.usenumber,
            date: fields.date ? fields.date[0] : existingcuru.date,
            detial: fields.detial ? fields.detial[0] : existingcuru.detial,
            detialnumber: fields.detialnumber ? fields.detialnumber[0] : existingcuru.detialnumber,
            imageUrl: imageUrl,
          },
        });
  
        return {
          status: 'success',
          message: 'อัปเดตข้อมูลสำเร็จ',
          data: updatedcuru,
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
          error: error.message,
        };
      }
    }
  
    // DELETE method
    if (method === 'DELETE') {
      try {
        const query = getQuery(event);
        const id = Number(query.id);
  
        const curu = await prisma.curu.findUnique({
          where: { id }
        });
  
        if (curu?.imageUrl) {
          const imagePath = `./public${curu.imageUrl}`;
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
  
        await prisma.curu.delete({
          where: { id }
        });
  
        return {
          status: 'success',
          message: 'ลบข้อมูลสำเร็จ'
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'เกิดข้อผิดพลาดในการลบข้อมูล',
          error: error.message
        };
      }
    }
  });
  //api/admin/crument/curu/curu.ts