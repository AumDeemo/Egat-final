<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 via-blue-100 to-white font-prompt select-none"
  >
    <form
      @submit.prevent="login"
      class="card w-full max-w-md bg-white shadow-xl rounded-lg"
    >
      <div class="card-body p-8">
        <!-- Header -->
        <div class="flex justify-center mb-6">
          <div class="flex items-center space-x-4">
            <img
              src="https://www.egat.co.th/home/en/wp-content/uploads/2024/03/engy-30.png"
              alt="EGAT Logo"
              class="w-16 h-16"
            />
            <p class="text-3xl font-semibold text-blue-800">เข้าสู่ระบบ</p>
          </div>
        </div>

        <!-- Form -->
        <div>
          <div class="form-control mb-5">
            <label for="email" class="text-gray-600 font-medium">ID</label>
            <input
              v-model="username"
              type="email"
              id="email"
              placeholder="กรอกอีเมล"
              class="input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
          <div class="form-control mb-5">
            <label for="password" class="text-gray-600 font-medium">รหัสผ่าน</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="กรอกรหัสผ่าน"
              class="input input-bordered w-full border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <p v-if="loginError" class="text-red-500 text-sm mt-2">{{ loginError }}</p>
          </div>
          <div class="form-control mt-5">
            <button
              type="submit"
              class="btn btn-accent w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 shadow-lg"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-8 text-center">
          <RouterLink
            to="/users"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            ย้อนกลับ
          </RouterLink>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";

const username = ref("");
const password = ref("");

const loginError = ref("");
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        username: username.value,
        password: password.value,
      },
    });

    authStore.login(response);

    router.push("/admin/sparepartslist");
  } catch (error) {
    console.error("Login failed", error);
    loginError.value = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
};
</script>

<style scoped>
.font-prompt {
  font-family: "Prompt", sans-serif !important;
}

.card {
  border-radius: 1rem;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}
</style>
//Login//
