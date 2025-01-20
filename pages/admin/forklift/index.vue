<template>
  <adminLayouts>
    <!-- หัวข้อ -->
    <h1
      class="text-center text-5xl font-extrabold text-gray-800 tracking-wider mb-5 mt-5"
    >
      ForkLift
    </h1>

    <div class="flex justify-center w-full mb-4">
      <!-- ปุ่มเปิดฟอร์มกรอกข้อมูลเครื่อง -->
      <button
        @click="openForm"
        class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        + เพิ่มข้อมูลเครื่องจักร
      </button>
    </div>

    <!-- ฟอร์มกรอกข้อมูล -->
    <div
      v-if="isFormOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-0 relative max-h-[90vh] overflow-y-auto"
      >
        <button
          @click="closeForm"
          aria-label="Close Form"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h2 class="text-2xl font-bold text-gray-800 mb-3">
          {{ isEditing ? "แก้ไขข้อมูลเครื่องจักร" : "เพิ่มข้อมูลเครื่องจักร" }}
        </h2>

        <form @submit.prevent="saveforkfift">
          <div class="mb-4">
            <label for="name" class="block text-sm font-semibold">ชื่อเครื่องจักร</label>
            <input
              v-model="newFL.name"
              type="text"
              id="name"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="brand" class="block text-sm font-semibold">ยี่ห้อ</label>
            <input
              v-model="newFL.brand"
              type="text"
              id="brand"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="model" class="block text-sm font-semibold">รุ่น</label>
            <input
              v-model="newFL.model"
              type="text"
              id="model"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="num" class="block text-sm font-semibold">หมายเลขกฟผ.</label>
            <input
              v-model="newFL.num"
              type="text"
              id="num"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="capacity" class="block text-sm font-semibold">ความจุ</label>
            <input
              v-model="newFL.capacity"
              type="text"
              id="capacity"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="carry" class="block text-sm font-semibold">น้ำหนักยก</label>
            <input
              v-model="newFL.carry"
              type="text"
              id="carry"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="carNum" class="block text-sm font-semibold">เลขทะเบียน</label>
            <input
              v-model="newFL.carNum"
              type="text"
              id="carNum"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <div class="mb-4">
            <label for="image" class="block text-sm font-semibold">เลือกภาพ</label>
            <input
              @change="handleImageUpload"
              type="file"
              id="image"
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              {{ isEditing ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- แสดงข้อมูลเครื่องจักร -->
    <div class="mt-8">
      <h2 class="text-xl font-bold mb-4">รายการ ForkLift</h2>
      <div v-if="forklift.length === 0" class="text-gray-500">ไม่มีข้อมูลเครื่อง</div>
      <div v-else>
        <div
          v-for="FL in forklift"
          :key="FL.id"
          class="mb-4 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex gap-4">
            <img
              v-if="FL.image"
              :src="FL.image"
              alt="FL Image"
              class="w-1/2 max-h-64 object-cover rounded-lg mb-4"
            />
            <div>
              <h3 class="text-lg font-semibold mb-4">{{ FL.name }}</h3>
              <p><strong>ยี่ห้อ:</strong> {{ FL.brand }}</p>
              <p><strong>รุ่น:</strong> {{ FL.model }}</p>
              <p><strong>หมายเลขกฟผ.:</strong> {{ FL.num }}</p>
              <p><strong>ความจุ:</strong> {{ FL.capacity }}</p>
              <p><strong>น้ำหนักยก:</strong> {{ FL.carry }}</p>
              <p><strong>เลขทะเบียน:</strong> {{ FL.carNum }}</p>

              <div class="mt-4 flex gap-2">
                <button
                  @click="editforklift(FL)"
                  class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                >
                  แก้ไข
                </button>
                <button
                  @click="deleteforklift(FL.id)"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const isFormOpen = ref(false);
const isEditing = ref(false);
const forklift = ref([]);

const newFL = ref({
  id: null,
  name: "",
  brand: "",
  model: "",
  num: "",
  capacity: "",
  carry: "",
  carNum: "",
  image: "",
});

const openForm = () => {
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
  isEditing.value = false;
  newFL.value = {
    id: null,
    name: "",
    brand: "",
    model: "",
    num: "",
    capacity: "",
    carry: "",
    carNum: "",
    image: "",
  };
};

const fetchMachines = async () => {
  try {
    const response = await fetch("/api/admin/motor/machines", { method: "GET" });
    if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลเครื่องจักรได้");
    const data = await response.json();
    machines.value = data.data;
  } catch (error) {
    console.error("Error fetching machines:", error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newMachine.value.image = file;
  }
};

const editMachine = (machine) => {
  isFormOpen.value = true;
  isEditing.value = true;
  newMachine.value = { ...machine };
};

const saveMachine = async () => {
  if (isEditing.value) {
    await updateMachine();
  } else {
    await addMachine();
  }
};

const addMachine = async () => {
  try {
    const formData = new FormData();
    Object.keys(newMachine.value).forEach((key) => {
      if (newMachine.value[key]) formData.append(key, newMachine.value[key]);
    });

    const response = await fetch("/api/admin/motor/machines", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("ไม่สามารถเพิ่มข้อมูลเครื่องจักรได้");

    alert("เพิ่มข้อมูลเครื่องจักรสำเร็จ");
    closeForm();
    await fetchMachines();
  } catch (error) {
    console.error("Error adding machine:", error);
    alert("เกิดข้อผิดพลาดในการเพิ่มข้อมูลเครื่องจักร");
  }
};

const updateMachine = async () => {
  try {
    const formData = new FormData();
    Object.keys(newMachine.value).forEach((key) => {
      if (newMachine.value[key]) formData.append(key, newMachine.value[key]);
    });

    const response = await fetch(`/api/admin/motor/machines`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) throw new Error("ไม่สามารถแก้ไขข้อมูลเครื่องจักรได้");

    alert("แก้ไขข้อมูลสำเร็จ");
    closeForm();
    await fetchMachines();
  } catch (error) {
    console.error("Error updating machine:", error);
    alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูลเครื่องจักร");
  }
};

const deleteMachine = async (id) => {
  if (confirm("คุณต้องการลบข้อมูลนี้หรือไม่?")) {
    try {
      const response = await fetch(`/api/admin/motor/delete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete motor");
      }

      alert("ลบข้อมูลสำเร็จ");
      await fetchMachines();
    } catch (error) {
      console.error("Error deleting motor:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  }
};

onMounted(fetchMachines);
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
