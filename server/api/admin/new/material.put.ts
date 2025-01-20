import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import formidable from 'formidable'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const form = formidable({
        uploadDir: './public/material',
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    try {
        // Parse the multipart form data
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(event.req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const materialId = parseInt(fields.id[0]);

        // Get existing material record
        const existingMaterial = await prisma.material.findUnique({
            where: { id: materialId }
        });

        if (!existingMaterial) {
            return {
                status: 'error',
                message: 'ไม่พบข้อมูลที่ต้องการแก้ไข',
            };
        }

        // Handle file upload if new image is provided
        let imageUrl = existingMaterial.imageUrl;
        if (files.image && files.image[0]) {
            // Delete old image if it exists
            const oldImagePath = `./public${existingMaterial.imageUrl}`;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Set new image URL
            const uploadedFile = files.image[0];
            imageUrl = `/material/${uploadedFile.newFilename}`;
        }

        // Update material record
        const updatedMaterial = await prisma.material.update({
            where: { id: materialId },
            data: {
                name: fields.name ? fields.name[0] : existingMaterial.name,
                partnumber: fields.partnumber ? fields.partnumber[0] : existingMaterial.partnumber,
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
        // If there's an error and a new file was uploaded, delete it
        if (files?.image?.[0] && fs.existsSync(files.image[0].filepath)) {
            fs.unlinkSync(files.image[0].filepath);
        }

        return {
            status: 'error',
            message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
            error: error.message,
        };
    }
})