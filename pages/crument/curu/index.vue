<template>
  <div
    class="flex flex-col items-center justify-center mt-0 font-prompt bg-gray-50 min-h-screen select-none"
  >
    <!-- Header -->
    <header
      class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white py-6 px-10 w-full shadow-md"
    >
      <div class="flex items-center justify-between max-w-5xl mx-auto flex-nowrap gap-4">
        <div class="flex items-center gap-4">
          <img
            src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
            alt="logo"
            class="w-16"
          />
          <h1 class="text-2xl font-bold">ระบบจัดการข้อมูลครุภัณฑ์</h1>
        </div>
        <p class="text-sm">การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)</p>
      </div>
    </header>

    <!-- Form Section -->
    <form
      @submit.prevent="curu"
      class="bg-white shadow-lg p-8 rounded-xl w-full max-w-5xl mt-10"
    >
      <h2 class="text-xl font-bold text-gray-800 mb-6 text-center">
        เพิ่มรายการครุภัณฑ์
      </h2>

      <!-- Form Layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="form-control">
          <label class="text-gray-700 font-medium">ลำดับที่</label>
          <input
            v-model="number"
            type="number"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">ชื่อรุ่น</label>
          <input
            v-model="name"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">ยี่ห้อ</label>
          <input
            v-model="brand"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">รหัสครุภัณฑ์</label>
          <input
            v-model="curunumber"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">รหัสสินทรัพย์</label>
          <input
            v-model="partnumber"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">หมายเลขเครื่อง</label>
          <input
            v-model="usenumber"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">วันที่ได้มา</label>
          <input
            v-model="date"
            type="datetime-local"
            class="input-datetime"
            placeholder="เลือกวันที่และเวลา"
          />
        </div>

        <div class="form-control">
          <label class="text-gray-700 font-medium">รายละเอียด</label>
          <input
            v-model="detial"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control">
          <label class="text-gray-700 font-medium">เลขที่ใบโอน</label>
          <input
            v-model="detialnumber"
            type="text"
            class="input input-bordered focus:ring focus:ring-blue-300"
          />
        </div>
        <div class="form-control col-span-3">
          <label class="text-gray-700 font-medium">อัปโหลดรูปภาพ</label>
          <div class="flex flex-col items-center gap-4 mt-4">
            <!-- Image Preview -->
            <div
              class="preview-container w-40 h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md relative"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Selected Image"
                class="w-full h-full object-cover rounded-md"
              />
              <div
                v-if="previewImage"
                class="delete-icon absolute top-1 right-1 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-600"
                @click="clearImage"
              >
                &times;
              </div>
              <p v-else class="text-sm text-gray-400 text-center">Select Image</p>
            </div>

            <!-- Input File -->
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="file-input file-input-bordered w-full md:w-1/2"
            />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-between items-center mt-8">
        <RouterLink to="/admin/crument/curu" class="text-blue-600 hover:underline">
          กลับหน้าแรก
        </RouterLink>
        <button
          type="submit"
          class="btn bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-8 rounded-lg shadow-md transition duration-200"
        >
          ยืนยัน
        </button>
      </div>
    </form>

    <!-- Notification -->
    <div
      v-if="isToastVisible"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const number = ref("");
const name = ref("");
const brand = ref("");
const curunumber = ref("");
const partnumber = ref("");
const usenumber = ref("");
const date = ref("");
const detial = ref("");
const detialnumber = ref("");
const imageFile = ref(null);
const successMessage = ref("");
const previewImage = ref(null);
const isToastVisible = ref(false);
const fileInputRef = ref(null); // ใช้เก็บอ้างอิงของ input file

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  imageFile.value = file;
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

// ฟังก์ชันบันทึกข้อมูล
const curu = async () => {
  try {
    const formData = new FormData();
    formData.append("number", number.value);
    formData.append("name", name.value);
    formData.append("brand", brand.value);
    formData.append("curunumber", curunumber.value);
    formData.append("partnumber", partnumber.value);
    formData.append("usenumber", usenumber.value);
    formData.append("date", date.value);
    formData.append("detial", detial.value);
    formData.append("detialnumber", detialnumber.value);
    formData.append("image", imageFile.value);

    const response = await fetch("/api/admin/crument/curu/curu", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      successMessage.value = result.message;
      number.value = "";
      name.value = "";
      brand.value = "";
      curunumber.value = "";
      partnumber.value = "";
      usenumber.value = "";
      date.value = "";
      detial.value = "";
      detialnumber.value = "";
      imageFile.value = null;
      previewImage.value = null;
      // แสดงแจ้งเตือนลอย
      isToastVisible.value = true;
      // รีเซ็ต input file
      const fileInput = document.querySelector("input[type='file']");
      if (fileInput) fileInput.value = "";

      // ตั้งเวลาให้แจ้งเตือนหายหลัง 2 วินาที
      setTimeout(() => {
        isToastVisible.value = false;
      }, 2000);
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
  }
};

// ฟังก์ชันclearImage
const clearImage = () => {
  previewImage.value = null; // ลบรูปภาพที่แสดง
  imageFile.value = null; // ลบไฟล์ที่เลือก
  if (fileInputRef.value) {
    fileInputRef.value.value = null; // รีเซ็ตช่องเลือกไฟล์
  }
};
</script>
<style scoped>
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}
.alert {
  padding: 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  color: #155724;
  text-align: center;
}
.preview-container {
  position: relative;
  background-color: #f9fafb; /* สีพื้นหลัง */
  display: inline-flex; /* ใช้ flex เพื่อจัดกึ่งกลาง */
  justify-content: center;
  align-items: center;
  border: 1px dashed #ccc;
  border-radius: 8px;
  padding: 10px; /* เพิ่มพื้นที่รอบๆ */
  max-width: 100%; /* จำกัดขนาดสูงสุดของคอนเทนเนอร์ */
  max-height: 300px; /* กำหนดความสูงสูงสุด */
  overflow: auto; /* แสดง scroll หากรูปภาพใหญ่เกิน */
}

.preview-container:hover {
  background-color: #eef6ff; /* สีพื้นหลังเมื่อ hover */
  border-color: #007bff; /* สีขอบเมื่อ hover */
}

.preview-container img {
  max-width: 100%; /* กำหนดให้รูปภาพไม่เกินขนาดคอนเทนเนอร์ */
  max-height: 100%; /* กำหนดให้รูปภาพไม่เกินขนาดคอนเทนเนอร์ */
  width: auto; /* ให้ขนาดปรับตามรูป */
  height: auto; /* ให้ขนาดปรับตามรูป */
  border-radius: 8px; /* มุมมน */
  object-fit: contain; /* ปรับการแสดงรูปภาพให้คงสัดส่วน */
}

.file-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  font-size: 0.875rem; /* ขนาดตัวอักษร */
  color: #555;
  background-color: #f9fafb; /* สีพื้นหลัง */
  transition: border-color 0.3s ease-in-out;
}

.file-input:hover {
  border-color: #007bff; /* สีขอบเมื่อ hover */
}

.file-input:focus {
  border-color: #0056b3; /* สีขอบเมื่อ focus */
  outline: none;
}
.select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  font-size: 0.875rem;
  color: #555;
  background-color: #f9fafb;
  transition: border-color 0.3s ease-in-out;
}

.select:hover {
  border-color: #007bff;
}

.select:focus {
  border-color: #0056b3;
  outline: none;
}
/* เพิ่มการตกแต่งฟอร์มหมวดหมู่ */
.form-control .cursor-pointer {
  font-family: "Prompt", sans-serif;
}

.form-control .cursor-pointer span {
  font-size: 1rem;
}

.form-control input[type="checkbox"] {
  transform: scale(1.2);
  transition: all 0.2s ease-in-out;
}

.form-control input[type="checkbox"]:hover {
  transform: scale(1.3);
}

.form-control .hover\:bg-gray-100:hover {
  background-color: #f3f4f6; /* สีพื้นหลังเมื่อ hover */
}

.form-control .accent-blue-500:checked {
  background-color: #2563eb; /* เปลี่ยนสีเมื่อถูกเลือก */
  border-color: #2563eb;
}

.form-control .rounded-md {
  border-radius: 8px;
}
/* เมนูย่อย */
.bg-blue-50 {
  background-color: #ebf8ff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.hover\:bg-blue-50:hover {
  background-color: #ebf8ff;
}

.rounded-lg {
  border-radius: 0.75rem;
}

.transition {
  transition: all 0.3s ease-in-out;
}

.max-h-60 {
  max-height: 15rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Checkbox ปรับขนาด */
input[type="checkbox"] {
  transform: scale(1.2);
  transition: all 0.2s ease-in-out;
}

input[type="checkbox"]:hover {
  transform: scale(1.3);
}

/* เพิ่มไอคอน */
svg {
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .preview-container {
    width: 80px;
    height: 80px;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.25rem;
  }

  .form-control {
    grid-column: span 1 / span 1;
  }
}

@media (max-width: 480px) {
  header {
    flex-direction: column;
    text-align: center;
  }

  h1 {
    font-size: 1.25rem;
  }

  .form-control {
    grid-column: span 1 / span 1; /* แสดงแบบเต็มแถวในหน้าจอเล็ก */
  }

  .preview-container {
    width: 80px;
    height: 80px;
  }
}
/* ตกแต่งช่องเลือกวันที่ */
.input-datetime {
  appearance: none;
  background-color: #f9fafb;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: #555;
  transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  width: 100%;
}

.input-datetime:hover {
  border-color: #007bff;
  background-color: #eef6ff;
}

.input-datetime:focus {
  border-color: #0056b3;
  outline: none;
  background-color: #e0f2fe;
}

.input-datetime::-webkit-calendar-picker-indicator {
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.input-datetime::-webkit-calendar-picker-indicator:hover {
  background-color: #0056b3;
}
</style>
