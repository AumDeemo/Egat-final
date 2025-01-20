<template>
    <div class="flex flex-col h-full">
      <div class="sm:p-0 p-2">
        <button
          class="sm:hidden btn btn-ghost btn-circle p-2 text-black bg-zinc-300"
          @click="toggleMobileNav"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
  
      <!-- Sidebar for Mobile Navigation -->
      <div
        v-if="mobileNavOpen"
        class="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 sm:hidden"
        @click="toggleMobileNav"
      >
        <div
          class="absolute left-0 top-0 h-full w-60 bg-white font-kanit p-2 overflow-auto"
          @click.stop
        >
          <img class="pr-4 pl-4 pt-4" src="/public/admin/EGAT_LOGO.png" alt="logo" />
          <div class="divider pr-4 pl-4"></div>
          <div class="pr-2 pl-2">
            <RouterLink
              to="/admin"
              class="block py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
            >
              <p class="text-base text-orange-400 ml-2">รายการอะไหล่</p>
            </RouterLink>
  
            <RouterLink
              to="/admin"
              class="block mt-2 py-2 px-4 hover:bg-gray-200 rounded-full border-2 border-accent"
            >
              <p class="text-base text-orange-400 ml-2">ไฟล์เอกสาร</p>
            </RouterLink>
          </div>
        </div>
      </div>
  
      <div class="flex">
        <!-- Sidebar / Aside -->
        <aside class="fixed w-60 bg-slate-500 rounded-xl h-screen sm:block flex">
          <div class="h-24 bg-zinc-400 flex justify-center items-center select-none">
            <img src="/public/admin/EGAT_LOGO.png" alt="EGAT-LOGO" class="w-48 h-12" />
          </div>
          <ul class="menu bg-base-200 w-70 mt-0 h-[40px] flex items-center justify-center">
            <h2 class="menu-title font-light text-zinc-500 text-base">menu</h2>
          </ul>
          <div class="pr-2 pl-2">
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="toggleBigmotor"
            >
              <p class="text-base select-none text-zinc-600 ml-2">เครื่องจักที่รับผิดชอบ</p>
            </div>
            <div v-if="bigmotorOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in bigmotor"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="toggleFL"
            >
              <p class="text-base select-none text-zinc-600 ml-2">Fork-Lift</p>
            </div>
            <div v-if="FLOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in FL"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="toggleSermotor"
            >
              <p class="text-base select-none text-zinc-600 ml-2">รถยนต์บริการ</p>
            </div>
            <div v-if="SermotorOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in Sermotor"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              to="/admin/documentfile"
              class="flex items-center mb-3 mt-3 p-2 bg-base-100 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <p class="text-base select-none text-zinc-600 ml-2">รายการอะไหล่</p>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="togglecrument"
            >
              <p class="text-base select-none text-zinc-600 ml-2">
                ครุภัณฑ์และเครื่องมือเครื่องใช้
              </p>
            </div>
            <div v-if="crumentOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in crument"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="toggleOA"
            >
              <p class="text-base select-none text-zinc-600 ml-2">Oil Analysis</p>
            </div>
            <div v-if="OAOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in OA"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="togglebuy"
            >
              <p class="text-base select-none text-zinc-600 ml-2">งานเบิกซื้อ</p>
            </div>
            <div v-if="buyOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in buy"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
            <div
              class="flex items-center mt-3 p-2 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
              @click="togglehire"
            >
              <p class="text-base select-none text-zinc-600 ml-2">งานเบิกจ้าง</p>
            </div>
            <div v-if="hireOpen" class="mt-3">
              <ul>
                <li
                  v-for="item in hire"
                  :key="item"
                  class="flex items-center mt-2 p-1 bg-base-100 rounded-xl hover:bg-blue-300 transition-colors duration-200"
                >
                  <p class="text-base text-zinc-600 ml-2">{{ item }}</p>
                </li>
              </ul>
            </div>
          </div>
        </aside>
  
        <!-- Main Content -->
        <div class="flex-1 mx-auto w-full ml-60 overflow-x-hidden">
          <div class="flex-col">
            <div class="bg-yellow-300 w-full h-[96px] p-5">
              <p class="text-5xl font-bold">แผนก หบย-ช</p>
            </div>
  
            <div class="bg-green-200 w-full h-10 pt-2 pl-5">
              <div class="flex gap-2">
                <div>
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
                      d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.867 19.125h.008v.008h-.008v-.008Z"
                    />
                  </svg>
                </div>
                <p class="text-base">ไฟล์เอกสาร</p>
              </div>
            </div>
            <div class="p-4">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { LogoutIcon } from "@vue-hero-icons/outline";
  import { useAuthStore } from "#build/imports";
  
  const authStore = useAuthStore();
  
  const mobileNavOpen = ref(false);
  const bigmotorOpen = ref(false);
const FLOpen = ref(false);
const SermotorOpen = ref(false);
const crumentOpen = ref(false);
const OAOpen = ref(false);
const buyOpen = ref(false);
const hireOpen = ref(false);

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};
const toggleBigmotor = () => {
  bigmotorOpen.value = !bigmotorOpen.value;
};
const toggleFL = () => {
  FLOpen.value = !FLOpen.value;
};
const toggleSermotor = () => {
  SermotorOpen.value = !SermotorOpen.value;
};
const togglecrument = () => {
  crumentOpen.value = !crumentOpen.value;
};
const toggleOA = () => {
  OAOpen.value = !OAOpen.value;
};
const togglebuy = () => {
  buyrOpen.value = !buyOpen.value;
};
const togglehire = () => {
  hireOpen.value = !hireOpen.value;
};
const bigmotor = ref([
  "รถบรรทุกเทท้าย(BEML)",
  "รถเจาะ(Hole Digger)",
  "Foldable Truck Crane",
  "Moblie Crane",
  "Volvo(A25)",
  "Truck Tractor",
  "Trailer",
  "รถจักรยาน",
]);
const FL = ref([""]);
const Sermotor = ref([""]);
const crument = ref([
  "ครุภัณฑ์",
  "เครื่องมือเครื่องใช้ราคาสูงกว่า 10,000 บาท",
  "เครื่องมือเครื่องใช้ราคาต่ำกว่า 10,000 บาท",
]);
const OA = ref([""]);
const buy = ref(["PR", "PO"]);
const hire = ref(["PR", "PO"]);
  </script>
  
  <style scoped>
  * {
    font-family: "Kanit", sans-serif;
  }
  
  .text-stroke {
    text-shadow: -5px -1px 0 #ff8128, 1px -1px 0 #ff8128, -5px 1px 0 #ff8128,
      1px 1px 0 #ff8128;
  }
  </style>
  