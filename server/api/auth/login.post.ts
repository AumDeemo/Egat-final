//server/api/auth/login.post.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody(event);
    console.log('Received login data:', { username, password });

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        console.log('User not found:', username);
        throw createError({
            statusCode: 400,
            message: 'User not found.',
        });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log('Invalid password for user:', username);
        throw createError({
            statusCode: 400,
            message: 'Invalid credentials.',
        });
    }

    // Create a token
    const token = jwt.sign({ userId: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
    console.log('Login successful, token generated:', token);
    
    return {
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role, // ส่ง role กลับมาด้วย
        },
    };
});