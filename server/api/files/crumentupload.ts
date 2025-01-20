import { defineEventHandler } from 'h3';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  try {
    // ระบุโฟลเดอร์อัปโหลด
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Uploads directory created:', uploadDir);
    }

    // ตั้งค่า Formidable
    const form = formidable({
      uploadDir, // เก็บไฟล์ที่อัปโหลด
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // ขนาดไฟล์สูงสุด 10 MB
    });

    // Parsing Request
    const { files } = await new Promise<{ fields: any; files: formidable.Files }>((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    console.log('Files received:', files);

    const uploadedFile = files.file as File;
    if (!uploadedFile || !uploadedFile.filepath) {
      throw new Error('File upload failed: No file path found');
    }

    console.log('Uploaded File Path:', uploadedFile.filepath);

    // ตอบกลับพร้อมข้อมูลไฟล์
    return {
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: uploadedFile.originalFilename || uploadedFile.newFilename,
        path: `/uploads/${path.basename(uploadedFile.filepath)}`,
      },
    };
  } catch (error) {
    console.error('Error during file upload:', error.message);
    return {
      success: false,
      message: 'Upload failed',
      error: error.message,
    };
  }
});
