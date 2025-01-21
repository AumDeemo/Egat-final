<template>
  <adminLayouts>
    <!-- หัวข้อ -->
    <h1
      class="text-center text-5xl font-extrabold text-gray-800 tracking-wider mb-5 mt-5"
    >
      รถยนต์บริการ
    </h1>

    <div class="flex justify-center w-full mb-4">
      <!-- ปุ่มเปิดฟอร์มกรอกข้อมูลเครื่องจักรใหม่ -->
      <button
        @click="openForm"
        class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
      >
        + เพิ่มข้อมูลรถยนต์
      </button>
    </div>

    <!-- ฟอร์มกรอกข้อมูลเครื่องจักร -->
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

        <h2 class="text-2xl font-bold text-gray-800 mb-3">เพิ่มข้อมูลเครื่องจักร</h2>

        <!-- ฟอร์มกรอกข้อมูลเครื่องจักร -->
        <form @submit.prevent="addMachine">
          <div class="mb-4">
            <label for="name" class="block text-sm font-semibold">ชื่อเครื่องจักร</label>
            <input
              v-model="newMachine.name"
              type="text"
              id="name"
              class="w-full p-2 border rounded"
              required
            />
          </div>

          <!-- หัวข้อ "รายละเอียด" ไม่มีฟิลด์กรอก -->
          <div class="mb-4">
            <label class="block text-sm font-semibold">รายละเอียด</label>
            <p class="text-gray-600">กรุณากรอกข้อมูลเครื่องจักรในส่วนอื่น ๆ</p>
          </div>

          <div class="mb-4">
            <label for="brand" class="block text-sm font-semibold">ยี่ห้อ</label>
            <input
              v-model="newMachine.brand"
              type="text"
              id="brand"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="model" class="block text-sm font-semibold">รุ่น</label>
            <input
              v-model="newMachine.model"
              type="text"
              id="model"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="num" class="block text-sm font-semibold">หมายเลขกฟผ.</label>
            <input
              v-model="newMachine.num"
              type="text"
              id="num"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="capacity" class="block text-sm font-semibold">ความจุ</label>
            <input
              v-model="newMachine.capacity"
              type="text"
              id="capacity"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="carry" class="block text-sm font-semibold">น้ำหนักยก</label>
            <input
              v-model="newMachine.carry"
              type="text"
              id="carry"
              class="w-full p-2 border rounded"
              required
            />
          </div>
          <div class="mb-4">
            <label for="carNum" class="block text-sm font-semibold">เลขทะเบียน</label>
            <input
              v-model="newMachine.carNum"
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
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </adminLayouts>
</template>

<script setup>
import { ref, onMounted } from "vue";
import adminLayouts from "~/layouts/adminLayouts.vue";

const isModalOpen = ref(false);
const isFormOpen = ref(false);
const machines = ref([]);
const newMachine = ref({
  name: "",
  description: "",
  brand: "",
  model: "",
  num: "",
  capacity: "",
  carry: "",
  carNum: "",
  image: null,
});

const openForm = () => {
  isFormOpen.value = true;
};

const closeForm = () => {
  isFormOpen.value = false;
};

const openModal = (
  name,
  description,
  brand,
  model,
  num,
  capacity,
  carry,
  carnum,
  image
) => {
  modalTitle.value = name;
  modalDescription.value = description;
  modalBrand.value = brand;
  modalModel.value = model;
  modalNum.value = num;
  modalCapacity.value = capacity;
  modalCarry.value = carry;
  modalCarNum.value = carnum;
  modalImage.value = image;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const fetchMachines = async () => {
  try {
    const response = await fetch("/api/admin/motor/machines");
    if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลเครื่องจักรได้");
    machines.value = await response.json();
  } catch (error) {
    console.error("Error fetching machines:", error);
  }
};

// ฟังก์ชันจัดการการอัปโหลดรูปภาพ
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newMachine.value.image = file; // ตั้งชื่อไฟล์รูปภาพ
  }
};

const addMachine = async () => {
  const formData = new FormData();
  formData.append("name", newMachine.value.name);
  formData.append("description", newMachine.value.description);
  formData.append("brand", newMachine.value.brand);
  formData.append("model", newMachine.value.model);
  formData.append("num", newMachine.value.num);
  formData.append("capacity", newMachine.value.capacity);
  formData.append("carry", newMachine.value.carry);
  formData.append("carNum", newMachine.value.carNum);

  if (newMachine.value.image) {
    formData.append("image", newMachine.value.image); // ส่งไฟล์ไปกับฟอร์ม
  }

  console.log("Form Data being sent:", formData);

  try {
    const response = await fetch("/api/admin/motor/machines", {
      method: "POST",
      body: formData, // ส่ง FormData ไปกับ POST request
    });

    if (response.ok) {
      alert("เครื่องจักรถูกเพิ่มแล้ว");
      closeForm();
    } else {
      alert("ไม่สามารถเพิ่มเครื่องจักรได้");
    }
  } catch (error) {
    console.error("Error adding machine:", error);
  }
};

// ดึงข้อมูลเครื่องจักรเมื่อ component โหลด
onMounted(() => {
  fetchMachines();
});

definePageMeta({
  middleware: 'check-role'
})
</script>

<style scoped>
/* ปรับแต่ง scrollbar ให้สวยงาม */
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

/* ทำให้ modal สามารถ scroll ได้ */
.max-h {
  max-height: 90vh;
  /* กำหนดความสูงสูงสุดของ Modal เป็น 90% ของหน้าจอ */
}

.overflow-y-auto {
  overflow-y: auto;
  /* เพิ่ม scroll เมื่อเนื้อหามีมากเกิน */
}
</style>
