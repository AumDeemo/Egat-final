<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const materials = ref([]);
const selectedMaterial = ref(null);
const modalType = ref(null);
const quantity = ref("");
const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedImage = ref(null);
const selectedCategory = ref([]); // เก็บหมวดหมู่ที่เลือก
const categories = ref([]); // เก็บหมวดหมู่ทั้งหมด
const isCategoryOpen = ref(false); // สถานะเปิด-ปิด dropdown หมวดหมู่
const categoryDropdownRef = ref(null); // สำหรับอ้างอิง dropdown หมวดหมู่
const lowStockMaterials = ref([]); // รายการอะไหล่ที่ต้องแจ้งเตือน
const isNotificationOpen = ref(false); // สถานะเปิด/ปิดการแจ้งเตือน
const notificationDropdownRef = ref(null); // อ้างอิง dropdown แจ้งเตือน
const isImageModalOpen = ref(false); // สถานะเปิด/ปิดโมดอล
const modalImageUrl = ref(""); // เก็บ URL ของรูปภาพที่เลือก
const previewImageUrl = ref(null);
const isNewNotification = ref(false); // สถานะสำหรับตรวจสอบว่ามีการแจ้งเตือนใหม่หรือไม่

// ฟังก์ชันแจ้งเตือนใหม่
const addNotification = (notification) => {
  lowStockMaterials.value.push(notification); // เพิ่มรายการแจ้งเตือนใหม่
  isNewNotification.value = true; // ตั้งสถานะว่าเป็นการแจ้งเตือนใหม่

  // รีเซ็ตสถานะกลับหลัง 1 วินาที
  setTimeout(() => {
    isNewNotification.value = false;
  }, 1000); // 1 วินาที
};

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

// ฟังก์ชันเปิด/ปิดหมวดหมู่
const toggleCategory = () => {
  isCategoryOpen.value = !isCategoryOpen.value;
};
// เปิด/ปิดการแจ้งเตือน
const toggleNotification = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};

// ฟังก์ชันปิด dropdown เมื่อคลิกนอกพื้นที่
const handleClickOutsideCategory = (event) => {
  if (
    categoryDropdownRef.value && // ตรวจสอบว่า dropdown ถูก mount แล้ว
    !categoryDropdownRef.value.contains(event.target) // ตรวจสอบว่าคลิกนอกพื้นที่ dropdown
  ) {
    isCategoryOpen.value = false; // ปิด dropdown
  }
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

// Modal types
const MODAL_TYPES = {
  IMPORT: "import",
  EXPORT: "export",
  DETAILS: "details",
  EDIT: "edit",
  DELETE: "delete",
};

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

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImage.value = null;
    previewImageUrl.value = null; // รีเซ็ต URL ของรูปภาพ
    return;
  }

  // ตรวจสอบประเภทและขนาดของไฟล์
  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
    return;
  }

  selectedImage.value = file;
  previewImageUrl.value = URL.createObjectURL(file); // อัปเดต URL ของรูปภาพที่เลือกใหม่
};

const materialHistory = ref({
  importHistory: [],
  exportHistory: [],
});

const fetchMaterialHistory = async (materialId) => {
  try {
    const response = await fetch(`/api/admin/material-history?materialId=${materialId}`);
    if (!response.ok) throw new Error("ดึงประวัติไม่สำเร็จ");

    materialHistory.value = await response.json();
  } catch (err) {
    console.error("Error fetching material history:", err);
  }
};

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

// ตรวจสอบรายการอะไหล่ที่ต้องแจ้งเตือน
const checkLowStock = () => {
  lowStockMaterials.value = materials.value.filter(
    (material) => material.totalAmount < 10
  );
};

// กรอง
const filteredMaterials = computed(() => {
  let filtered = materials.value;

  // กรองวัสดุตามหมวดหมู่
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

const openModal = (type, material) => {
  modalType.value = type;
  selectedMaterial.value = material;
  quantity.value = "";

  if (type === MODAL_TYPES.DETAILS) {
    fetchMaterialHistory(material.id);
  }
};

const closeModal = () => {
  modalType.value = null;
  selectedMaterial.value = null;
  selectedImage.value = null;
  previewImageUrl.value = null; // รีเซ็ต URL ของรูปภาพ
  quantity.value = "";
};

watch(quantity, (newValue) => {
  console.log("quantity:", newValue);
});

watch(selectedMaterial, (newValue) => {
  console.log("selectedMaterial.value.id :", newValue);
});

const handleMaterialAction = async () => {
  if (!selectedMaterial.value || !quantity.value) return;

  try {
    const actionType = modalType.value === MODAL_TYPES.IMPORT ? "import" : "export";
    const response = await fetch("/api/admin/material-action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        materialId: selectedMaterial.value.id,
        quantity: Number(quantity.value),
        type: actionType,
      }),
    });

    if (!response.ok) throw new Error(`การ${actionType}ไม่สำเร็จ`);

    await fetchMaterials();
    closeModal();
  } catch (err) {
    console.error(`Error in ${actionType}:`, err);
    // TODO: Add proper error handling (e.g., toast notification)
  }
};

const handleEditMaterial = async () => {
  if (!selectedMaterial.value) return;

  const formData = new FormData();
  formData.append("id", selectedMaterial.value.id);
  formData.append("name", selectedMaterial.value.name);
  formData.append("partnumber", selectedMaterial.value.partnumber);
  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  }

  try {
    const response = await fetch("/api/admin/material", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) throw new Error("แก้ไขข้อมูลไม่สำเร็จ");

    await fetchMaterials();
    closeModal();
    alert("แก้ไขข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
  } catch (err) {
    console.error("Error editing material:", err);
    // TODO: Add proper error handling
  }
};

const handleDeleteMaterial = async () => {
  if (!selectedMaterial.value) return;
  try {
    const response = await $fetch(`/api/material/${selectedMaterial.value.id}`, {
      method: "DELETE",
    });
    console.log("resDel : ", response);
    // Refresh materials list
    await fetchMaterials();
    closeModal();
    alert("ลบข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
  } catch (err) {
    // Show error notification
    useToast().error("ไม่สามารถลบวัสดุได้");
    console.error("Error deleting material:", err);
  }
};

// const handleDeleteMaterial = async () => {
//     if (!selectedMaterial.value) return

//     try {
//         const response = await $fetch(`/api/material/${selectedMaterial.value.id}`, {
//             method: 'DELETE'
//         })

//         console.log('resDel : ' , response)
//         await fetchMaterials()
//         closeModal()
//     } catch (err) {
//         useToast().error('ไม่สามารถลบวัสดุได้')
//         console.error('Error deleting material:', err)
//     }
// }

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchMaterials()]);
});
</script>

<template>
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
  <!-- Notification รายการแจ้งเตือน -->
  <div
    v-if="isNotificationOpen"
    class="absolute top-16 right-4 bg-white shadow-lg rounded-xl p-5 w-96 z-50 max-h-96 overflow-y-auto transform transition-all duration-300 select-none"
    style="animation: fadeIn 0.3s ease"
    @click.stop
  >
    <h3 class="text-lg font-bold mb-4 text-blue-600 border-b pb-2">🔔 รายการแจ้งเตือน</h3>
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
                'text-yellow-600 font-medium':
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

  <adminLayouts>
    <div class="max-w-8xl mx-auto">
      <!-- ปุ่มเพิ่มรายการ และ ช่องค้นหา แนวนอน -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <!-- ปุ่มเพิ่มรายการ -->
        <RouterLink
          to="/material"
          class="bg-green-500 rounded-lg w-full py-3 cursor-pointer transform transition duration-200 ease-in-out shadow-md hover:shadow-lg hover:bg-green-600 active:scale-95 active:bg-green-700 flex items-center justify-center"
        >
          <div class="flex gap-2 items-center">
            <div class="transform transition duration-200 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </div>
            <p class="text-white font-bold text-lg">เพิ่มรายการ</p>
          </div>
        </RouterLink>

        <!-- ช่องค้นหา -->
        <div class="flex justify-center items-center">
          <div
            class="flex items-center w-full bg-white border border-gray-300 rounded-full shadow-lg"
          >
            <!-- ไอคอนค้นหา -->
            <span class="p-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-7"
              >
                <path
                  d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z"
                />
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
      </div>
      <!-- หมวดหมู่ -->
      <div class="form-control mt-5 select-none relative" ref="categoryDropdownRef">
        <label
          @click="toggleCategory"
          class="cursor-pointer flex items-center justify-center bg-blue-700 text-white p-3 border border-blue-800 rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
        >
          <span class="font-semibold text-lg">หมวดหมู่</span>
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
          class="menu-dropdown absolute bg-white p-5 rounded-lg border border-gray-300 shadow-2xl mt-2 z-50 max-h-72 overflow-y-auto w-full"
          style="top: calc(100% + 0.5rem)"
        >
          <ul class="space-y-3">
            <li
              v-for="cat in categories"
              :key="cat"
              class="flex items-center gap-4 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg shadow-sm transition duration-200 cursor-pointer"
              @click="toggleCategorySelection(cat)"
            >
              <input
                type="checkbox"
                :id="cat"
                :value="cat"
                v-model="selectedCategory"
                class="cursor-pointer accent-blue-700 w-5 h-5"
                @click.stop
              />
              <label
                :for="cat"
                class="flex items-center gap-3 text-gray-700 text-base cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-blue-700"
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
                <span>{{ cat }}</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <!-- Materials Table -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-black-600 text-center">รายการอะไหล่</h2>
        <div class="overflow-x-auto">
          <!-- เพิ่ม container ที่มี scroll -->
          <div class="table-container overflow-y-auto rounded-lg border border-gray-300">
            <table class="table w-full table-fixed">
              <thead>
                <tr>
                  <th class="w-[50px]">ลำดับ</th>
                  <th class="w-[150px]">รูปภาพ</th>
                  <th class="w-[200px]">รายการ</th>
                  <th class="w-[200px]">PART NUMBER</th>
                  <th class="w-[100px]">คงเหลือ</th>
                  <th class="w-[150px]">นำเข้า</th>
                  <th class="w-[150px]">นำออก</th>
                  <th class="w-[200px]">รายละเอียดการเบิก</th>
                  <th class="w-[150px]">แก้ไข</th>
                  <th class="w-[150px]">ลบรายการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(material, index) in filteredMaterials" :key="material.id">
                  <th data-label="ลำดับ">{{ index + 1 }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="material.imageUrl"
                      :src="material.imageUrl"
                      alt="Material Image"
                      class="h-16 w-16 object-cover rounded-md"
                      @click="openImageModal(material.imageUrl)"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td data-label="รายการ">{{ material.name }}</td>
                  <td data-label="PART NUMBER">{{ material.partnumber }}</td>
                  <td data-label="คงเหลือ">{{ material.totalAmount }}</td>
                  <td data-label="นำเข้า">
                    <div
                      @click="openModal(MODAL_TYPES.IMPORT, material)"
                      class="bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="4"
                        stroke="#ffffff"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <p class="text-white font-medium">นำเข้า</p>
                    </div>
                  </td>

                  <td data-label="นำออก">
                    <div
                      @click="openModal(MODAL_TYPES.EXPORT, material)"
                      class="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#ffffff"
                        viewBox="0 0 24 24"
                        stroke-width="4"
                        stroke="#ffffff"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                      <p class="text-white font-medium">นำออก</p>
                    </div>
                  </td>

                  <td data-label="รายละเอียดการเบิก">
                    <div
                      @click="openModal(MODAL_TYPES.DETAILS, material)"
                      class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        class="size-4"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                          clip-rule="evenodd"
                        />
                      </svg>

                      <p class="text-white font-medium">ข้อมูล</p>
                    </div>
                  </td>

                  <td data-label="แก้ไข">
                    <div
                      @click="openModal(MODAL_TYPES.EDIT, material)"
                      class="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-4"
                      >
                        <path
                          d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
                        />
                        <path
                          d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
                        />
                      </svg>

                      <p class="text-white font-medium">แก้ไข</p>
                    </div>
                  </td>

                  <td data-label="ลบรายการ">
                    <div
                      @click="openModal(MODAL_TYPES.DELETE, material)"
                      class="bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-md h-10 flex gap-1 items-center justify-center cursor-pointer transform transition duration-150 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-4"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clip-rule="evenodd"
                        />
                      </svg>

                      <p class="text-white font-medium">ลบ</p>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMaterials.length === 0">
                  <td colspan="10" class="text-center text-gray-500 py-4">
                    ไม่พบข้อมูลที่ตรงกับคำค้นหา
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Image Modal -->
      <div
        v-if="isImageModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="closeImageModal"
      >
        <div class="relative bg-white p-6 rounded-lg shadow-2xl max-w-4xl">
          <!-- ปุ่มปิด (อยู่นอกกรอบรูปภาพ) -->
          <button
            class="absolute top-[-10px] right-[-10px] bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-110 z-10"
            @click="closeImageModal"
          >
            ✕
          </button>

          <!-- รูปภาพ -->
          <div class="flex items-center justify-center p-2">
            <img
              :src="modalImageUrl"
              alt="Full Size Image"
              class="max-w-full max-h-[70vh] rounded-md border border-gray-300 shadow-md"
            />
          </div>
        </div>
      </div>

      <!-- Import/Export Modal -->
      <div
        v-if="modalType === MODAL_TYPES.IMPORT || modalType === MODAL_TYPES.EXPORT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">
            {{ modalType === MODAL_TYPES.IMPORT ? "นำเข้า" : "นำออก" }}
            {{ selectedMaterial?.name }}
          </h2>
          <input
            v-model="quantity"
            type="number"
            placeholder="ระบุจำนวน"
            class="w-full p-2 border rounded mb-4"
          />
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleMaterialAction"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>

      <!-- Details Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DETAILS"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-auto">
          <h2 class="text-xl font-bold mb-4">รายละเอียด {{ selectedMaterial?.name }}</h2>

          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">ข้อมูลทั่วไป</h3>
              <p><strong>Part Number:</strong> {{ selectedMaterial?.partnumber }}</p>
              <p><strong>จำนวนคงเหลือ:</strong> {{ selectedMaterial?.totalAmount }}</p>
            </div>

            <div>
              <div class="flex justify-center items-center">
                <h3 class="text-lg font-semibold mb-2">ประวัติการนำเข้า</h3>
              </div>
              <table v-if="materialHistory.importHistory.length" class="w-full border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">วันที่</th>
                    <th class="border p-2">จำนวน</th>
                    <th class="border p-2">ผู้นำเข้า</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in materialHistory.importHistory"
                    :key="history.id"
                    class="text-center"
                  >
                    <td class="border p-2">
                      {{ new Date(history.date).toLocaleString() }}
                    </td>
                    <td class="border p-2">{{ history.quantity }}</td>
                    <td class="border p-2">{{ history.user || "-" }}</td>
                  </tr>
                </tbody>
              </table>

              <div v-else class="flex justify-center items-center">
                <p class="text-gray-500">ไม่มีประวัติการนำเข้า</p>
              </div>
            </div>

            <div>
              <div class="flex justify-center items-center">
                <h3 class="text-lg font-semibold mb-2">ประวัติการนำออก</h3>
              </div>
              <table v-if="materialHistory.exportHistory.length" class="w-full border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border p-2">วันที่</th>
                    <th class="border p-2">จำนวน</th>
                    <th class="border p-2">ผู้นำออก</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="history in materialHistory.exportHistory"
                    :key="history.id"
                    class="text-center"
                  >
                    <td class="border p-2">
                      {{ new Date(history.date).toLocaleString() }}
                    </td>
                    <td class="border p-2">{{ history.quantity }}</td>
                    <td class="border p-2">{{ history.user || "-" }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="flex justify-center items-center">
                <p class="text-gray-500">ไม่มีประวัติการนำออก</p>
              </div>
            </div>
          </div>

          <div class="mt-4 text-right">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ปิด
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="modalType === MODAL_TYPES.EDIT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">แก้ไข {{ selectedMaterial?.name }}</h2>
          <div class="space-y-4">
            <!-- ชื่อรายการ -->
            <input
              v-model="selectedMaterial.name"
              placeholder="ชื่อรายการ"
              class="w-full p-2 border rounded"
            />

            <!-- PART NUMBER -->
            <input
              v-model="selectedMaterial.partnumber"
              placeholder="Part Number"
              class="w-full p-2 border rounded"
            />

            <!-- แสดงรูปภาพปัจจุบัน -->
            <div>
              <p class="font-bold">รูปภาพปัจจุบัน:</p>
              <img
                v-if="previewImageUrl"
                :src="previewImageUrl"
                alt="Preview Image"
                class="h-32 w-32 object-cover rounded-md mx-auto"
              />
              <img
                v-else-if="selectedMaterial.imageUrl"
                :src="selectedMaterial.imageUrl"
                alt="Current Image"
                class="h-32 w-32 object-cover rounded-md mx-auto"
              />
              <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
            </div>

            <!-- เลือกรูปภาพใหม่ -->
            <div>
              <p class="font-bold">เลือกรูปภาพใหม่:</p>
              <input
                type="file"
                @change="handleImageChange"
                class="w-full p-2 border rounded"
                accept="image/*"
              />
              <p class="text-sm text-gray-500">
                ขนาดไฟล์ต้องไม่เกิน 5MB และรองรับเฉพาะไฟล์รูปภาพ
              </p>
            </div>
          </div>
          <div class="flex justify-between mt-4">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleEditMaterial"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DELETE"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">
            ยืนยันการลบรายการ: {{ selectedMaterial?.name }}
          </h2>
          <p class="text-gray-600 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button
              @click="handleDeleteMaterial"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              ลบรายการ
            </button>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  /* ป้องกันการซ่อนตารางหากเนื้อหาเกินขอบจอ */
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-family: "Kanit", sans-serif;
  font-size: 0.9rem;
}

.table th,
.table td {
  background-color: #ffffff;
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
  /* จัดข้อความในเซลล์ตรงกลาง */
}

.table th {
  background-color: #ffcc66;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}

.table td:nth-child(2) {
  text-align: space-between;
  /* จัดให้อยู่ตรงกลางตามแนวนอน */
  vertical-align: middle;
  /* จัดให้อยู่ตรงกลางตามแนวตั้ง */
  padding: 8px;
}

.table td:nth-child(2) img {
  display: block;
  /* ให้ภาพเป็น block เพื่อให้จัดกึ่งกลางได้ */
  margin: 0 auto;
  /* จัดให้อยู่ตรงกลาง */
  max-width: 100px;
  /* กำหนดขนาดสูงสุดของภาพ */
  max-height: 100px;
}

/* จัดปุ่มให้อยู่กึ่งกลาง และกำหนดขนาดคงที่ */
.table td div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  /* ความกว้างคงที่ */
}

.table td div > div {
  width: 120px;
  /* ความกว้างคงที่ */
  min-width: 120px;
  /* ป้องกันการหด */
  max-width: 120px;
  /* ป้องกันการขยาย */
  height: 40px;
  /* ความสูงคงที่ */
  flex: 0 0 auto;
  /* ป้องกันการยืด/หด */
  border-radius: 5px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #fefefe;
}
.table td[data-label="รายการ"] {
  text-align: left; /* จัดชิดซ้าย */
  padding-left: 10px; /* เพิ่มระยะห่างจากขอบ */
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

.table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
  /* สีพื้นหลังของแถวคี่ */
}

.table tbody tr:nth-child(even) {
  background-color: #ffffff;
  /* สีพื้นหลังของแถวคู่ */
}

.table td:first-child {
  font-weight: bold;
  /* ทำให้ข้อความในเซลล์แรกของแต่ละแถวเป็นตัวหนา */
}

.table th:first-child {
  border-left: 2px solid #ff9900;
  /* เพิ่มเส้นขอบพิเศษ */
}

.table th:last-child {
  border-right: 2px solid #ff9900;
  /* เพิ่มเส้นขอบพิเศษ */
}

.form-control .absolute {
  background: linear-gradient(90deg, #ffffff 0%, #f9fafb 100%);
  border: 1px solid #e5e7eb;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.form-control label {
  font-family: "Prompt", sans-serif;
}

.form-control .absolute ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.form-control .absolute ul li {
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out;
}

.form-control .absolute ul li:hover {
  background-color: #e0f2fe;
}

.form-control .absolute ul li svg {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.form-control .absolute ul li:hover svg {
  transform: scale(1.2);
}

/* Scrollbar Styling */
.menu-dropdown {
  scrollbar-width: thin;
  /* สำหรับ Firefox */
  scrollbar-color: #007bff #f1f1f1;
  /* สีของ scrollbar และพื้นหลัง */
}

.menu-dropdown::-webkit-scrollbar {
  width: 8px;
  /* ความกว้างของ scrollbar */
}

.menu-dropdown::-webkit-scrollbar-thumb {
  background: #007bff;
  /* สีของ scrollbar */
  border-radius: 4px;
  /* มุมโค้งมนของ scrollbar */
}

.menu-dropdown::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
  /* สีเมื่อ hover บน scrollbar */
}

.menu-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  /* สีพื้นหลังของ scrollbar */
  border-radius: 4px;
  /* มุมโค้งมนของ track */
}

/* เพิ่มเอฟเฟกต์แบบ smooth */
.menu-dropdown {
  scroll-behavior: smooth;
}

/* ทำให้ label ครอบคลุมพื้นที่ทั้งหมดของ li */
label {
  display: flex;
  align-items: center;
  width: 100%;
  /* ครอบคลุมพื้นที่ทั้งหมด */
  padding: 8px 12px;
  /* เพิ่มพื้นที่คลิก */
}

input[type="checkbox"].hidden {
  display: none;
  /* ซ่อน checkbox */
}
/* ปุ่มแจ้งเตือน */
button {
  position: right;
}

button:hover {
  transform: scale(1.1); /* เพิ่มเอฟเฟกต์ขยายเล็กน้อยเมื่อวางเมาส์ */
  transition: transform 0.2s ease;
}

/* SVG ไอคอน */
button svg {
  transition: stroke 0.2s ease;
}

button:hover svg {
  stroke: #ffcc00; /* เปลี่ยนสีเมื่อวางเมาส์ */
}

/* กล่องแจ้งเตือน */
div[v-if="isNotificationOpen"] {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* หัวข้อ */
h3 {
  color: #2c3e50; /* สีเข้มเพื่อความชัดเจน */
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 4px;
  margin-bottom: 8px;
}

/* กล่องแจ้งเตือน */
div[v-if="isNotificationOpen"] {
  background-color: #ffffff; /* สีพื้นหลังขาว */
  border: 1px solid #0073e6; /* เส้นขอบสีฟ้า */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15); /* เงา */
  border-radius: 8px;
  animation: fadeIn 0.3s ease; /* เพิ่มเอฟเฟกต์แสดง */
  z-index: 50;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* หัวข้อ */
h3 {
  color: #0056b3; /* สีน้ำเงินเข้ม */
  border-bottom: 2px solid #f1f1f1;
  padding-bottom: 8px;
  margin-bottom: 12px;
  text-align: center; /* จัดตรงกลาง */
  font-family: "Prompt", sans-serif;
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
  transition: background-color 0.2s ease, transform 0.2s ease;
}

ul li:hover {
  background-color: #e6f7ff; /* สีฟ้าอ่อน */
  transform: scale(1.02); /* ขยายเล็กน้อยเมื่อวางเมาส์ */
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
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #0073e6 #f1f1f1;
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar {
  width: 8px; /* ความกว้าง scrollbar */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb {
  background: #0073e6; /* สี scrollbar */
  border-radius: 4px;
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-thumb:hover {
  background: #0056b3; /* สีเมื่อวางเมาส์ */
}

div[v-if="isNotificationOpen"]::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* Scrollbar Styling สำหรับตาราง */
.table-container {
  width: 100%;
  max-height: calc(65vh - 100px); /* ลดขนาดลงจากความสูงหน้าจอ */
  min-height: 150px; /* กำหนดความสูงขั้นต่ำ */
  height: auto; /* ปรับความสูงอัตโนมัติตามเนื้อหา */
  overflow-y: auto; /* เพิ่ม scroll หากเนื้อหายาวเกิน */
  border: 1px solid #ddd;
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #007bff #f1f1f1; /* สี Thumb และ Track */
}

.table-container::-webkit-scrollbar {
  width: 10px; /* ความกว้าง scrollbar */
  height: 10px; /* ความสูง scrollbar แนวนอน */
}

.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #4a90e2, #007bff); /* สีไล่ระดับของ Thumb */
  border-radius: 8px; /* มุม Thumb โค้งมน */
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #007bff, #0056b3); /* สีเมื่อ Hover */
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1; /* สีพื้นหลังของ Track */
  border-radius: 8px; /* มุม Track โค้งมน */
}

.table-container::-webkit-scrollbar-track:hover {
  background: #e6e6e6; /* สี Track เมื่อ Hover */
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
/* เพิ่มเอฟเฟกต์แบบ Smooth */
.table-container {
  scroll-behavior: smooth;
}
/* พื้นหลังของโมดอล */
div[v-if="isImageModalOpen"] {
  animation: fadeIn 0.3s ease-in-out;
}

/* ปุ่มปิด */
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  transform: scale(1.2);
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
</style>
