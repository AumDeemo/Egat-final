import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { username, password, confirmPassword, fullname ,role} = await readBody(event);

    if (password !== confirmPassword) {
        throw createError({
            statusCode: 400,
            message: 'รหัสผ่านไม่เหมือนกัน',
        });
    }

    const existingUser = await prisma.user.findUnique({
        where: { username },
    });

    if (existingUser) {
        throw createError({
            statusCode: 400,
            message: 'ผู้ใช้นี้มีอยู่ในระบบแล้ว',
        });
    }

    const hashedPassword = await bcrypt.hash((password), 10);

    // Create new user
    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            fullname,
            role: role || 'admin',
        },
    });

    return {
        message: 'User registered successfully',
        user: newUser,
    };
});