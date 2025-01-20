<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, computed } from "vue";

const materials = ref([]);
const searchQuery = ref(""); // เก็บค่าคำค้นหา
const selectedCategory = ref([]); // เก็บหมวดหมู่ที่เลือก
const categories = ref([]); // รายการหมวดหมู่ทั้งหมด
const isCategoryDropdownOpen = ref(false); // เปิด-ปิด dropdown หมวดหมู่
const categoryDropdownRef = ref(null); // สำหรับอ้างอิง dropdown หมวดหมู่
const lowStockMaterials = ref([]); // รายการอะไหล่ที่ต้องแจ้งเตือน
const isNotificationOpen = ref(false); // สถานะเปิด/ปิดการแจ้งเตือน
const notificationDropdownRef = ref(null); // อ้างอิง dropdown แจ้งเตือน
const isImageModalOpen = ref(false); // สถานะเปิด/ปิดโมดอล
const modalImageUrl = ref(""); // เก็บ URL ของรูปภาพที่เลือก

// ฟังก์ชันเปิดโมดอลแสดงรูปภาพ
const openImageModal = (imageUrl) => {
  modalImageUrl.value = imageUrl;
  isImageModalOpen.value = true;
};

// ฟังก์ชันปิดโมดอลแสดงรูปภาพ
const closeImageModal = () => {
  modalImageUrl.value = "";
  isImageModalOpen.value = false;
};

// ตรวจสอบรายการอะไหล่ที่ต้องแจ้งเตือน
const checkLowStock = () => {
  lowStockMaterials.value = materials.value.filter(
    (material) => material.totalAmount < 10
  );
};

// เปิด/ปิดการแจ้งเตือน
const toggleNotification = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};
// ฟังก์ชันเปิด-ปิด dropdown หมวดหมู่
const toggleCategoryDropdown = () => {
  isCategoryDropdownOpen.value = !isCategoryDropdownOpen.value;
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideNotification = (event) => {
  if (
    notificationDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    notificationDropdownRef.value.contains(event.target) // ถ้าคลิกใน dropdown
  ) {
    return; // ไม่ปิดแจ้งเตือน
  }
  isNotificationOpen.value = false; // ปิดแจ้งเตือน
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideCategory = (event) => {
  if (
    categoryDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    !categoryDropdownRef.value.contains(event.target) // ตรวจสอบว่าคลิกนอกพื้นที่ dropdown
  ) {
    isCategoryDropdownOpen.value = false; // ปิด dropdown
  }
};
// เพิ่ม Event Listener เมื่อคอมโพเนนต์ถูก mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideCategory);
  window.addEventListener("click", handleClickOutsideNotification);
});

// ลบ Event Listener เมื่อคอมโพเนนต์ถูก unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideCategory);
  window.removeEventListener("click", handleClickOutsideNotification);
});
// ฟังก์ชันดึงข้อมูลวัสดุจาก API
const fetchMaterials = async () => {
  try {
    const response = await fetch("/api/admin/material", {
      method: "GET",
    });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    materials.value = await response.json();

    // อัปเดตรายการอะไหล่ที่ต้องแจ้งเตือน
    checkLowStock();
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
  }
};
// ดึงข้อมูลหมวดหมู่
const fetchCategories = async () => {
  try {
    const response = await fetch("/api/admin/new/category");
    const result = await response.json();
    if (result.status === "success") {
      categories.value = result.data;
    } else {
      console.error("Error fetching categories:", result.message);
    }
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};

// กรองวัสดุตามหมวดหมู่และคำค้นหา
const filteredMaterials = computed(() => {
  let filtered = materials.value;

  if (selectedCategory.value.length > 0) {
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || [];
      return selectedCategory.value.some((cat) =>
        materialCategories
          .map((c) => c.trim().toLowerCase())
          .includes(cat.trim().toLowerCase())
      );
    });
  }

  // กรองตามคำค้นหาหลายคำที่พิมพ์ (ค้นหาจากชื่อวัสดุและหมวดหมู่)
  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" ");
    filtered = filtered.filter((material) => {
      const materialCategories = Array.isArray(material.category)
        ? material.category
        : material.category?.split(",") || [];
      return searchTerms.every((term) => {
        return (
          material.name?.toLowerCase().includes(term) ||
          materialCategories.some((cat) => cat.toLowerCase().includes(term)) ||
          material.partnumber?.toLowerCase().includes(term)
        );
      });
    });
  }

  return filtered;
});

// ดึงข้อมูลวัสดุเมื่อ component ถูก mounted
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchMaterials()]);
});
</script>

<template>
  <div class="absolute top-4 right-4 z-50 cursor-pointer">
    <button
      class="p-2 bg-rose-600 rounded-full shadow-lg hover:bg-rose-700"
      @click="toggleNotification"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="yellow"
        class="h-6 w-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </button>
  </div>
  <!-- Notification Icon -->
  <div class="absolute top-4 right-4 z-50 cursor-pointer" ref="notificationDropdownRef">
    <button
      class="p-2 bg-rose-600 rounded-full shadow-lg hover:bg-rose-700"
      @click="toggleNotification"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        class="size-6"
      >
        <path
          fill-rule="evenodd"
          d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>

  <div
    v-if="isNotificationOpen"
    class="absolute top-16 right-4 bg-white shadow-lg rounded-xl p-5 w-96 z-50 max-h-96 overflow-y-auto transform transition-all duration-300 select-none"
    style="animation: fadeIn 0.3s ease"
    @click.stop
  >
    <h3 class="text-lg font-bold mb-4 text-blue-600 border-b pb-2 text-center">
      🔔 รายการแจ้งเตือน
    </h3>
    <ul>
      <li
        v-for="material in lowStockMaterials"
        :key="material.id"
        class="flex justify-between items-center p-3 mb-3 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-md rounded-lg hover:shadow-lg hover:scale-105 transform transition duration-300"
      >
        <div class="flex-1 text-left">
          <!-- ปรับ flex-1 และ text-left -->
          <h4 class="text-sm font-medium text-gray-800 mb-1">
            {{ material.name }}
          </h4>
          <p class="text-xs text-gray-500">
            คงเหลือ:
            <span
              :class="{
                'text-red-600 font-bold': material.totalAmount <= 5,
                'text-yellow-700 font-medium':
                  material.totalAmount > 5 && material.totalAmount <= 10,
              }"
            >
              {{ material.totalAmount }}
            </span>
          </p>
        </div>
        <div
          class="rounded-full bg-red-100 p-2 flex justify-center items-center shadow-md"
          :class="{
            'bg-red-200': material.totalAmount <= 5,
            'bg-yellow-200': material.totalAmount > 5 && material.totalAmount <= 10,
          }"
        >
          <span
            class="text-red-600 font-bold"
            :class="{
              'text-red-600': material.totalAmount <= 5,
              'text-yellow-600': material.totalAmount > 5 && material.totalAmount <= 10,
            }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                fill-rule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </div>
      </li>
    </ul>
    <p v-if="lowStockMaterials.length === 0" class="text-center text-gray-500">
      ไม่มีรายการแจ้งเตือน
    </p>
  </div>

  <userLayouts>
    <!-- ช่องค้นหา -->
    <div class="flex justify-center items-center mb-6">
      <div
        class="flex items-center w-full w-full bg-white border border-gray-300 rounded-full shadow-lg"
      >
        <!-- ไอคอนค้นหา -->
        <span class="p-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <!-- ช่องค้นหา -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา"
          class="flex-1 p-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-r-full"
        />
      </div>
    </div>

    <!-- Materials Table -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <!-- หมวดหมู่แบบ Checkbox พร้อมเปิด-ปิด -->
      <div class="relative mb-6" ref="categoryDropdownRef">
        <button
          @click="toggleCategoryDropdown"
          class="flex items-center justify-center w-full p-3 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white rounded-lg shadow-md focus:ring-2 focus:ring-gray-400 hover:bg-gray-800 transition duration-300"
        >
          <span>📂 เลือกหมวดหมู่</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-5 w-5 transition-transform duration-300"
            :class="{
              'rotate-180': isCategoryDropdownOpen,
              'rotate-0': !isCategoryDropdownOpen,
            }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <div
          v-if="isCategoryDropdownOpen"
          class="absolute z-50 bg-white border border-gray-300 shadow-lg rounded-lg p-4 mt-2 w-full overflow-y-auto max-h-64 custom-scrollbar"
        >
          <div
            v-for="cat in categories"
            :key="cat"
            class="flex items-center gap-3 mb-2 p-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:bg-gradient-to-r hover:from-blue-100 hover:via-blue-200 hover:to-blue-300 rounded-lg shadow-sm transition-transform duration-200 transform hover:translate-x-1"
          >
            <input
              type="checkbox"
              :id="cat"
              :value="cat"
              v-model="selectedCategory"
              class="checkbox-style cursor-pointer"
            />
            <label :for="cat" class="text-gray-800 font-medium cursor-pointer flex-grow">
              <span>{{ cat }}</span>
            </label>
          </div>
        </div>
      </div>
      <!-- Table -->
      <div class="overflow-x-auto">
        <div class="table-container justify-center w-full overflow-x-auto">
          <div class="bg-white p-4 rounded-xl shadow-lg">
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr class="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                    <th class="min-w-[50px]">ลำดับ</th>
                    <th class="min-w-[100px]">รูปภาพ</th>
                    <th class="min-w-[150px]">รายการ</th>
                    <th class="min-w-[150px]">PART NUMBER</th>
                    <th class="min-w-[150px]">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(material, index) in filteredMaterials"
                    :key="material.id"
                    class="hover:bg-gray-100 transition-colors"
                  >
                    <td data-label="ลำดับ">{{ index + 1 }}</td>
                    <td data-label="รูปภาพ">
                      <img
                        v-if="material.imageUrl"
                        :src="material.imageUrl"
                        alt="Material Image"
                        class="h-16 w-16 object-cover rounded-full mx-auto"
                        @click="openImageModal(material.imageUrl)"
                      />
                      <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                    </td>
                    <td data-label="รายการ">{{ material.name }}</td>
                    <td data-label="PART NUMBER">{{ material.partnumber }}</td>
                    <td data-label="คงเหลือ">{{ material.totalAmount }}</td>
                  </tr>
                  <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
                  <tr v-if="filteredMaterials.length === 0">
                    <td colspan="5" class="text-center text-gray-500">
                      ❌ ไม่พบข้อมูลที่ตรงกับคำค้นหา
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Image Modal -->
    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      @click.self="closeImageModal"
    >
      <div
        class="relative bg-gradient-to-b from-blue-100 via-white to-blue-100 p-6 rounded-lg shadow-2xl max-w-4xl border-4 border-yellow-500"
      >
        <!-- ปุ่มปิด (ย้ายตำแหน่งออกนอกขอบรูปภาพ) -->
        <button
          class="absolute top-[-20px] right-[-20px] bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110"
          @click="closeImageModal"
        >
          ✕
        </button>

        <!-- รูปภาพ -->
        <img
          :src="modalImageUrl"
          alt="Full Size Image"
          class="max-w-full max-h-[70vh] rounded-md border border-gray-300 shadow-md"
        />
      </div>
    </div>
  </userLayouts>
</template>

<style scoped>
/* Default Table Style */
.table th,
.table td {
  border-right: 1px solid #ddd; /* เส้นแนวตั้ง */
  border-left: 1px solid #ddd; /* เส้นแนวตั้ง */
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Kanit", sans-serif;
  font-size: 16px;
  table-layout: auto; /* ทำให้ขนาดคอลัมน์ปรับตามเนื้อหา */
}

/* Styling for Table Header */
.table thead {
  background: linear-gradient(to right, #4e73df, #1cc88a); /* สีไล่ระดับ */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* เงาใต้หัวตาราง */
}

.table th {
  text-align: center; /* จัดข้อความให้อยู่ตรงกลาง */
  vertical-align: middle; /* จัดให้อยู่กึ่งกลางในแนวตั้ง */
  padding: 12px; /* เพิ่ม Padding */
  font-weight: bold; /* ตัวหนา */
  color: #ffffff; /* สีข้อความ */
  text-transform: uppercase; /* เปลี่ยนข้อความให้เป็นตัวพิมพ์ใหญ่ */
  letter-spacing: 1px; /* ระยะห่างระหว่างตัวอักษร */
  transition: background-color 0.3s ease; /* เพิ่มเอฟเฟกต์เวลาโฟกัส */
}

.table td {
  padding: 10px;
  vertical-align: middle; /* จัดให้อยู่กึ่งกลางแนวตั้ง */
  text-align: center; /* ค่าเริ่มต้นจัดข้อความให้อยู่ตรงกลาง */
  border-bottom: 1px solid #ddd;
}

/* จัดคอลัมน์ "รายการ" ให้ชิดซ้าย */
.table td[data-label="รายการ"] {
  text-align: left;
  color: #333;
  font-weight: 500;
}

/* จัดตำแหน่งรูปภาพให้อยู่ตรงกลาง */
.table td[data-label="รูปภาพ"] img {
  display: block;
  margin: 0 auto;
  max-width: 50px;
  max-height: 50px;
  border-radius: 8px;
  object-fit: cover;
}
/* Responsive Table for screens smaller than 768px */
@media (max-width: 768px) {
  .table,
  .table thead,
  .table tbody,
  .table th,
  .table td,
  .table tr {
    display: block;
    width: 100%;
  }

  .table thead {
    display: none;
    /* ซ่อนหัวตาราง */
  }

  .table tr {
    margin-bottom: 15px;
    border: 1px solid #ddd;
    background-color: #fefefe;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .table td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #333;
    text-align: left;
  }

  .table td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #555;
    text-transform: capitalize;
    flex-basis: 40%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    /* ความกว้างสำหรับจอปกติ */
  }
}

/* จอขนาดเล็กกว่า 480px */
@media (max-width: 480px) {
  .table td {
    font-size: 12px;
    padding: 8px;
  }

  .table td::before {
    font-size: 12px;
    flex-basis: 50%;
  }

  .table td div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    /* ความกว้างสำหรับจอปกติ */
  }
}

/* กำหนดขนาด checkbox ให้คงที่ */
.checkbox-style {
  width: 20px;
  height: 20px;
  appearance: none;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* เปลี่ยนสีเมื่อ checkbox ถูกเลือก */
.checkbox-style:checked {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

/* เพิ่มไอคอนติ๊กเมื่อเลือก */
.checkbox-style:checked::after {
  content: "✔";
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  display: block;
}

/* Container สำหรับ checkbox */
.checkbox-container {
  flex-shrink: 0; /* ป้องกันการถูกบีบ */
  width: 24px; /* ความกว้างที่กำหนดแน่นอน */
  height: 24px; /* ความสูงที่กำหนดแน่นอน */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ข้อความที่ยาวจะถูกตัดและแสดง ... */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scrollbar styling */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #b0b0b0 #f0f0f0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #b0b0b0;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #909090;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}
/* รายการแจ้งเตือน */
ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

ul li:hover {
  background-color: #e6f7ff; /* สีฟ้าอ่อน */
}

ul li span.text-red-500 {
  color: #ff4d4f; /* สีแดงสดสำหรับแจ้งเตือนสำคัญ */
}

ul li span.text-blue-500 {
  color: #0073e6; /* สีฟ้าสำหรับแจ้งเตือนทั่วไป */
}

/* ข้อความเมื่อไม่มีแจ้งเตือน */
.text-gray-500 {
  text-align: left;
  color: #808080;
  font-size: 14px;
  margin-top: 16px;
}

/* Scrollbar Styling */
div[v-if="isNotificationOpen"] {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #4a90e2 #f0f0f0; /* สี Thumb และ Track */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar {
  width: 10px; /* ความกว้างของ Scrollbar */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #0073e6); /* สีไล่ระดับของ Thumb */
  border-radius: 8px; /* ทำมุม Scrollbar ให้โค้งมน */
  border: 2px solid #f0f0f0; /* เพิ่มขอบสีรอบ Thumb */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0073e6, #0056b3); /* เปลี่ยนสีเมื่อ Hover */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-track {
  background: #f9f9f9; /* สีของ Track */
  border-radius: 8px; /* ทำมุม Track ให้โค้งมน */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาใน Track */
}
/* พื้นหลังของโมดอล */
div[v-if="isImageModalOpen"] {
  animation: fadeIn 0.3s ease-in-out;
}

/* ปุ่มปิด */
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* โลโก้ */
img {
  display: block;
  margin: 0 auto;
}

/* เอฟเฟกต์แสดงโมดอล */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ขอบและเงารูปภาพ */
img[src]:not([alt]) {
  border-radius: 8px;
  border: 2px solid #0073e6; /* สีฟ้าของ กฟผ. */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}
.table-container {
  width: 100%;
  max-height: calc(70vh - 100px); /* ลดขนาดลงจากความสูงหน้าจอ */
  min-height: 300px; /* กำหนดความสูงขั้นต่ำ */
  height: auto; /* ปรับความสูงอัตโนมัติตามเนื้อหา */
  overflow-y: auto; /* เพิ่ม scroll หากเนื้อหายาวเกิน */
  border: 1px solid #ddd;
}

@media (max-width: 768px) {
  .table-container {
    max-height: calc(100vh - 150px); /* ลดขนาดลงสำหรับจอเล็ก */
  }
}

@media (max-width: 480px) {
  .table-container {
    max-height: calc(100vh - 100px); /* ลดขนาดลงอีกสำหรับมือถือ */
  }
}
</style>

//sparepartslist//user//V3
