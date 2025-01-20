<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/userLayouts.vue";
import * as XLSX from "xlsx"; // Import the XLSX library

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const prFiles = ref([]); // ใช้เก็บข้อมูล PR
const poFiles = ref([]); // ใช้เก็บข้อมูล PO
const previewFile = ref(null);
const previewContent = ref(null); // Store preview content
const isPreviewModalOpen = ref(false); // ใช้เพื่อควบคุมการเปิด/ปิด Modal
const previewFileType = ref(null);
import mammoth from "mammoth";

// ดึงข้อมูล PR จาก API
const fetchPRFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/hire/pr/prfile");

    if (error.value) {
      console.error("Error fetching PR files:", error.value);
    } else {
      prFiles.value = toRaw(data.value).map((file) => ({
        ...file,
        path: `/hire/pr/${file.name}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching PR files:", error);
  }
};

// ดึงข้อมูล PO จาก API
const fetchPOFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/hire/po/pofile");

    if (error.value) {
      console.error("Error fetching PO files:", error.value);
    } else {
      poFiles.value = toRaw(data.value).map((file) => ({
        ...file,
        path: `/hire/po/${file.name}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching PO files:", error);
  }
};

// ฟังก์ชันสำหรับกรองไฟล์ PR และ PO ตาม searchQuery
const filteredPRFiles = computed(() => {
  if (!searchQuery.value) return prFiles.value;
  return prFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredPOFiles = computed(() => {
  if (!searchQuery.value) return poFiles.value;
  return poFiles.value.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const downloadFile = (file) => {
  const link = document.createElement("a");
  link.href = file.path;
  link.download = file.name; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
  document.body.appendChild(link); // เพิ่มลิงก์ลงใน DOM
  link.click(); // คลิกเพื่อดาวน์โหลด
  document.body.removeChild(link); // ลบลิงก์ออกจาก DOM
};

const previewWord = async (file) => {
  try {
    const response = await fetch(file.path);
    const arrayBuffer = await response.arrayBuffer();

    // ใช้ Mammoth.js แปลงไฟล์ Word เป็น HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });
    previewContent.value = result.value; // HTML Content
    previewFileType.value = "word";
    isPreviewModalOpen.value = true;
  } catch (error) {
    console.error("Error previewing Word file:", error);
    alert("ไม่สามารถพรีวิวไฟล์ Word ได้");
  }
};

const previewPDF = (file) => {
  previewFile.value = file;
  previewFileType.value = "pdf";
  isPreviewModalOpen.value = true;
};

// ฟังก์ชันอ่านไฟล์ Excel และแสดงข้อมูล
const previewExcelContent = async (file) => {
  try {
    // ดึงเนื้อหาไฟล์
    const response = await fetch(file.path);
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0]; // เลือก Sheet แรก
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // แปลงเป็น JSON

    previewContent.value = jsonData;
    previewFileType.value = "excel";
    isPreviewModalOpen.value = true;
  } catch (error) {
    console.error("Error previewing Excel file:", error);
  }
};

const closePreviewModal = () => {
  previewFile.value = null;
  isPreviewModalOpen.value = false;
};

onMounted(async () => {
  await fetchPRFiles();
  await fetchPOFiles();
  previewFileType.value = null;
  console.log("dataPR : ", prFiles.value);
  console.log("dataPO : ", poFiles.value);
});
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <!-- ส่วนช่องค้นหา -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาไฟล์..."
          class="w-full p-4 border border-gray-300 rounded-lg text-center shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
      </div>

      <!-- ตารางแสดงข้อมูล PR และ PO -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- PR Table -->
        <div class="w-full bg-white rounded-lg shadow-lg p-4">
          <h2
            class="text-xl sm:text-2xl font-bold text-center text-gray-700 bg-blue-100 py-2 rounded-md mb-4"
          >
            รายการ PR
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse text-sm sm:text-base">
              <thead>
                <tr class="bg-blue-500 text-white">
                  <th class="p-2 sm:p-3 text-left rounded-tl-lg">ชื่อไฟล์</th>
                  <th class="p-2 sm:p-3 text-center rounded-tr-lg">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPRFiles"
                  :key="file.id"
                  class="hover:bg-blue-50 transition"
                >
                  <td class="p-2 sm:p-3 border-b text-gray-700 flex items-center gap-2">
                    <!-- ไอคอน Excel -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      fill="none"
                      class="w-6 h-6"
                    >
                      <rect width="48" height="48" rx="6" fill="#107C41" />
                      <path
                        d="M14 12C12.8954 12 12 12.8954 12 14V34C12 35.1046 12.8954 36 14 36H34C35.1046 36 36 35.1046 36 34V14C36 12.8954 35.1046 12 34 12H14Z"
                        fill="#33C481"
                      />
                      <path
                        d="M18 17.3438C18 17.0207 18.2442 16.7765 18.5673 16.7765H20.3279C20.5886 16.7765 20.8238 16.9302 20.9465 17.1635L23.2263 21.6766L25.5061 17.1635C25.6288 16.9302 25.864 16.7765 26.1248 16.7765H27.8853C28.2084 16.7765 28.4526 17.0207 28.4526 17.3438C28.4526 17.4671 28.4176 17.5867 28.3536 17.6877L24.7861 24L28.3536 30.3123C28.4176 30.4133 28.4526 30.5329 28.4526 30.6562C28.4526 30.9793 28.2084 31.2235 27.8853 31.2235H26.1248C25.864 31.2235 25.6288 31.0698 25.5061 30.8365L23.2263 26.3234L20.9465 30.8365C20.8238 31.0698 20.5886 31.2235 20.3279 31.2235H18.5673C18.2442 31.2235 18 30.9793 18 30.6562C18 30.5329 18.035 30.4133 18.099 30.3123L21.6665 24L18.099 17.6877C18.035 17.5867 18 17.4671 18 17.3438Z"
                        fill="white"
                      />
                    </svg>
                    {{ file.name }}
                  </td>
                  <td class="p-2 sm:p-3 border-b text-center">
                    <!-- ปุ่มดาวน์โหลด -->
                    <button
                      v-if="file.path"
                      @click="downloadFile(file)"
                      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                      ดาวน์โหลด
                    </button>

                    <!-- ปุ่มพรีวิว Word -->
                    <button
                      v-if="file.name.endsWith('.doc') || file.name.endsWith('.docx')"
                      @click="previewWord(file)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>

                    <!-- ปุ่มพรีวิว PDF -->
                    <button
                      v-if="file.name.endsWith('.pdf')"
                      @click="previewPDF(file)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>

                    <!-- ปุ่มพรีวิว Excel -->
                    <button
                      v-if="file.name.endsWith('.xls') || file.name.endsWith('.xlsx')"
                      @click="previewExcelContent(file)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPRFiles.length === 0">
                  <td colspan="2" class="p-3 text-center text-gray-500">ไม่มีไฟล์ PR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PO Table -->
        <div class="w-full bg-white rounded-lg shadow-lg p-4">
          <h2
            class="text-xl sm:text-2xl font-bold text-center text-gray-700 bg-green-100 py-2 rounded-md mb-4"
          >
            รายการ PO
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto border-collapse text-sm sm:text-base">
              <thead>
                <tr class="bg-green-500 text-white">
                  <th class="p-2 sm:p-3 text-left rounded-tl-lg">ชื่อไฟล์</th>
                  <th class="p-2 sm:p-3 text-center rounded-tr-lg">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPOFiles"
                  :key="file.id"
                  class="hover:bg-green-50 transition"
                >
                  <td class="p-2 sm:p-3 border-b text-gray-700 flex items-center gap-2">
                    <!-- ไอคอน Excel -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      fill="none"
                      class="w-6 h-6"
                    >
                      <rect width="48" height="48" rx="6" fill="#107C41" />
                      <path
                        d="M14 12C12.8954 12 12 12.8954 12 14V34C12 35.1046 12.8954 36 14 36H34C35.1046 36 36 35.1046 36 34V14C36 12.8954 35.1046 12 34 12H14Z"
                        fill="#33C481"
                      />
                      <path
                        d="M18 17.3438C18 17.0207 18.2442 16.7765 18.5673 16.7765H20.3279C20.5886 16.7765 20.8238 16.9302 20.9465 17.1635L23.2263 21.6766L25.5061 17.1635C25.6288 16.9302 25.864 16.7765 26.1248 16.7765H27.8853C28.2084 16.7765 28.4526 17.0207 28.4526 17.3438C28.4526 17.4671 28.4176 17.5867 28.3536 17.6877L24.7861 24L28.3536 30.3123C28.4176 30.4133 28.4526 30.5329 28.4526 30.6562C28.4526 30.9793 28.2084 31.2235 27.8853 31.2235H26.1248C25.864 31.2235 25.6288 31.0698 25.5061 30.8365L23.2263 26.3234L20.9465 30.8365C20.8238 31.0698 20.5886 31.2235 20.3279 31.2235H18.5673C18.2442 31.2235 18 30.9793 18 30.6562C18 30.5329 18.035 30.4133 18.099 30.3123L21.6665 24L18.099 17.6877C18.035 17.5867 18 17.4671 18 17.3438Z"
                        fill="white"
                      />
                    </svg>
                    {{ file.name }}
                  </td>
                  <td class="p-2 sm:p-3 border-b text-center">
                    <!-- ปุ่มดาวน์โหลด -->
                    <button
                      v-if="file.path"
                      @click="downloadFile(file)"
                      class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                        />
                      </svg>
                      ดาวน์โหลด
                    </button>

                    <!-- ปุ่มพรีวิว Word -->
                    <button
                      v-if="file.name.endsWith('.doc') || file.name.endsWith('.docx')"
                      @click="previewWord(file)"
                      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>

                    <!-- ปุ่มพรีวิว PDF -->
                    <button
                      v-if="file.name.endsWith('.pdf')"
                      @click="previewPDF(file)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>

                    <!-- ปุ่มพรีวิว Excel -->
                    <button
                      v-if="file.name.endsWith('.xls') || file.name.endsWith('.xlsx')"
                      @click="previewExcelContent(file)"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                        />
                      </svg>
                      พรีวิว
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPOFiles.length === 0">
                  <td colspan="2" class="p-3 text-center text-gray-500">ไม่มีไฟล์ PO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- Modal -->
      <div
        v-if="isPreviewModalOpen"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-11/12 max-w-5xl p-6 relative overflow-y-auto max-h-[85vh] border border-gray-300"
        >
          <!-- Header -->
          <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-bold text-gray-800">
              {{
                previewFileType === "pdf"
                  ? "PDF Preview"
                  : previewFileType === "excel"
                  ? "Excel Preview"
                  : previewFileType === "word"
                  ? "Word Preview"
                  : "Preview"
              }}
            </h3>
            <button
              @click="closePreviewModal"
              class="text-gray-500 hover:text-red-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div>
            <!-- Word Preview -->
            <div v-if="previewFileType === 'word'" class="word-preview">
              <div class="p-4 bg-white rounded shadow" v-html="previewContent"></div>
            </div>

            <!-- PDF Preview -->
            <div v-if="previewFileType === 'pdf'">
              <embed :src="previewFile.path" width="100%" height="600px" />
            </div>

            <!-- Excel Preview -->
            <div v-if="previewFileType === 'excel'">
              <table
                class="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden"
              >
                <thead class="bg-gray-200 text-gray-700">
                  <tr>
                    <th
                      v-for="(header, index) in previewContent[0]"
                      :key="index"
                      class="p-3 text-left font-medium border-b"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIndex) in previewContent.slice(1)"
                    :key="rowIndex"
                    class="even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td
                      v-for="(cell, cellIndex) in row"
                      :key="cellIndex"
                      class="p-3 text-gray-600 border-b whitespace-nowrap"
                    >
                      {{ cell }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end">
            <button
              @click="closePreviewModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>

    </div>
  </adminLayouts>
</template>
