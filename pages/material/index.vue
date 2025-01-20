<template>
  <div
    class="flex items-center justify-center font-prompt bg-gradient-to-b from-blue-50 to-white min-h-screen"
  >
    <form
      @submit.prevent="material"
      class="card w-full max-w-xl bg-white shadow-lg border border-gray-200 rounded-lg"
    >
      <div class="card-body px-8 py-6">
        <!-- Header -->
        <div class="flex justify-center mb-6">
          <div class="flex items-center space-x-4">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
              alt="EGAT Logo"
              class="w-16 h-auto"
            />
            <p class="text-2xl font-semibold text-blue-800">บันทึกรายการ</p>
          </div>
        </div>

        <!-- Divider -->
        <hr class="border-t border-gray-300 mb-6" />

        <!-- Horizontal Form Fields -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="form-control">
            <label class="text-sm font-medium text-gray-700">ชื่ออะไหล่</label>
            <input
              v-model="name"
              type="text"
              placeholder="ระบุชื่ออะไหล่"
              class="input input-bordered border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
          </div>
          <div class="form-control">
            <label class="text-sm font-medium text-gray-700">Part number</label>
            <input
              v-model="partnumber"
              type="text"
              placeholder="ระบุ Part number"
              class="input input-bordered border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
          </div>
          <div class="form-control">
            <label class="text-sm font-medium text-gray-700">จำนวน</label>
            <input
              v-model="totalAmount"
              type="number"
              placeholder="ระบุจำนวน"
              class="input input-bordered border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
          </div>
        </div>

        <!-- ฟอร์มเปิด-ปิด หมวดหมู่ -->
        <div class="form-control mt-5 select-none relative" ref="dropdownRef">
          <label
            @click="toggleCategory"
            class="cursor-pointer flex items-center justify-between bg-blue-500 text-white p-3 border border-blue-600 rounded-md shadow-md hover:bg-blue-600"
          >
            <span class="font-semibold">หมวดหมู่</span>
            <span
              class="ml-2 transition-transform duration-300"
              :class="{ 'rotate-180': isCategoryOpen }"
            >
              ▼
            </span>
          </label>
          <!-- เมนูย่อย -->
          <div
            v-if="isCategoryOpen"
            class="absolute bg-white p-4 rounded-lg border border-gray-300 shadow-xl mt-16 w-full z-50 max-h-60 overflow-y-auto"
          >
            <ul class="space-y-2">
              <li
                v-for="cat in categories"
                :key="cat"
                class="flex items-center gap-3 py-2 px-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition duration-200"
              >
                <input
                  type="checkbox"
                  :id="cat"
                  :value="cat"
                  v-model="category"
                  class="cursor-pointer accent-blue-500"
                />
                <label
                  :for="cat"
                  class="flex items-center gap-2 text-gray-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                  {{ cat }}
                </label>
              </li>
            </ul>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="form-control mt-6">
          <label class="font-medium text-gray-700">อัปโหลดรูปภาพ</label>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            class="file-input file-input-bordered border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md"
          />
          <div class="mt-4 flex justify-center">
            <div
              class="preview-container w-32 h-32 flex items-center justify-center border border-dashed border-gray-300 rounded-md relative hover:border-blue-400 cursor-pointer"
              @click="selectImage"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="Selected Image"
                class="w-full h-full object-cover rounded-md"
                @click="clearImage"
              />
              <div
                v-if="previewImage"
                class="delete-icon absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-red-600"
                @click="clearImage"
              >
                &times;
              </div>
              <p v-else class="text-center text-sm text-gray-400">Select Image</p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-control mt-6">
          <button
            type="submit"
            class="btn bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow-md"
          >
            ยืนยัน
          </button>
        </div>

        <!-- Back Button -->
        <RouterLink to="/admin/sparepartslist" class="block mt-6 text-center">
          <p class="text-blue-600 hover:underline">กลับหน้าแรก</p>
        </RouterLink>
      </div>
    </form>

    <!-- Toast Notification -->
    <div
      v-if="isToastVisible"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const name = ref("");
const partnumber = ref("");
const totalAmount = ref("");
const imageFile = ref(null);
const successMessage = ref("");
const previewImage = ref(null);
const fileInputRef = ref(null); // ใช้เก็บอ้างอิงของ input file
const category = ref([]);
const categories = ref([]); // ตัวแปรสำหรับเก็บรายการหมวดหมู่
const isCategoryOpen = ref(false); // สำหรับควบคุมเปิด-ปิดฟอร์มหมวดหมู่
const isToastVisible = ref(false);
const dropdownRef = ref(null); // อ้างอิงสำหรับเมนูย่อย

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  imageFile.value = file;
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

// ฟังก์ชันบันทึกข้อมูล
const material = async () => {
  try {
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("partnumber", partnumber.value);
    formData.append("totalAmount", totalAmount.value);

    // แปลงค่าหมวดหมู่เป็นสตริงที่คั่นด้วยคอมม่า
    formData.append("category", category.value.join(","));

    formData.append("image", imageFile.value);

    const response = await fetch("/api/admin/new/material", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.status === "success") {
      successMessage.value = result.message;
      name.value = "";
      partnumber.value = "";
      totalAmount.value = "";
      category.value = [];
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

// ดึงรายการหมวดหมู่จาก API
onMounted(async () => {
  try {
    const response = await fetch("/api/admin/new/category");
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data; // เก็บรายการหมวดหมู่ในตัวแปร
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});
// ฟังก์ชันเปิด-ปิดฟอร์มหมวดหมู่
const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};

// ฟังก์ชันclearImage
const clearImage = () => {
  previewImage.value = null; // ลบรูปภาพที่แสดง
  imageFile.value = null; // ลบไฟล์ที่เลือก
  if (fileInputRef.value) {
    fileInputRef.value.value = null; // รีเซ็ตช่องเลือกไฟล์
  }
};
// ฟังก์ชันจัดการคลิกนอกเมนูย่อย
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isCategoryOpen.value = false; // ปิดเมนูย่อยเมื่อคลิกนอกพื้นที่
  }
};

onMounted(() => {
  // เพิ่ม event listener สำหรับการคลิก
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  // ลบ event listener เมื่อ component ถูกทำลาย
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
/* Font and Base Styling */
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}

.alert {
  padding: 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 8px; /* มุมมน */
  color: #155724;
  text-align: center;
  font-weight: 500; /* ข้อความเข้ม */
}

/* Preview Container */
.preview-container {
  position: relative;
  background-color: #f9fafb;
  border: 2px dashed #ccc; /* ขอบเส้นประ */
  border-radius: 10px; /* มุมมน */
  transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-container:hover {
  background-color: #eef6ff;
  border-color: #007bff;
}

.preview-container img {
  border-radius: 10px;
  transition: transform 0.3s ease; /* การเปลี่ยนแปลงเมื่อโฮเวอร์ */
}

.preview-container img:hover {
  transform: scale(1.05); /* ขยายรูปภาพ */
}

/* File Input */
.file-input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 0.9rem;
  color: #555;
  background-color: #f9fafb;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.file-input:hover {
  border-color: #007bff;
  box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2); /* เพิ่มเงาเมื่อโฮเวอร์ */
}

.file-input:focus {
  border-color: #0056b3;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 86, 179, 0.4); /* เงาขณะโฟกัส */
}

/* Select Dropdown */
.select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  font-size: 0.9rem;
  color: #555;
  background-color: #f9fafb;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.select:hover {
  border-color: #007bff;
}

.select:focus {
  border-color: #0056b3;
  outline: none;
  box-shadow: 0 2px 6px rgba(0, 86, 179, 0.4);
}

/* Form Controls */
.form-control label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-control .cursor-pointer {
  font-family: "Prompt", sans-serif;
}

.form-control input[type="checkbox"] {
  transform: scale(1.2);
  transition: transform 0.2s ease-in-out;
}

.form-control input[type="checkbox"]:hover {
  transform: scale(1.3);
}

/* Scrollbar Customization */
.overflow-y-auto {
  max-height: 15rem;
  overflow-y: auto;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #2563eb;
  border-radius: 5px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #1d4ed8;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 5px;
}

/* Menu Hover Effect */
.hover\:bg-blue-50:hover {
  background-color: #ebf8ff;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn:hover {
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

.btn:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(0, 86, 179, 0.4);
}

/* Background Colors */
.bg-blue-50 {
  background-color: #ebf8ff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.bg-green-500 {
  background-color: #22c55e;
}

.bg-blue-500 {
  background-color: #2563eb;
}

.bg-blue-500:hover {
  background-color: #1d4ed8;
}

.bg-yellow-300 {
  background-color: #ffe55c;
}

/* Text */
.text-gray-700 {
  color: #374151;
}

.text-gray-400 {
  color: #9ca3af;
}

.text-white {
  color: #ffffff;
}
/* ปรับ label ให้ครอบคลุมพื้นที่ทั้งหมด */
label {
  width: 100%;
  display: flex;
  align-items: center;
}
/* ปุ่มเลือกไฟล์ */
.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-upload {
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.btn-upload:hover {
  background-color: #1d4ed8;
  box-shadow: 0 4px 8px rgba(29, 78, 216, 0.2);
}

.btn-upload:focus {
  outline: none;
  box-shadow: 0 4px 8px rgba(29, 78, 216, 0.4);
}

/* ชื่อไฟล์ */
.file-name {
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ซ่อน input[type="file"] */
.file-input-hidden {
  display: none;
}
</style>
//material//
