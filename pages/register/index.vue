<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 font-prompt"
  >
    <form
      @submit.prevent="register"
      class="card w-full max-w-sm bg-white shadow-lg rounded-lg"
    >
      <div class="card-body p-6">
        <div class="flex justify-center mb-4">
          <div class="flex items-center">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
              alt="logo"
              class="w-16"
            />
            <div class="flex items-end ml-2">
              <p class="text-2xl font-semibold select-none text-gray-800">สมัครสมาชิก</p>
            </div>
          </div>
        </div>

        
        <div class="form-control select-none mb-2">
          <label class="label flex items-center mb-1">
            <!-- ไอคอน -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-gray-700 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <p class="text-gray-700">อีเมลผู้ใช้งาน</p>
          </label>
          <input
            v-model="username"
            type="text"
            placeholder="กรุณากรอกอีเมล"
            class="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div class="form-control select-none mb-2">
          <label class="label flex items-center mb-1">
            <!-- ไอคอน -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-gray-700 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <p class="text-gray-700">ชื่อ - นามสกุล</p>
          </label>
          <input
            v-model="fullname"
            type="text"
            placeholder="กรุณากรอกชื่อเต็ม"
            class="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div class="form-control select-none mb-2">
          <label class="label flex items-center mb-1">
            <!-- ไอคอน -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-gray-700 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            <p class="text-gray-700">รหัสผ่าน</p>
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="กรุณากรอกรหัสผ่าน"
            class="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div class="form-control select-none mb-2">
          <label class="label flex items-center mb-1">
            <!-- ไอคอน -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-gray-700 mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            <p class="text-gray-700">ยืนยันรหัสผ่าน</p>
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="กรุณากรอกรหัสผ่าน"
            class="input input-bordered w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div class="form-control mt-4">
          <button
            type="submit"
            class="btn btn-primary w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 inline-block mr-2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              /></svg>
            สมัครสมาชิก
          </button>
        </div>

        <RouterLink to="/login" class="flex justify-center mt-4">
          <div class="flex justify-center bg-black p-2 rounded-xl">
            <p class="text-white text-sm select-none">เข้าสู่ระบบ</p>
          </div>
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const fullname = ref("");
const router = useRouter();

const register = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }
  try {
    const response = await $fetch("/api/auth/register", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        fullname: fullname.value,
      },
    });
    console.log("data : ", response);
    router.push("/login");
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<style scoped>
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}

.label {
  display: flex;
  align-items: center;
}

.label svg {
  margin-right: 0.5rem;
}

.input {
  padding-left: 1rem;
}

.btn-primary {
  background-color: #fbbf24;
  border: none;
  transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #f59e0b;
}

.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.5);
}
</style>
