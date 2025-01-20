<template>
  <adminLayouts>
    <div class="max-w-7xl mx-auto py-6">
      <h1 class="text-2xl font-bold mb-4">จัดการข้อมูล Users ภายในเว็บ</h1>
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>อีเมล</th>
              <th>ชื่อเต็ม</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="user in users" :key="user.id">
            <!-- row 1 -->
            <tr>
              <th>{{ user.id }}</th>
              <td>{{ user.username }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.role }}</td>
              <td>
                <div class="flex gap-2">
                  <div class="btn">
                    <Trash />
                  </div>
                  <div class="btn btn-accent">
                    <Edit />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import adminLayouts from '~/layouts/adminLayouts.vue';
import Trash from '~/components/admin/Trash.vue';
import Edit from '~/components/admin/Edit.vue';

const users = ref([]);

const fetchUser = async () => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'GET',
    });
    if (!response.ok) throw new Error('แสดงข้อมูลผู้ใช้ไม่สำเร็จ');
    users.value = await response.json();
  } catch (err) {
    console.error('แสดงข้อมูลผู้ใช้ไม่สำเร็จ:', err);
  }
};

onMounted(async () => {
  await fetchUser()
  console.log('data', users.value);

})
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
