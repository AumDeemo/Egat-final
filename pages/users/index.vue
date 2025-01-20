<script setup>
import userLayouts from "~/layouts/userLayouts.vue";
import { ref, onMounted, computed } from "vue";

const materials = ref([]);
const lowStockMaterials = ref([]); // รายการอะไหล่ที่ต้องแจ้งเตือน
const isNotificationOpen = ref(false); // สถานะเปิด/ปิดการแจ้งเตือน
const notificationDropdownRef = ref(null); // อ้างอิง dropdown แจ้งเตือน
const latestUpdates = ref([]); // รายการอัปเดตล่าสุด
const totalMaterials = ref(0); // จำนวนอะไหล่ทั้งหมด
const lowStockCount = ref(0); // จำนวนอะไหล่ที่มีสต็อกต่ำ
const popularCategories = ref([]); // หมวดหมู่ยอดนิยม
const totalCURU = ref(0); // จำนวนคุรุภัณฑ์ทั้งหมด
const totalUsing = ref(0); // จำนวนเครื่องมือเครื่องใช้ทั้งหมด
const totalUsingBelow10000 = ref(0); // จำนวนเครื่องมือเครื่องใช้ราคาต่ำกว่า 10000
const intervalId = ref(null);
const isLoading = ref(true); // สถานะการโหลดข้อมูล

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
// เพิ่ม Event Listener เมื่อคอมโพเนนต์ถูก mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideNotification);
});

// ลบ Event Listener เมื่อคอมโพเนนต์ถูก unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideNotification);
});

const fetchSummaryData = async () => {
  try {
    isLoading.value = true; // เริ่มการโหลด
    const materialsResponse = await fetch("/api/admin/material");
    const materials = await materialsResponse.json();

    // คำนวณจำนวนอะไหล่ทั้งหมด
    totalMaterials.value = materials.length;

    // คำนวณจำนวนอะไหล่ที่คงเหลือน้อยกว่า 10
    lowStockCount.value = materials.filter((item) => item.totalAmount < 10).length;

    // สร้างรายการอัปเดตใหม่
    const newUpdates = materials
      .map((item) => ({
        message: `รายการ '${item.name}'`,
        totalAmount: item.totalAmount,
        timestamp: new Date(item.updatedAt).toLocaleString(),
        updatedAt: item.updatedAt, // ใช้สำหรับจัดเรียง
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // เรียงลำดับโดยเวลาล่าสุด

    // จำกัดรายการอัปเดตล่าสุดให้เหลือเพียง 5 รายการ
    latestUpdates.value = newUpdates.slice(0, 5);
  } catch (err) {
    console.error("Error fetching summary data:", err);
  } finally {
    isLoading.value = false; // สิ้นสุดการโหลด
  }
};

// อัปเดตข้อมูลแบบอัตโนมัติ
const startAutoUpdate = () => {
  intervalId.value = setInterval(fetchSummaryData, 10000); // อัปเดตทุก 10 วินาที
};

// หยุดการอัปเดตอัตโนมัติเมื่อออกจากคอมโพเนนต์
onMounted(() => {
  fetchSummaryData();
  startAutoUpdate();
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <userLayouts>
    <!-- Welcome Banner -->
    <div
      class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-8 md:py-10 text-center rounded-lg shadow-lg mb-10"
    >
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
        ยินดีต้อนรับ
      </h1>
    </div>
    <!-- Latest Updates -->
    <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
      <h2
        class="text-2xl font-extrabold text-gray-700 mb-6 flex items-center gap-3 justify-center"
      >
        <span class="text-blue-600">🕒</span>
        <span>อัปเดตล่าสุด</span>
        <span
          class="bg-yellow-400 text-gray-800 px-3 py-1 text-xs font-bold rounded-full"
        >
          NEW
        </span>
      </h2>
      <ul class="divide-y divide-gray-200 max-h-96 overflow-y-auto scrollbar-custom">
        <li
          v-for="(update, index) in latestUpdates"
          :key="index"
          class="py-5 px-4 flex items-start gap-5 bg-gradient-to-r from-blue-50 via-white to-gray-50 shadow-sm rounded-lg hover:shadow-md transition duration-300"
        >
          <div class="flex-shrink-0">
            <div
              class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-lg icon-effect mt-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="orange"
                class="w-8 h-8 transform"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <p class="text-gray-800 font-semibold text-lg">{{ update.message }}</p>
            <p class="text-gray-500 text-base mt-1">
              คงเหลือ:
              <span
                :class="{
                  'text-red-600 font-bold': update.totalAmount <= 5,
                  'text-yellow-600 font-medium':
                    update.totalAmount > 5 && update.totalAmount <= 10,
                  'text-green-600 font-semibold': update.totalAmount > 10,
                }"
              >
                {{ update.totalAmount }}
              </span>
            </p>
            <p
              class="text-base mt-1"
              :class="{
                'text-blue-500 font-medium': true /* เพิ่มสีฟ้าและทำให้ตัวอักษรหนากว่า */,
                'text-opacity-90': true /* เพิ่มความชัด */,
              }"
            >
              {{ update.timestamp }}
            </p>
          </div>
        </li>
      </ul>

      <p v-if="latestUpdates.length === 0" class="text-center text-gray-500 mt-6">
        ไม่มีข้อมูลอัปเดตล่าสุด
      </p>
    </div>
  </userLayouts>
</template>

<style scoped>
/* Custom Scrollbar Styling */
.scrollbar-custom {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #4a90e2 #f0f0f0; /* สี Thumb และ Track */
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px; /* ความกว้างของ Scrollbar */
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #0073e6); /* สีไล่ระดับของ Thumb */
  border-radius: 4px; /* ทำมุม Scrollbar ให้โค้งมน */
  border: 2px solid #f0f0f0; /* ขอบสีรอบ Thumb */
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0073e6, #0056b3); /* เปลี่ยนสีเมื่อ Hover */
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #f9f9f9; /* สีของ Track */
  border-radius: 4px; /* ทำมุม Track ให้โค้งมน */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1); /* เพิ่มเงาใน Track */
}

/* เอฟเฟกต์กระพริบและลดขยาย */
.icon-effect {
  animation: pulse 1.5s infinite; /* ลดขยายแบบวนลูป */
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1); /* ขนาดปกติ */
  }
  50% {
    transform: scale(1.2); /* ขยาย 20% */
  }
}
/* เพิ่มสีและพื้นหลังให้ timestamp */
.timestamp {
  color: #0044ff; /* สีฟ้าเข้ม */
  font-weight: 600; /* น้ำหนักตัวหนา */
  background-color: #e0f2fe; /* พื้นหลังฟ้าอ่อน */
  padding: 2px 6px; /* เพิ่มระยะห่างภายใน */
  border-radius: 4px; /* ทำให้มุมโค้งมน */
  display: inline-block; /* ให้ข้อความมีพื้นหลังติดกัน */
}
</style>

//users//home//
