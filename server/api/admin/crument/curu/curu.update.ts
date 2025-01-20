import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'PUT') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed',
    });
  }

  // Create upload directory if it doesn't exist
  const uploadDir = path.resolve('./public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5 MB
  });

  try {
    // Parse form data
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    console.log('Fields:', fields);
    console.log('Files:', files);

    // Validate required fields
    const curuId = parseInt(fields.id?.[0], 10); // Ensure curuId is a number
    if (!curuId) {
      throw createError({
        statusCode: 400,
        message: 'Invalid or missing ID',
      });
    }

    // Find existing CURU
    const existingCURU = await prisma.curu.findUnique({
      where: { id: curuId },
    });
    if (!existingCURU) {
      throw createError({
        statusCode: 404,
        message: 'CURU not found',
      });
    }

    // Handle image upload
    let imageUrl = existingCURU.imageUrl;
    if (files.image && files.image[0]) {
      // Delete old image if it exists
      if (existingCURU.imageUrl) {
        const oldImagePath = path.resolve(`./public${existingCURU.imageUrl}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const uploadedFile = files.image[0];
      imageUrl = `/uploads/${uploadedFile.newFilename}`;
    }

    // Prepare update data
    const updateData = {
      number: fields.number?.[0] ? parseInt(fields.number[0], 10) : existingCURU.number,
      name: fields.name?.[0] || existingCURU.name,
      brand: fields.brand?.[0] || existingCURU.brand,
      curunumber: fields.curunumber?.[0] || existingCURU.curunumber,
      partnumber: fields.partnumber?.[0] || existingCURU.partnumber,
      usenumber: fields.usenumber?.[0] || existingCURU.usenumber,
      date: fields.date?.[0] ? new Date(fields.date[0]) : existingCURU.date,
      detial: fields.detial?.[0] || existingCURU.detial,
      detialnumber: fields.detialnumber?.[0] || existingCURU.detialnumber,
      imageUrl,
    };

    console.log('Update Data:', updateData);

    // Update record in database
    const updatedCURU = await prisma.curu.update({
      where: { id: curuId },
      data: updateData,
    });

    return {
      status: 'success',
      message: 'CURU updated successfully',
      data: updatedCURU,
    };
  } catch (error) {
    console.error('Error updating CURU:', error);
    throw createError({
      statusCode: 500,
      message: `Failed to update CURU: ${error.message}`,
    });
  }
});
