import { PrismaClient } from "@prisma/client";
import { createError } from "h3";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const prisma = new PrismaClient();

// กำหนดที่เก็บไฟล์
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  }),
});

// ใช้ `defineEventHandler` ร่วมกับ multer
export default defineEventHandler(async (event) => {
  await new Promise((resolve, reject) => {
    upload.single("image")(event.req, event.res, (err) => {
      if (err) return reject(err);
      resolve(null);
    });
  });

  try {
    const { name, partnumber, totalAmount } = event.req.body; // อ่านข้อมูลจาก body
    const imageFile = event.req.file;

    if (!name || !totalAmount) {
      throw createError({ statusCode: 400, message: "ข้อมูลไม่ครบถ้วน" });
    }

    const existingMaterial = await prisma.material.findFirst({ where: { name } });
    if (existingMaterial) {
      throw createError({ statusCode: 400, message: "ชื่ออะไหล่ซ้ำในฐานข้อมูล" });
    }

    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;

    const newMaterial = await prisma.material.create({
      data: {
        name,
        partnumber,
        totalAmount: parseInt(totalAmount, 10),
        imageUrl,
      },
    });

    return {
      success: true,
      message: "เพิ่มข้อมูลสำเร็จ",
      data: newMaterial,
    };
  } catch (error) {
    console.error("Error:", error.message);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
    });
  }
});
