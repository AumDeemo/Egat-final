import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  // GET method
  if (method === 'GET') {
    return await prisma.material.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // POST method
  if (method === 'POST') {
    const form = formidable({
      uploadDir: './public/material',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    try {
      const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });

      let imageUrl = null;
      if (files.image && files.image[0]) {
        const uploadedFile = files.image[0];
        imageUrl = `/material/${uploadedFile.newFilename}`;
      }

      const material = await prisma.material.create({
        data: {
          name: fields.name[0],
          partNumber: fields.partnumber[0],
          totalAmount: parseInt(fields.totalAmount[0]),
          imageUrl: imageUrl,
        },
      });

      return {
        status: 'success',
        message: 'บันทึกข้อมูลสำเร็จ',
        data: material,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        error: error.message,
      };
    }
  }

  // PUT method
  if (method === 'PUT') {
    const form = formidable({
      uploadDir: './public/material',
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

      const materialId = parseInt(fields.id[0]);
      
      const existingMaterial = await prisma.material.findUnique({
        where: { id: materialId }
      });

      if (!existingMaterial) {
        return {
          status: 'error',
          message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
        };
      }

      let imageUrl = existingMaterial.imageUrl;
      if (files.image && files.image[0]) {
        // Delete old image if exists
        if (existingMaterial.imageUrl) {
          const oldImagePath = `./public${existingMaterial.imageUrl}`;
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        const uploadedFile = files.image[0];
        imageUrl = `/material/${uploadedFile.newFilename}`;
      }

      const updatedMaterial = await prisma.material.update({
        where: { id: materialId },
        data: {
          name: fields.name ? fields.name[0] : existingMaterial.name,
          partnumber: fields.partnumber ? fields.partnumber[0] : existingMaterial.partNumber,
          totalAmount: fields.totalAmount ? parseInt(fields.totalAmount[0]) : existingMaterial.totalAmount,
          imageUrl: imageUrl,
        },
      });

      return {
        status: 'success',
        message: 'อัปเดตข้อมูลสำเร็จ',
        data: updatedMaterial,
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

      const material = await prisma.material.findUnique({
        where: { id }
      });

      if (material?.imageUrl) {
        const imagePath = `./public${material.imageUrl}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await prisma.material.delete({
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
//api//admin//material.ts