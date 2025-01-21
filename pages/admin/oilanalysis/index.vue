<template>
  <adminLayouts>
    <form @submit.prevent="handleUpload">
      <input type="file" @change="onFileChange" accept=".xls,.xlsx" />
      <button type="submit" class="btn">Upload File</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </adminLayouts>
</template>

<script setup>
import { ref } from 'vue';
import adminLayouts from '~/layouts/adminLayouts.vue';

const file = ref(null);
const message = ref('');

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const handleUpload = async () => {
  if (!file.value) {
    message.value = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await fetch('/api/admin/oid/oidfile', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed.');
    }

    const data = await response.json();
    alert('สำเร็จ')
    message.value = `File uploaded successfully: ${data.file.name}`;
  } catch (error) {
    console.error(error);
    message.value = 'Error uploading file.';
  }
};

definePageMeta({
  middleware: 'check-role'
})
</script>
