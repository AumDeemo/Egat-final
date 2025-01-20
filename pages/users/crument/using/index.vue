<template>
  <usersLayouts>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- ส่วนหัว -->
      <header
        class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg px-8 py-4 shadow-lg"
      >
        <h1 class="text-4xl font-extrabold text-center tracking-wide">
          ระบบจัดการข้อมูลเครื่องมือเครื่องใช้
        </h1>
        <p class="text-center text-sm mt-2 font-light">
          การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)
        </p>
      </header>
      <div
        class="bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between gap-6"
      >
        <!-- ช่องค้นหา -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา"
          class="w-full p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
        />
      </div>
      <!-- ตาราง -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">
          รายการเครื่องมือเครื่องใช้
        </h2>
        <div class="overflow-x-auto">
          <!-- เพิ่ม container ที่มี scroll -->
          <div class="overflow-y-auto max-h-96 rounded-lg border border-gray-300">
            <table
              class="min-w-full table-auto border border-gray-300 rounded-lg shadow-sm"
            >
              <thead class="bg-gray-100">
                <tr>
                  <th class="w-[50px]">ลำดับ</th>
                  <th>รูปภาพ</th>
                  <th>ชื่อรุ่น</th>
                  <th>รหัสสินทรัพย์</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="using in filteredusing" key="using.id">
                  <th data-label="ลำดับ">{{ using.number }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="using.imageUrl"
                      :src="using.imageUrl"
                      alt="using Image"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td
                    data-label="ชื่อรุ่น"
                    @click="openModal(MODAL_TYPES.DETAILS, using)"
                  >
                    {{ using.name }}
                  </td>
                  <td data-label="รหัสสินทรัพย์">{{ using.partnumber }}</td>
                </tr>
                <!-- แสดงข้อความ "ไม่มีรายการ" เมื่อ filtered ไม่มีข้อมูล -->
                <tr v-if="filteredusing.length === 0">
                  <td colspan="7" class="p-4 text-center text-gray-500">ไม่มีรายการ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Details Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DETAILS"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-auto shadow-lg relative"
        >
          <!-- ปุ่มปิดมุมขวาบน -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 transition"
          >
            ✕
          </button>
          <h2 class="text-2xl font-bold mb-6 text-center text-blue-600">
            รายละเอียดเครื่องมือเครื่องใช้
          </h2>

          <!-- Table for Details -->
          <div class="overflow-x-auto">
            <table
              class="details-modal w-full text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ลำดับที่</th>
                  <th class="py-3 px-4 border-b border-gray-300">รหัสครุภัณฑ์</th>
                  <th class="py-3 px-4 border-b border-gray-300">รหัสสินทรัพย์</th>
                  <th class="py-3 px-4 border-b border-gray-300">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedusing.number }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.curunumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.partnumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.detial }}</td>
                </tr>
              </tbody>
            </table>
            <table
              class="details-modal w-full mt-4 text-left border-collapse border border-gray-300"
            >
              <thead class="bg-blue-100 text-blue-600 font-semibold">
                <tr>
                  <th class="py-3 px-4 border-b border-gray-300">ยี่ห้อ</th>
                  <th class="py-3 px-4 border-b border-gray-300">รุ่น</th>
                  <th class="py-3 px-4 border-b border-gray-300">หมายเลขเครื่อง</th>
                  <th class="py-3 px-4 border-b border-gray-300">วันที่ได้มา</th>
                  <th class="py-3 px-4 border-b border-gray-300">เลขที่ใบโอน</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b">{{ selectedusing.brand }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.name }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.usenumber }}</td>
                  <td class="py-2 px-4 border-b">{{ formatDate(selectedusing.date) }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedusing.detialnumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Image Preview -->
          <div class="preview-container">
            <img
              v-if="selectedusing.imageUrl"
              :src="selectedusing.imageUrl"
              alt="image-preview"
              class="image-preview cursor-pointer"
              @click="openImageModal(selectedusing.imageUrl)"
            />
            <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
          </div>

          <!-- Fullscreen Image Modal -->
          <div
            v-if="isImageModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          >
            <button
              @click="closeImageModal"
              class="absolute top-4 right-4 text-white bg-red-500 px-3 py-2 rounded-full hover:bg-red-600"
            >
              ✕
            </button>
            <img
              :src="imageModalUrl"
              alt="Expanded Image"
              class="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>

          <!-- Close Button -->
          <div class="mt-6 flex justify-end">
            <button
              @click="closeModal"
              class="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </usersLayouts>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import usersLayouts from "~/layouts/userLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedusing = ref(null);
const using = ref([]); // ใช้เก็บข้อมูล
const modalType = ref(null);
const selectedImage = ref(null);
const sortKey = ref("number"); // ค่าเริ่มต้นคือจัดเรียงตาม "number"
const sortOrder = ref("asc"); // "asc" คือจากน้อยไปมาก, "desc" คือจากมากไปน้อย
const isImageModalOpen = ref(false); // สถานะ Modal
const imageModalUrl = ref(""); // URL ของรูปภาพใน Modal

const openImageModal = (imageUrl) => {
  imageModalUrl.value = imageUrl;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
  imageModalUrl.value = "";
};

const MODAL_TYPES = {
  DETAILS: "details",
};

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredusing = computed(() => {
  // คัดลอกข้อมูลทั้งหมดจาก `using` มาใช้เป็นข้อมูลเริ่มต้น
  let filtered = [...using.value];

  // กรองตามคำค้นหา
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" ");
    filtered = filtered.filter((item) =>
      searchTerms.every((term) =>
        [
          item.number?.toString().toLowerCase(),
          item.name?.toLowerCase(),
          item.partnumber?.toLowerCase(),
        ].some((field) => field && field.includes(term))
      )
    );
  }

  // จัดเรียงข้อมูล
  filtered.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (sortOrder.value === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });

  return filtered;
});

const fetchusing = async () => {
  try {
    const response = await fetch("/api/admin/crument/using/using", { method: "GET" });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    using.value = await response.json();
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const openModal = (type, using) => {
  modalType.value = type;
  selectedusing.value = using;
};

const closeModal = () => {
  modalType.value = null;
  selectedusing.value = null;
};

onMounted(async () => {
  await fetchusing();
});
</script>

<style scoped>
/* General Styles */
input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

button {
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}
/* ปุ่ม Edit */
.edit-btn {
  background-color: #f59e0b; /* สีเหลือง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.edit-btn:hover {
  background-color: #d97706; /* สีเหลืองเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.edit-btn:active {
  transform: scale(0.97);
}
/* ปุ่มลบ */
.delete-btn {
  background-color: #e11d48; /* สีแดง */
  color: white;
  padding: 12px 24px;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.delete-btn:hover {
  background-color: #be123c; /* สีแดงเข้ม */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn:active {
  transform: scale(0.97);
}

/* จัดตำแหน่งรูปภาพให้อยู่ตรงกลาง */
td[data-label="รูปภาพ"] {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่ตรงกลางแนวนอน */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  height: 100%; /* ให้เต็มความสูงของช่อง */
}

/* ตาราง */
.table-auto {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* เพิ่มเงา */
}

.table-auto th,
.table-auto td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

.table-auto th {
  background-color: #007bff; /* สีหัวตาราง */
  color: white;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
}

.table-auto td {
  background-color: #ffffff;
  font-size: 14px;
  color: #4b5563;
  vertical-align: middle;
  transition: background-color 0.3s;
}

.table-auto tr:nth-child(even) td {
  background-color: #f9fafb;
}

.table-auto tr:hover td {
  background-color: #e3f2fd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 12px; /* ความกว้างของ Scrollbar */
  background-color: #f5f5f5; /* สีพื้นหลังของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #007bff; /* สีของ Scrollbar */
  border-radius: 6px; /* มุมโค้ง */
  border: 3px solid #f5f5f5; /* ระยะห่างของ Scrollbar */
  transition: background-color 0.3s, border-color 0.3s; /* เพิ่มเอฟเฟกต์ */
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #0056b3; /* สีเข้มขึ้นเมื่อ Hover */
  border-color: #e0e7ff; /* เปลี่ยนสีขอบเมื่อ Hover */
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #e9ecef; /* สีพื้นหลังของ Track */
  border-radius: 6px; /* มุมโค้งของ Track */
  margin: 4px; /* ระยะห่างระหว่าง Track */
}

/* ปุ่ม Preview */
.preview-btn {
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: inline-flex; /* ใช้ flexbox */
  align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
  gap: 8px; /* ระยะห่างระหว่างไอคอนกับข้อความ */
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.3s;
}

.preview-btn:hover {
  background-color: #4338ca;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-btn:active {
  transform: scale(0.97);
}

.preview-btn svg {
  width: 16px; /* ขนาดไอคอน */
  height: 16px;
}

.preview-btn span {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  input {
    font-size: 14px;
    padding: 10px;
  }

  .download-btn,
  .delete-btn,
  .preview-btn {
    font-size: 12px;
    padding: 10px 16px;
  }

  .table-auto th,
  .table-auto td {
    font-size: 12px;
    padding: 10px;
  }
}
th,
td {
  border-right: 1px solid #d1d5db; /* เส้นแนวตั้งสีเทาอ่อน */
}

th:last-child,
td:last-child {
  border-right: none; /* ไม่แสดงเส้นแนวตั้งในคอลัมน์สุดท้าย */
}
/* สำหรับหัวตารางใน Details Modal */
.details-modal th {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  padding: 12px 16px;
  background-color: #4f46e5; /* สีพื้นหลังของหัวตาราง */
  color: white; /* สีข้อความ */
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  border-bottom: 2px solid #e5e7eb; /* เพิ่มเส้นแบ่งด้านล่าง */
  white-space: nowrap; /* ป้องกันข้อความตัดบรรทัด */
}
.details-modal td {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  padding: 10px 12px;
  font-size: 14px;
  color: #4b5563; /* สีข้อความในตาราง */
  border-bottom: 1px solid #e5e7eb; /* เพิ่มเส้นแบ่งด้านล่าง */
}
.details-modal tr:nth-child(even) td {
  background-color: #f9fafb; /* สีพื้นหลังของแถวคู่ */
}
.details-modal tr:hover td {
  background-color: #e3f2fd; /* สีพื้นหลังเมื่อ hover */
}
.preview-container {
  display: flex; /* ใช้ Flexbox */
  justify-content: center; /* จัดให้อยู่กึ่งกลางแนวนอน */
  align-items: center; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  width: 100%; /* ความกว้างเต็มที่ของ container */
  max-width: 500px; /* จำกัดความกว้างสูงสุด */
  max-height: 400px; /* จำกัดความสูงสูงสุด */
  background-color: #ffffff; /* สีพื้นหลัง */
  border: 2px solid #007bff; /* ขอบสีน้ำเงิน */
  border-radius: 16px; /* มุมโค้ง */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* เพิ่มเงา */
  padding: 16px; /* เพิ่มระยะห่างภายใน */
  margin: 20px auto; /* ระยะห่างจากส่วนอื่นๆ */
  overflow: hidden; /* ซ่อนส่วนที่เกิน */
  position: relative; /* ใช้สำหรับการวางตำแหน่ง */
  text-align: center; /* จัดข้อความให้อยู่กึ่งกลางแนวนอน */
  transition: transform 0.3s, box-shadow 0.3s; /* เพิ่มเอฟเฟกต์เมื่อ Hover */
}

.preview-container:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
}

/* Image Preview */
.image-preview {
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.image-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Fullscreen Image Modal */
.fixed {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 50;
}

img.max-w-full {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.preview-container p {
  font-size: 16px; /* ขนาดตัวอักษร */
  color: #6b7280; /* สีข้อความ */
  font-weight: bold; /* ตัวหนา */
}
</style>
