import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { materialId, quantity, type } = body;

      if (!materialId || !quantity || !type) {
        throw createError({
          statusCode: 400,
          statusMessage: 'ข้อมูลไม่ครบถ้วน'
        });
      }

      const material = await prisma.material.findUnique({
        where: { id: materialId }
      });

      if (!material) {
        throw createError({
          statusCode: 404,
          statusMessage: 'ไม่พบวัสดุ'
        });
      }

      let updatedMaterial;
      if (type === 'import') {
        // Add to total amount
        updatedMaterial = await prisma.material.update({
          where: { id: materialId },
          data: { 
            totalAmount: material.totalAmount + quantity,
            importHistory: {
              create: {
                quantity,
                date: new Date()
              }
            }
          }
        });
      } else if (type === 'export') {
        if (material.totalAmount < quantity) {
          throw createError({
            statusCode: 400,
            statusMessage: 'จำนวนวัสดุไม่เพียงพอ'
          });
        }

        updatedMaterial = await prisma.material.update({
          where: { id: materialId },
          data: { 
            totalAmount: material.totalAmount - quantity,
            exportHistory: {
              create: {
                quantity,
                date: new Date()
              }
            }
          }
        });
      } else {
        throw createError({
          statusCode: 400,
          statusMessage: 'ประเภทการดำเนินการไม่ถูกต้อง'
        });
      }

      return updatedMaterial;

    } catch (error) {
      // Handle any errors
      console.error('Error in material action:', error);
      throw error;
    }
  }

  // Handle unsupported methods
  throw createError({
    statusCode: 405,
    statusMessage: 'วิธีการไม่ได้รับอนุญาต'
  });
});
//api/admin/material-action.ts