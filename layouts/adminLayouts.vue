<template>
  <!-- แถบเมนู -->
  <div class="flex flex-col h-full select-none">
    <!-- Mobile Hamburger Menu Button -->
    <button
      class="sm:hidden btn btn-ghost btn-circle fixed top-4 left-4 z-50 p-2 text-black bg-zinc-300"
      @click="toggleMobileNav"
    >
      <!-- Hamburger Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        class="w-6 h-6 hamburger-icon"
        :class="{ 'rotate-90': mobileNavOpen, 'rotate-0': !mobileNavOpen }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Mobile Sidebar (Overlay) -->
    <div
      v-if="mobileNavOpen"
      ref="hamburgerMenuRef"
      class="fixed top-0 right-0 h-full w-[300px] bg-gray-800 bg-opacity-75 z-40 sm:hidden"
      @click="toggleMobileNav"
    >
      <transition name="slide-fade-left">
        <div
          class="absolute left-0 top-0 h-full w-full bg-white p-4 overflow-auto shadow-lg"
          @click.stop
        >
          <!-- Logo -->
          <img
            src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
            alt="EGAT-LOGO"
            class="w-36 mx-auto mb-4"
          />
          <!-- Mobile Menu -->
          <ul>
            <li v-for="menu in menus" :key="menu.name" class="mb-4">
              <div v-if="menu.items">
                <!-- เมนูหลัก -->
                <div
                  @click="toggleMenu(menu.name, menu.link)"
                  class="flex items-center justify-between cursor-pointer py-2 px-4 hover:bg-gray-300 rounded-lg"
                >
                  <span class="text-gray-700">{{ menu.name }}</span>
                  <!-- ไอคอนลูกศร -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :class="openMenu === menu.name ? 'rotate-180' : ''"
                    class="h-5 w-5 transition-transform"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <!-- เมนูย่อย -->
                <ul
                  v-if="openMenu === menu.name"
                  ref="menuRef"
                  class="hamburger-submenu bg-gray-50 shadow-md rounded-lg"
                >
                  <li v-for="item in menu.items" :key="item.name" class="mb-2">
                    <RouterLink
                      :to="item.link"
                      class="block py-2 px-4 text-gray-600 hover:bg-gray-200 rounded-lg"
                      @click.prevent="toggleMenu(item.name, item.link)"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
              <!-- เมนูปกติ (ไม่มีเมนูย่อย) -->
              <RouterLink
                v-else
                :to="menu.link"
                class="block py-2 px-4 text-gray-700 hover:bg-gray-300 rounded-lg"
                @click="toggleMenu(menu.name, menu.link)"
              >
                {{ menu.name }}
              </RouterLink>
            </li>
          </ul>
          <!-- Close Button -->
          <button class="text-gray-700 mt-4" @click="toggleMobileNav">ปิดเมนู</button>
        </div>
      </transition>
    </div>

    <div class="flex select-none overflow-y-hidden">
      <aside
        class="hidden sm:flex fixed w-60 bg-gradient-to-b from-zinc-600 to-zinc-700 h-screen flex-col"
      >
        <!-- Header -->
        <div class="egat-logo-container">
          <router-link to="/admin">
            <img
              src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
              alt="EGAT-LOGO"
              class="w-36 h-auto cursor-pointer"
            />
          </router-link>
        </div>

        <!-- Menu Title -->
        <ul
          class="menu bg-emerald-200 w-70 mt-0 h-[40px] flex items-center justify-center"
        >
          <h2
            class="menu-title font-light text-zinc-900 text-base text-center flex items-center justify-center w-full h-full"
          >
            ≡ menu
          </h2>
        </ul>

        <!-- เมนู หลัก -->
        <div class="pr-2 pl-2 flex-grow overflow-y-auto select-none" ref="desktopMenuRef">
          <div v-for="menu in menus" :key="menu.name" class="relative">
            <!-- ตรวจสอบว่ามี link -->
            <div
              v-if="menu.link"
              :class="
                'flex items-center mt-3 p-2 text-white rounded-xl cursor-pointer transition-colors duration-300 ' +
                (openMenu === menu.name
                  ? 'bg-teal-600 shadow-lg'
                  : 'bg-teal-500 hover:bg-teal-600')
              "
              @click="toggleMenu(menu.name, menu.link)"
            >
              <a
                :href="menu.link"
                class="block w-full h-full text-base text-white select-none ml-2 flex items-center"
              >
                {{ menu.name }}
              </a>
            </div>

            <!-- เมนูที่มีเมนูย่อย -->
            <div v-else>
              <div
                class="flex items-center mt-3 p-2 bg-teal-500 text-white rounded-xl cursor-pointer transition-colors duration-300 hover:bg-teal-600"
                @click="toggleMenu(menu.name, menu.link)"
              >
                <p class="text-base select-none ml-2">{{ menu.name }}</p>
                <span class="ml-auto mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    :class="openMenu === menu.name ? 'rotate-180' : ''"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </span>
              </div>
              <!-- เมนูย่อย -->
              <div
                v-if="openMenu === menu.name"
                :class="[
                  'absolute left-0 z-10 mt-1 w-full p-4 bg-white border border-gray-300 rounded-xl shadow-md',
                  'menu-sub',
                  openMenu === menu.name ? 'menu-sub-active' : '',
                ]"
              >
                <ul>
                  <li
                    v-for="item in menu.items"
                    :key="item"
                    class="flex items-center mt-2 p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-teal-200 transition duration-300"
                  >
                    <RouterLink
                      :to="item.link"
                      class="block w-full h-full text-base ml-2"
                      @click="toggleMenu(item.name, item.link)"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มออกจากระบบ -->
        <div
          @click="logoutAndRedirect"
          class="logout-button bg-red-400 h-12 cursor-pointer flex justify-center items-center select-none mt-auto"
        >
          <div class="flex gap-2 justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#ffffff"
              class="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <p class="text-white text-base">ออกจากระบบ</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 mx-auto w-full sm:ml-60 overflow-x-auto overflow-y-hidden select-none"
      >
        <div
          class="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 w-full h-[96px] p-5 shadow-lg flex items-center justify-center"
        >
          <p class="text-5xl font-extrabold text-gray-800 tracking-wider">
            แผนก <span class="text-orange-600">หบย-ช</span>
          </p>
        </div>

        <!-- title bar -->
        <div
          class="bg-lime-200 w-full h-10 shadow-md rounded-lg flex justify-center items-center"
        >
          <div class="flex items-center gap-2">
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
                d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
              />
            </svg>
            <p class="text-lg font-semibold text-gray-900 tracking-wider">
              {{ selectedMenu }}
            </p>
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
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
        <!-- ตาราง -->
        <div class="p-4 overflow-x-auto h-[calc(100vh-160px)]">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LogoutIcon } from "@vue-hero-icons/outline";
import { useAuthStore } from "#build/imports";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// ตัวแปรจัดการเมนู
const openMenu = ref(null);
const openMobileMenu = ref(null); // เปิด/ปิด Hamburger Submenu
const mobileNavOpen = ref(false); // ควบคุมการเปิด/ปิด Hamburger Menu
const hamburgerMenuRef = ref(null); // สำหรับ Hamburger Menu
const desktopMenuRef = ref(null); // สำหรับเมนูย่อยหน้าจอปกติ

// ตัวแปรจัดการชื่อเมนูที่กด
const selectedMenu = ref("รายการอะไหล่");

const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

// ฟังก์ชันเปิด/ปิดเมนู และอัปเดตชื่อเมนู
const toggleMenu = (menuName, link) => {
  if (link) {
    // เปลี่ยนเส้นทางเมื่อมีลิงก์
    router.push(link).catch((err) => {
      console.error("Navigation Error:", err);
    });
    mobileNavOpen.value = false; // ปิด Hamburger Menu เมื่อเลือกเมนู
  } else {
    // เปิด/ปิดเมนูย่อย
    openMenu.value = openMenu.value === menuName ? null : menuName;
  }
};
// ฟังก์ชันปิดเมนูย่อยใน Hamburger Menu เมื่อคลิกนอกพื้นที่
const handleClickOutsideSubMenu = (event) => {
  const isClickOutsideHamburgerMenu =
    hamburgerMenuRef.value && !hamburgerMenuRef.value.contains(event.target);
  if (isClickOutsideHamburgerMenu) {
    openMenu.value = null; // ปิดเมนูย่อย
  }
};
// ฟังก์ชันปิดเมนูย่อยหน้าจอปกติเมื่อคลิกนอกพื้นที่
const handleClickOutsideDesktop = (event) => {
  if (desktopMenuRef.value && !desktopMenuRef.value.contains(event.target)) {
    openMenu.value = null;
  }
};

// เพิ่ม Event Listener เมื่อ Component ถูก Mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideSubMenu);
  window.addEventListener("click", handleClickOutsideDesktop);
});

// ลบ Event Listener เมื่อ Component ถูก Unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideSubMenu);
  window.removeEventListener("click", handleClickOutsideDesktop);
});

// ฟังก์ชันเปิด/ปิดเมนูย่อยสำหรับ Hamburger Menu
const toggleMobileMenu = (menuName) => {
  openMobileMenu.value = openMobileMenu.value === menuName ? null : menuName;
};

const authStore = useAuthStore();

const activeSubMenu = ref(null);

const setActiveSubMenu = (menuName) => {
  activeSubMenu.value = menuName;
};

// เมนูทั้งหมด
const menus = ref([
  {
    name: "📊 ภาพรวมระบบ",
    link: "/admin",
  },
  {
    name: "⚙️ รายการอะไหล่",
    link: "/admin/sparepartslist",
  },
  /*{
    name: "เครื่องจักรที่รับผิดชอบ",
    link: "/admin/usingmotor",
  },*/
  /*{
    name: "Fork-Lift",
    link: "/admin/forklift",
  },*/
  {
    name: "📦 ครุภัณฑ์/เครื่องมือ",
    items: [
      { name: " ครุภัณฑ์", link: "/admin/crument/curu" },
      { name: " เครื่องมือเครื่องใช้", link: "/admin/crument/using" },
      {
        name: " เครื่องมือเครื่องใช้ < 10K",
        link: "/admin/crument/using10000",
      },
    ],
  },
  /*{
    name: "Oil Analysis",
    link: "/admin/oilanalysis",
  },*/
  /*{
    name: "งานเบิกซื้อ/จ้าง",
    items: [
      { name: "งานเบิกซื้อ", link: "/admin/buy" },
      { name: "งานเบิกจ้าง", link: "/admin/hire" },
    ],
  },*/
  /*{
    name: "งานเบิกซื้อ",
    link: "/admin/buy",
  },*/
  /*{
    name: "งานเบิกจ้าง",
    link: "/admin/hire",
  },*/
]);

// ใช้ Watch เพื่อติดตามการเปลี่ยนแปลงของเส้นทาง
watch(
  () => route.path,
  (newPath) => {
    // ตรวจสอบเมนูย่อยก่อน
    for (const menu of menus.value) {
      if (menu.items) {
        const matchedSubMenu = menu.items.find((item) => item.link === newPath);
        if (matchedSubMenu) {
          selectedMenu.value = matchedSubMenu.name;
          return; // ถ้าพบเมนูย่อยแล้ว หยุดการทำงาน
        }
      }
    }

    // ถ้าไม่พบในเมนูย่อย ให้ตรวจสอบเมนูหลัก
    const matchedMenu = menus.value.find((menu) => menu.link === newPath);
    if (matchedMenu) {
      selectedMenu.value = matchedMenu.name;
    }
  },
  { immediate: true }
);
const isModalOpen = ref(false);
const notifications = ref([
  { id: 1, message: "New message from admin." },
  { id: 2, message: "System maintenance scheduled." },
  { id: 3, message: "New updates available." },
]);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const logoutAndRedirect = async () => {
  try {
    await authStore.logout(); // ล็อกเอาต์
    router.push("/login"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f9fafb; /* สีพื้นหลัง */
}
* {
  font-family: "Kanit", sans-serif;
}

/* Sidebar Scroll */
.pr-2.pl-2 {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
.pr-2.pl-2::-webkit-scrollbar {
  width: 8px;
}
.pr-2.pl-2::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 8px;
}
.pr-2.pl-2::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}

/* Logout Button */
.logout-button {
  background-color: #ef4444; /* สีแดงเริ่มต้น */
  color: white;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.logout-button:hover {
  background-color: #dc2626; /* สีแดงเข้มขึ้น */
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
.logout-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Submenu */
.menu-sub {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  max-height: 210px;
  overflow-y: auto;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
}
.menu-sub-active {
  opacity: 1;
  transform: translateY(0);
}

/* Menu Item */
li {
  transition: all 0.3s ease-in-out;
  border-radius: 6px;
  padding: 8px;
}
li:hover {
  transform: translateX(5px);
  color: #3b82f6;
  background-color: #e0f2fe; /* พื้นหลังอ่อน */
  font-weight: bold;
}

/* Hamburger Menu Overlay */
.fixed.h-full {
  width: 75%; /* ปรับความกว้างเป็น 75% หรือใช้ px เช่น 300px */
  max-width: 300px;
  right: auto; /* ย้ายเมนูไปด้านขวา */
  left: 0;
  border-left: 2px solid rgba(0, 0, 0, 0.1); /* เพิ่มขอบเมนู */
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
  animation: fadeInLeft 0.3s ease-in-out;
}
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
/* Hamburger Menu Submenu */
.hamburger-submenu {
  margin-top: 8px;
  padding: 8px;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hamburger-submenu li {
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.3s ease-in-out;
}
.hamburger-submenu li:hover {
  background-color: #e0f2fe;
}

/* Hamburger Icon */
.hamburger-icon {
  display: inline-block;
  cursor: pointer;
  color: #3b82f6; /* สีเริ่มต้น */
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out;
}
.hamburger-icon:hover {
  color: #2563eb; /* สีฟ้าเข้ม */
  transform: scale(1.1);
}
.hamburger-icon:active {
  color: #1d4ed8;
  transform: scale(0.9);
}

/* Rotation for Hamburger */
.rotate-90 {
  transform: rotate(90deg);
}
.rotate-0 {
  transform: rotate(0deg);
}

/* General Shadow */
.shadow-md {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.shadow-lg {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Header */
.header {
  background: linear-gradient(90deg, #f59e0b, #fbbf24, #fde047);
  color: #1f2937;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
}

/* Menu Title */
.menu-title {
  font-size: 1.25rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #2563eb;
  text-align: center;
  padding: 0; /* ลบ padding เพื่อให้การจัดตำแหน่งทำงานได้แม่นยำ */
  margin: 0; /* ลบ margin เพื่อจัดข้อความให้ตรงกลาง */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* ใช้ความสูงเต็มพื้นที่ของ container */
  line-height: normal; /* ปรับ line-height เพื่อไม่ให้ข้อความดูอัดแน่น */
}
.egat-logo-container {
  height: 6rem; /* ความสูงของกล่อง */
  background: radial-gradient(ellipse, #e5e6dc, #25ebdb); /* ไล่สีพื้นหลัง */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* เพิ่มเงา */
  padding: 10px;
}

.egat-logo-container img {
  width: 9rem; /* ปรับขนาดโลโก้ */
  height: auto;
  border-radius: 10px; /* ขอบโค้งมน */
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.egat-logo-container img:hover {
  transform: scale(1.1); /* ขยายเล็กน้อยเมื่อ Hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* เพิ่มเงาเมื่อ Hover */
}

.egat-logo-container img:active {
  transform: scale(0.95); /* ลดขนาดเล็กน้อยเมื่อกด */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}
/* Notification */
.notification {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #3b82f6; /* สีฟ้า */
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s ease-in-out;
}
.notification button {
  background: none;
  border: none;
  color: inherit;
  font-weight: bold;
  cursor: pointer;
}
.notification button:hover {
  color: #f3f4f6;
}
/* Slide and Fade Effect from Left */
.slide-fade-left-enter-active,
.slide-fade-left-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-fade-left-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}
.slide-fade-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-fade-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Smooth Transition for Menu Items */
.hamburger-submenu li {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.hamburger-submenu li:hover {
  transform: translateY(0);
  opacity: 1;
  background-color: #e0f2fe; /* เปลี่ยนสีพื้นหลัง */
}
.hamburger-submenu li:nth-child(1) {
  transition-delay: 0.1s;
}
.hamburger-submenu li:nth-child(2) {
  transition-delay: 0.2s;
}
.hamburger-submenu li:nth-child(3) {
  transition-delay: 0.3s;
}
</style>
//adminLayout//VV//13:22//
