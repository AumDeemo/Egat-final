<script setup>
import { ref, computed, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
import * as XLSX from "xlsx"; // Import the XLSX library

const searchQuery = ref(""); // State สำหรับช่องค้นหา
const selectedFilePR = ref(null);
const selectedFilePO = ref(null);
const prFiles = ref([]); // ใช้เก็บข้อมูล PR
const poFiles = ref([]); // ใช้เก็บข้อมูล PO
const previewFile = ref(null);
const previewContent = ref(null); // Store preview content
const isPreviewModalOpen = ref(false); // ใช้เพื่อควบคุมการเปิด/ปิด Modal
const previewFileType = ref(null);
import mammoth from "mammoth";

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

// ดึงข้อมูล PR จาก API
const fetchPRFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/buy/pr/prfile");

    if (error.value) {
      console.error("Error fetching PR files:", error.value);
    } else {
      prFiles.value = toRaw(data.value).map((file) => ({
        ...file,
        path: `/buy/pr/${file.name}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching PR files:", error);
  }
};

// ดึงข้อมูล PO จาก API
const fetchPOFiles = async () => {
  try {
    const { data, error } = await useFetch("/api/admin/buy/po/pofile");

    if (error.value) {
      console.error("Error fetching PO files:", error.value);
    } else {
      poFiles.value = toRaw(data.value).map((file) => ({
        ...file,
        path: `/buy/po/${file.name}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching PO files:", error);
  }
};

const handleFileUploadPR = (event) => {
  selectedFilePR.value = event.target.files[0];
  console.log("Selected PR File:", selectedFilePR.value);
};

const handleFileUploadPO = (e) => {
  selectedFilePO.value = e.target.files[0];
  console.log("Selected PO File:", selectedFilePO.value);
};

const handleUploadPO = async () => {
  if (!selectedFilePO.value) {
    message.value = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFilePO.value);

  try {
    const response = await fetch("/api/admin/buy/po/pofile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const data = await response.json();
    alert("สำเร็จ");
  } catch (error) {
    console.error(error);
  }
};

const handleUploadPR = async () => {
  if (!selectedFilePR.value) {
    message.value = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFilePR.value);

  try {
    const response = await fetch("/api/admin/buy/pr/prfile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed.");
    }

    const data = await response.json();
    alert("สำเร็จ");
  } catch (error) {
    console.error(error);
  }
};

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

// ลบไฟล์ PR
const deletePRFile = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/buy/pr/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const data = await response.json();
      alert("ไฟล์ถูกลบสำเร็จ");
      fetchPRFiles(); // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  }
};

// ลบไฟล์ PO
const deletePOFile = async (id) => {
  if (confirm("คุณแน่ใจว่าจะลบไฟล์นี้?")) {
    try {
      const response = await fetch("/api/admin/buy/po/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const data = await response.json();
      alert("ไฟล์ถูกลบสำเร็จ");
      fetchPRFiles(); // รีเฟรชรายการหลังจากลบไฟล์
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
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

definePageMeta({
  middleware: 'check-role'
})
</script>

<template>
  <adminLayouts>
    <div class="max-w-8xl mx-auto px-4 py-6 bg-gray-100 min-h-10 overflow-auto">
      <!-- Header Section -->
      <div class="flex flex-col gap-6 mb-6">
        <!-- ช่องค้นหา -->
        <div class="flex justify-center">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="ค้นหาไฟล์..."
            class="w-full p-3 border border-gray-300 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <!-- ส่วน Upload PR และ PO -->
        <div class="flex flex-col sm:flex-row justify-between gap-4">
          <!-- PR File Upload -->
          <form
            @submit.prevent="handleUploadPR"
            class="flex flex-row items-center gap-2 w-full"
          >
            <input
              type="file"
              @change="handleFileUploadPR"
              accept=".xls,.xlsx"
              class="file-input w-full sm:w-3/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              class="w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 whitespace-nowrap"
            >
              อัปโหลด PR
            </button>
          </form>

          <!-- PO File Upload -->
          <form
            @submit.prevent="handleUploadPO"
            class="flex flex-row items-center gap-2 w-full"
          >
            <input
              type="file"
              @change="handleFileUploadPO"
              accept=".xls,.xlsx"
              class="file-input w-full sm:w-3/4 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              class="w-auto bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-200 whitespace-nowrap"
            >
              อัปโหลด PO
            </button>
          </form>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- PR Table -->
        <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-blue-600 text-white text-center py-3 text-2xl font-bold">
            ไฟล์ PR
          </div>
          <div class="table-wrapper custom-scrollbar">
            <table class="w-full table-auto border-collapse">
              <thead class="bg-gray-200">
                <tr>
                  <th class="p-4 text-center font-semibold border-b border-gray-300">
                    ชื่อไฟล์
                  </th>
                  <th class="p-4 text-center font-semibold border-b border-gray-300">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPRFiles"
                  :key="file.id"
                  class="hover:bg-gray-100 transition duration-200"
                >
                  <td class="p-4 truncate text-center border-b border-gray-300">
                    {{ file.name }}
                  </td>
                  <td
                    class="p-4 flex justify-center items-center gap-3 border-b border-gray-300"
                  >
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

                    <!-- ปุ่มลบ -->
                    <button
                      @click="deletePRFile(file.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      ลบ
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPRFiles.length === 0">
                  <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์ PR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PO Table -->
        <div class="w-full lg:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-yellow-500 text-white text-center py-3 text-2xl font-bold">
            ไฟล์ PO
          </div>
          <div class="overflow-y-auto max-h-[400px] custom-scrollbar">
            <table class="w-full table-auto border-collapse">
              <thead class="bg-gray-200">
                <tr>
                  <th class="p-4 text-center font-semibold border-b border-gray-300">
                    ชื่อไฟล์
                  </th>
                  <th class="p-4 text-center font-semibold border-b border-gray-300">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="file in filteredPOFiles"
                  :key="file.id"
                  class="hover:bg-gray-100 transition duration-200"
                >
                  <td class="p-4 truncate text-center border-b border-gray-300">
                    {{ file.name }}
                  </td>
                  <td
                    class="flex-nowrap p-4 flex justify-center items-center gap-2 border-b border-gray-300"
                  >
                    <!-- ปุ่มเปิดดาวน์โหลด -->
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

                    <!-- ปุ่ม Preview Word -->
                    <button
                      v-if="file.name.endsWith('.doc') || file.name.endsWith('.docx')"
                      @click="previewWord(file)"
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

                    <!-- ปุ่ม Preview PDF -->
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

                    <!-- ปุ่ม Preview Excel -->
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

                    <!-- ปุ่มลบ -->
                    <button
                      @click="deletePOFile(file.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      ลบ
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPOFiles.length === 0">
                  <td colspan="2" class="p-4 text-center text-gray-500">ไม่มีไฟล์ PO</td>
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

<style scoped>
/* Custom Scrollbar */
.table-wrapper {
  max-height: 400px; /* กำหนดความสูงของตาราง */
  overflow-y: auto; /* เปิดการเลื่อนเฉพาะแนวตั้ง */
}

.custom-scrollbar {
  scrollbar-width: thin; /* สำหรับ Firefox */
  scrollbar-color: #d1d5db #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
  border: 2px solid #f9fafb;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #a1a1aa;
}

/* Input File Style */
.file-input {
  display: block;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.file-input::file-selector-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-right: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.file-input::file-selector-button:hover {
  background-color: #0056b3;
}

table th,
table td {
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
}

table th {
  background-color: #f3f4f6;
  font-weight: 600;
}

table tr:hover {
  background-color: #f9fafb;
}
td .flex {
  flex-wrap: nowrap;
  gap: 0.5rem; /* ลดช่องว่างระหว่างปุ่มเพื่อให้พอดีกับจอ */
}
button {
  font-size: 12px;
  padding: 10px 12px; /* เพิ่ม padding เพื่อเพิ่มความสูง */
  height: auto; /* กำหนดให้ปุ่มปรับความสูงตาม padding */
}

button svg {
  width: 16px;
  height: 16px; /* ลดขนาดไอคอน */
}
@media (max-width: 768px) {
  .file-input {
    width: 100%; /* ขยายช่อง input file ให้เต็มหน้าจอ */
  }

  button {
    width: auto;
    font-size: 10px; /* ลดขนาดตัวอักษร */
    padding: 5px 6px; /* ลด padding */
  }

  table {
    font-size: 12px; /* ลดขนาดฟอนต์ในตาราง */
  }

  table th,
  table td {
    padding: 8px; /* ลด padding ในเซลล์ */
  }
}
</style>
