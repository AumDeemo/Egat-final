import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const materialId = Number(query.materialId);

  if (!materialId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ต้องระบุ materialId'
    });
  }

  try {
    // ดึงประวัติการนำเข้า
    const importHistory = await prisma.importHistory.findMany({
      where: { materialId },
      orderBy: { date: 'desc' }
    });

    // ดึงประวัติการนำออก
    const exportHistory = await prisma.exportHistory.findMany({
      where: { materialId },
      orderBy: { date: 'desc' }
    });

    return {
      importHistory,
      exportHistory
    };
  } catch (error) {
    console.error('Error fetching material history:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'เกิดข้อผิดพลาดในการดึงประวัติ'
    });
  }
});
//api//admin/material-history.ts//