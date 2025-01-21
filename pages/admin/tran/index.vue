<template>
  <adminLayouts>
    <div>
      <h1 class="text-2xl font-bold mb-4">Export Files to PDF</h1>

      <!-- File Upload -->
      <input
        type="file"
        @change="handleFileUpload"
        accept="image/*, .txt, .csv"
        class="mb-4 p-2 border border-gray-300 rounded"
      />

      <!-- Preview and Export Button -->
      <div v-if="fileContent" class="mb-6">
        <h2 class="text-lg font-semibold">Preview:</h2>
        <pre class="p-4 bg-gray-100 border border-gray-300 rounded">{{
          fileContent
        }}</pre>
        <button @click="exportToPDF" class="mt-2 btn btn-primary">Export to PDF</button>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";
import jsPDF from "jspdf";

const fileContent = ref("");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fileContent.value = e.target.result;
    };
    reader.readAsText(file);
  }
};

const exportToPDF = () => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(fileContent.value, 180);
  doc.text(lines, 10, 10);
  doc.save("exported-file.pdf");
};

definePageMeta({
  middleware: 'check-role'
})
</script>

<style scoped>
.btn {
  background-color: #3490dc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s;
  cursor: pointer;
  text-align: center;
}

.btn-primary:hover {
  background-color: #2779bd;
}
</style>
