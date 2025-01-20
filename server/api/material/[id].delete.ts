import { PrismaClient } from '@prisma/client'


export default defineEventHandler(async (event) => {
    const prisma = new PrismaClient()
    
    try {
        const id = getRouterParam(event, 'id')
        
        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Material ID is required'
            })
        }

        // Delete related import and export histories first
        await prisma.importHistory.deleteMany({
            where: { materialId: Number(id) }
        })

        await prisma.exportHistory.deleteMany({
            where: { materialId: Number(id) }
        })
        // Then delete the material
        await prisma.material.delete({
            where: { id: Number(id) }
        })
        return { message: 'Material deleted successfully' }
    } catch (error) {
        console.error('Error deleting material:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to delete material'
        })
    } finally {
        await prisma.$disconnect()
    }
})