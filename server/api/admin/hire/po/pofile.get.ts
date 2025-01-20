import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const files = await prisma.hireFilePO.findMany()
    return files
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch files',
    })
  }
})
