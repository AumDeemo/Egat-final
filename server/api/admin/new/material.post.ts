import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Configure formidable for file upload
    const form = formidable({
        uploadDir: './public/material',
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    try {
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const uploadedFile = files.image[0];
        const fileName = uploadedFile.newFilename;

        const material = await prisma.material.create({
            data: {
                name: fields.name[0],
                partnumber: fields.partnumber[0],
                totalAmount: parseInt(fields.totalAmount[0]),
                imageUrl: fileName ? `/material/${fileName}` : null,
                category: fields.category[0],
            },
        });

        return {
            status: 'success',
            message: 'บันทึกข้อมูลสำเร็จ',
            data: material,
        };

    } catch (error) {
        // If there's an error, delete the uploaded file if it exists
        if (uploadedFile && fs.existsSync(uploadedFile.filepath)) {
            fs.unlinkSync(uploadedFile.filepath);
        }

        return {
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
            error: error.message,
        };
    }
})
//material.post.ts//