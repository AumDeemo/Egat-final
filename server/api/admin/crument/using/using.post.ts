import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable from 'formidable';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const form = formidable({
        uploadDir: './public/crument/using',
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024,
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

        const using = await prisma.using1.create({
            data: {
                number: fields.number[0] ? parseInt(fields.number[0]) : null,
                name: fields.name[0] ,
                brand: fields.brand[0],
                curunumber: fields.curunumber[0],
                partnumber: fields.partnumber[0],
                usenumber: fields.usenumber[0],
                date: fields.date[0] ? new Date(fields.date[0]) : null,
                detial: fields.detial[0],
                detialnumber: fields.detialnumber[0],
                imageUrl: fileName ? `/crument/using/${fileName}` : null,
            },
        });

        return {
            status: 'success',
            message: 'บันทึกข้อมูลสำเร็จ',
            data: using,
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            status: 'error',
            message: `เกิดข้อผิดพลาด: ${error.message}`,
        };
    }
});
