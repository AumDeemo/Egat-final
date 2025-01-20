import { PrismaClient } from '@prisma/client'
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    if (event.node.req.method !== 'PUT') {
        return { 
            statusCode: 405, 
            body: { message: "Method not allowed" } 
        };
    }

    try {
        const materialId = event.context.params.id;
        
        if (!materialId || isNaN(parseInt(materialId))) {
            return { 
                statusCode: 400, 
                body: { message: "Invalid material ID" } 
            };
        }

        const material = await prisma.material.findUnique({
            where: { id: parseInt(materialId) },
        });

        if (!material) {
            return { 
                statusCode: 404, 
                body: { message: "Material not found" } 
            };
        }

        // Setup upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'material');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Configure formidable with proper options
        const form = formidable({
            uploadDir,
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024,
            multiples: false,
            filename: (name, ext, part, form) => {
                // Generate a unique filename
                return `${Date.now()}-${part.originalFilename}`;
            }
        });

        // Parse the form data
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(event.node.req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        // Get the uploaded file
        const imageFile = files.image?.[0] || files.image; // Handle both formidable v3 and v4
        
        if (!imageFile || !imageFile.filepath) {
            return { 
                statusCode: 400, 
                body: { message: "No valid file uploaded" } 
            };
        }

        // Delete old image if it exists
        if (material.imageUrl) {
            const oldImagePath = path.join(process.cwd(), 'public', material.imageUrl.replace(/^\//, ''));
            try {
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            } catch (error) {
                console.error('Error deleting old image:', error);
                // Continue with the update even if old file deletion fails
            }
        }

        // Get the new filename and create the URL path
        const newFilename = path.basename(imageFile.filepath);
        const imageUrl = `/material/${newFilename}`;

        // Update database with new image URL
        const updatedMaterial = await prisma.material.update({
            where: { id: parseInt(materialId) },
            data: { imageUrl }
        });

        return { 
            statusCode: 200, 
            body: { 
                message: "Image updated successfully",
                data: updatedMaterial 
            } 
        };

    } catch (error) {
        console.error('Error updating material image:', error);
        return { 
            statusCode: 500, 
            body: { 
                message: "Internal server error",
                error: error.message 
            } 
        };
    }
});