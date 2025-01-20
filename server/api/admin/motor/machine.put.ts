import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // รับข้อมูลจาก body
    const body = await readBody(event);

    const {
      id, // ID ของ machine ที่ต้องการแก้ไข
      name,
      brand,
      model,
      num,
      capacity,
      carry,
      carNum,
      image,
    } = body;

    // ตรวจสอบว่ามี ID ที่ต้องการแก้ไขหรือไม่
    if (!id) {
      throw new Error("Machine ID is required");
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedMachine = await prisma.machine.update({
      where: { id: Number(id) },
      data: {
        name,
        brand,
        model,
        num,
        capacity,
        carry,
        carNum,
        image, // Image URL (ถ้ามี)
      },
    });

    // ส่งข้อมูลที่อัปเดตกลับไป
    return {
      status: 200,
      message: "Machine updated successfully",
      data: updatedMachine,
    };
  } catch (error) {
    console.error("Error updating machine:", error);

    // จัดการข้อผิดพลาดและส่งกลับ
    return {
      status: 500,
      message: "An error occurred while updating the machine",
    };
  } finally {
    await prisma.$disconnect(); // ปิดการเชื่อมต่อกับฐานข้อมูล
  }
});
//api/admin/motor/machine.put.ts