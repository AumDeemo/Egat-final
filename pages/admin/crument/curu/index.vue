<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- ส่วนหัว -->
      <header
        class="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white rounded-lg px-8 py-4 shadow-lg"
      >
        <h1 class="text-4xl font-extrabold text-center tracking-wide">
          ระบบจัดการข้อมูลคุรุภัณฑ์
        </h1>
        <p class="text-center text-sm mt-2 font-light">
          การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (EGAT)
        </p>
      </header>
      <!-- ปุ่มเพิ่มรายการและช่องค้นหา -->
      <div
        class="bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center justify-between gap-6"
      >
        <!-- ปุ่มเพิ่มรายการ -->
        <RouterLink
          to="/crument/curu"
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
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหา"
          class="w-full p-3 border border-gray-300 rounded-full text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 ease-in-out"
        />
      </div>

      <!-- ตาราง -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4 text-blue-600 text-center">รายการคุรุภัณฑ์</h2>
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
                  <th>รายละเอียด</th>
                  <th>แก้ไข</th>
                  <th>ลบรายการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="curu in filteredCURU" key="curu.id">
                  <th data-label="ลำดับ">{{ curu.number }}</th>
                  <td data-label="รูปภาพ">
                    <!-- แสดงรูปภาพถ้ามี URL -->
                    <img
                      v-if="curu.imageUrl"
                      :src="curu.imageUrl"
                      alt="curu Image"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                    <!-- แสดงข้อความถ้าไม่มีรูป -->
                    <span v-else class="text-gray-500">ไม่มีรูปภาพ</span>
                  </td>
                  <td data-label="ชื่อรุ่น">{{ curu.name }}</td>
                  <td data-label="รหัสสินทรัพย์">{{ curu.partnumber }}</td>
                  <td data-label="รายละเอียด">
                    <!-- เพิ่มปุ่มรายละเอียด -->
                    <button
                      @click="openModal(MODAL_TYPES.DETAILS, curu)"
                      class="preview-btn"
                      type="button"
                    >
                      รายละเอียด
                    </button>
                  </td>
                  <td data-label="แก้ไข">
                    <!-- เพิ่มปุ่มแก้ไข -->
                    <button
                      @click="openModal(MODAL_TYPES.EDIT, curu)"
                      class="edit-btn"
                      type="button"
                    >
                      แก้ไข
                    </button>
                  </td>
                  <td data-label="ลบรายการ">
                    <!-- เพิ่มปุ่มลบ -->
                    <button
                      @click="openModal(MODAL_TYPES.DELETE, curu)"
                      class="delete-btn"
                      type="button"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
                <!-- แสดงข้อความ "ไม่มีรายการ" เมื่อ filteredCURU ไม่มีข้อมูล -->
                <tr v-if="filteredCURU.length === 0">
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
            รายละเอียดคุรุภัณฑ์
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
                  <td class="py-2 px-4 border-b">{{ selectedCURU.number }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.curunumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.partnumber }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.detial }}</td>
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
                  <td class="py-2 px-4 border-b">{{ selectedCURU.brand }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.name }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.usenumber }}</td>
                  <td class="py-2 px-4 border-b">{{ formatDate(selectedCURU.date) }}</td>
                  <td class="py-2 px-4 border-b">{{ selectedCURU.detialnumber }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Image Preview -->
          <div class="preview-container">
            <img
              v-if="selectedCURU.imageUrl"
              :src="selectedCURU.imageUrl"
              alt="Image Preview"
              class="image-preview"
            />
            <p v-else class="text-gray-500 text-center font-semibold">ไม่มีรูปภาพ</p>
          </div>

          <!-- Close Button ด้านล่าง -->
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

      <!-- Edit Modal -->
      <div
        v-if="modalType === MODAL_TYPES.EDIT"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto shadow-xl"
        >
          <h2 class="text-xl font-bold mb-6 text-center text-blue-600">
            แก้ไขข้อมูลคุรุภัณฑ์
          </h2>

          <!-- Edit Form -->
          <form>
            <!-- Grid Layout -->
            <div class="grid grid-cols-3 gap-6">
              <!-- Column 1 -->
              <div class="form-control">
                <label class="font-medium text-gray-700">ลำดับ</label>
                <input
                  v-model="selectedCURU.number"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกลำดับ"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">ชื่อรุ่น</label>
                <input
                  v-model="selectedCURU.name"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกชื่อรุ่น"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">ยี่ห้อ</label>
                <input
                  v-model="selectedCURU.brand"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกยี่ห้อ"
                />
              </div>

              <!-- Column 2 -->
              <div class="form-control">
                <label class="font-medium text-gray-700">รหัสครุภัณฑ์</label>
                <input
                  v-model="selectedCURU.curunumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรหัสครุภัณฑ์"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">รหัสสินทรัพย์</label>
                <input
                  v-model="selectedCURU.partnumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรหัสสินทรัพย์"
                />
              </div>
              <div class="form-control">
                <label class="font-medium text-gray-700">หมายเลขเครื่อง</label>
                <input
                  v-model="selectedCURU.usenumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกหมายเลขเครื่อง"
                />
              </div>

              <!-- Column 3 -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">วันที่ได้มา</label>
                <input
                  v-model="selectedCURU.date"
                  type="datetime-local"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                />
              </div>
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">รายละเอียด</label>
                <textarea
                  v-model="selectedCURU.detial"
                  class="textarea textarea-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกรายละเอียด"
                ></textarea>
              </div>
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">เลขที่ใบโอน</label>
                <input
                  v-model="selectedCURU.detialnumber"
                  class="input input-bordered focus:ring focus:ring-blue-300"
                  placeholder="กรอกเลขที่ใบโอน"
                />
              </div>

              <!-- ช่องแสดงรูปภาพ -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">รูปภาพปัจจุบัน</label>
                <div class="flex justify-center items-center">
                  <img
                    v-if="previewImageUrl"
                    :src="previewImageUrl"
                    alt="Preview Image"
                    class="h-40 w-40 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                  <img
                    v-else-if="selectedCURU.imageUrl"
                    :src="selectedCURU.imageUrl"
                    alt="Current Image"
                    class="h-40 w-40 object-cover rounded-md border border-gray-300 shadow-sm"
                  />
                  <p
                    v-else
                    class="absolute inset-0 flex items-center justify-center text-gray-700 text-center font-semibold"
                  >
                    ไม่มีรูปภาพ
                  </p>
                </div>
              </div>

              <!-- ช่องอัปโหลดรูปภาพ -->
              <div class="form-control col-span-3">
                <label class="font-medium text-gray-700">อัปโหลดรูปภาพใหม่ (ถ้ามี)</label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="file-input file-input-bordered w-full"
                />
                <p class="text-sm text-gray-500 mt-2">เลือกรูปภาพใหม่เพื่ออัปเดตข้อมูล</p>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-8 flex justify-end gap-4">
              <button
                @click="closeModal"
                type="button"
                class="bg-gray-300 text-black px-6 py-2 rounded-full hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
              <button
                @click="handleEditCURU"
                type="button"
                class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div
        v-if="modalType === MODAL_TYPES.DELETE"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-bold mb-4">ยืนยันการลบรายการ: {{ selectedC?.name }}</h2>
          <p class="text-gray-600 mb-4">คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?</p>
          <div class="flex justify-between">
            <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded">
              ยกเลิก
            </button>
            <button @click="deleteCURU" class="bg-red-500 text-white px-4 py-2 rounded">
              ลบรายการ
            </button>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedCURU = ref(null);
const CURU = ref([]); // ใช้เก็บข้อมูล
const modalType = ref(null);
const selectedImage = ref(null);
const sortKey = ref("number"); // ค่าเริ่มต้นคือจัดเรียงตาม "number"
const sortOrder = ref("asc"); // "asc" คือจากน้อยไปมาก, "desc" คือจากมากไปน้อย
const previewImageUrl = ref(null);

const MODAL_TYPES = {
  DETAILS: "details",
  EDIT: "edit",
  DELETE: "delete",
};
// ฟังก์ชั่นรีเซตฟอร์ม
const resetForm = () => {
  selectedImage.value = null;
  previewImageUrl.value = null;
};

// ฟิลเตอร์ไฟล์ตามคำค้นหา
const filteredCURU = computed(() => {
  let filtered = CURU.value;

  if (searchQuery.value) {
    const searchTerms = searchQuery.value.toLowerCase().split(" ");
    filtered = filtered.filter((curu) => {
      return searchTerms.every((term) => {
        return (
          (curu.number && curu.number.toString().toLowerCase().includes(term)) ||
          (curu.name && curu.name.toLowerCase().includes(term)) ||
          (curu.partnumber && curu.partnumber.toLowerCase().includes(term))
        );
      });
    });
  }

  // จัดเรียงข้อมูล
  return filtered.sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];

    if (sortOrder.value === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });
});

const fetchCURU = async () => {
  try {
    const response = await fetch("/api/admin/crument/curu/curu", { method: "GET" });
    if (!response.ok) throw new Error("แสดงข้อมูลอะไหล่ไม่สำเร็จ");
    CURU.value = await response.json();
    console.log("CURU data:", CURU.value);
  } catch (err) {
    console.error("แสดงข้อมูลอะไหล่ไม่สำเร็จ:", err);
    alert(`เกิดข้อผิดพลาด: ${err.message}`);
  }
};

const handleEditCURU = async () => {
  if (!selectedCURU.value) return;
  console.log("Selected CURU:", selectedCURU.value);

  const formData = new FormData();
  formData.append("id", selectedCURU.value.id);
  formData.append("number", selectedCURU.value.number);
  formData.append("name", selectedCURU.value.name);
  formData.append("brand", selectedCURU.value.brand);
  formData.append("curunumber", selectedCURU.value.curunumber);
  formData.append("partnumber", selectedCURU.value.partnumber);
  formData.append("usenumber", selectedCURU.value.usenumber);

  // แปลงค่า date เป็น ISO-8601 string
  const formattedDate = new Date(selectedCURU.value.date).toISOString();
  formData.append("date", formattedDate); // ส่งค่า date ที่แปลงแล้ว

  formData.append("detial", selectedCURU.value.detial);
  formData.append("detialnumber", selectedCURU.value.detialnumber);

  if (selectedImage.value) {
    formData.append("image", selectedImage.value);
  }

  // Log FormData contents
  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  try {
    const response = await fetch("/api/admin/crument/curu/curu", {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log("Response from server:", responseText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    // Refresh the data and close modal
    await fetchCURU();
    closeModal();
    alert("แก้ไขข้อมูลสำเร็จ!");
  } catch (err) {
    alert("แก้ไขข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
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

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (!file) {
    selectedImage.value = null;
    previewImageUrl.value = null;
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
  previewImageUrl.value = URL.createObjectURL(file);
};

const deleteCURU = async (id) => {
  if (!selectedCURU.value) return;
  try {
    const response = await $fetch(`/api/admin/crument/curu/${selectedCURU.value.id}`, {
      method: "DELETE",
    });
    console.log("resDel : ", response);
    // Refresh list
    await fetchCURU();
    closeModal();
    alert("ลบข้อมูลสำเร็จ!"); // เพิ่มแจ้งเตือน
  } catch (err) {
    // Show error notification
    useToast().error("ไม่สามารถลบวัสดุได้");
    console.error("Error deleting material:", err);
  }
};

const openModal = (type, curu) => {
  modalType.value = type;
  selectedCURU.value = curu;
  console.log("Modal Type:", modalType.value);
  console.log("Selected CURU:", selectedCURU.value);
};

const closeModal = () => {
  resetForm(); // เรียกฟังก์ชันรีเซ็ตฟอร์ม
  modalType.value = null;
  selectedCURU.value = null;
};

onMounted(async () => {
  await fetchCURU();
  console.log("CURU Data:", CURU.value);
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

.image-preview {
  max-width: 100%; /* จำกัดความกว้างตามขนาดของ container */
  max-height: 300px; /* กำหนดความสูงสูงสุด */
  object-fit: cover; /* ตัดภาพให้อยู่ในอัตราส่วน */
  border-radius: 8px; /* เพิ่มมุมโค้งให้รูปภาพ */
  transition: transform 0.3s ease; /* เอฟเฟกต์เมื่อ Hover */
}

.image-preview:hover {
  transform: scale(1.05); /* ขยายเล็กน้อยเมื่อ Hover */
}

.preview-container p {
  font-size: 16px; /* ขนาดตัวอักษร */
  color: #6b7280; /* สีข้อความ */
  font-weight: bold; /* ตัวหนา */
}
</style>
//admin//crument//curu//index.vue
