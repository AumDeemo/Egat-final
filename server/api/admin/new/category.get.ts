import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const categories = await prisma.material.findMany({
      select: {
        category: true,
      },
      distinct: ['category'], // ดึงหมวดหมู่ที่ไม่ซ้ำกัน
    });

    return {
      "status": 'success',
      "data": ["ENGINE RELATED PARTS(ชิ้นส่วนที่เกี่ยวข้องกับเครื่องยนต์)", 
        "ELECTRICAL SYSTEMS(ระบบไฟฟ้า)", 
        "POWER TRAIN & DRIVE SHAFT & DIFFRENTIAL AND WHEELS(ระบบส่งกำลัง เพลาขับ เฟืองท้าย และล้อ)", 
        "AIR SYSTEM(ระบบอากาศ)", 
        "STEERING AND CONTROL SYSTEM(ระบบบังคับเลี้ยวและควบคุม)", 
        "FRAME AND GUARDS(เฟรมและการ์ด)", 
        "HYDRAULIC SYSTEM(ระบบไฮดรอลิก)", 
        "BODY(ส่วนกระบะดั๊มและส่วนกระบะเทท้าย)", 
        "FIRE PROTECTION SYSTEM(ระบบป้องกันอัคคีภัย)", 
        "CENTRALISED LUBRICATION(ระบบหล่อลื่นแบบรวมศูนย์)", 
        "AIR CONDITIONER / HEATER INST. AND ASSY.(ชุดติดตั้งและประกอบเครื่องปรับอากาศ / เครื่องทำความร้อน)", 
        "DECAL INSTALLATION AND TOOLS(การติดตั้งสติ๊กเกอร์/ป้ายตกแต่ง และเครื่องมือ)", 
        "KIT(ชุดเครื่องมือ)"]
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'ไม่สามารถดึงข้อมูลหมวดหมู่ได้',
    };
  }
});
//api/admin/new/category.get.ts