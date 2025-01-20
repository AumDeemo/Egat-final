<template>
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
      class="fixed top-0 left-0 h-full w-[300px] bg-gray-900 bg-opacity-90 z-40 sm:hidden"
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
                  @click.stop="toggleMenu(menu.name)"
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
                  class="hamburger-submenu bg-gray-50 shadow-md rounded-lg mt-2"
                >
                  <li v-for="item in menu.items" :key="item.name" class="mb-2">
                    <RouterLink
                      :to="item.link"
                      class="block py-2 px-4 text-gray-600 hover:bg-gray-200 rounded-lg"
                      @click="setActiveMenu(item.name)"
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

    <div class="flex select-none">
      <!-- Sidebar -->
      <aside
        class="hidden sm:flex fixed w-60 bg-gradient-to-b from-zinc-600 to-zinc-700 h-screen flex-col"
      >
        <!-- Header -->
        <div class="egat-logo-container">
          <router-link to="/users">
            <img
              src="https://www.egat.co.th/home/wp-content/uploads/2021/07/LogoEGAT-TH.png"
              alt="EGAT-LOGO"
              class="w-36 h-auto"
            />
          </router-link>
        </div>
        <!-- Menu Title -->
        <ul class="menu bg-lime-200 w-70 mt-0 h-[40px] flex items-center justify-center">
          <h2 class="menu-title font-light text-zinc-900 text-base">≡ menu</h2>
        </ul>

        <!-- เมนู -->
        <div class="pr-2 pl-2 select-none" ref="desktopMenuRef">
          <div v-for="menu in menus" :key="menu.name" class="relative">
            <!-- ตรวจสอบว่ามี link -->
            <div
              v-if="menu.link"
              :class="
                'flex items-center mt-3 p-2 text-white rounded-xl cursor-pointer hover:bg-orange-600 transition-colors duration-200 ' +
                (openMenu === menu.name ? 'bg-orange-600' : 'bg-orange-500')
              "
              @click="setActiveMenu(menu.name)"
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
                class="flex items-center mt-3 p-2 bg-orange-500 text-white rounded-xl cursor-pointer hover:bg-orange-600 transition-colors duration-200"
                @click="toggleMenu(menu.name)"
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
                    :class="[
                      'flex items-center mt-2 p-2 rounded-xl cursor-pointer transition duration-300',
                      activeSubMenu === item
                        ? 'bg-sky-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-300',
                    ]"
                  >
                    <RouterLink
                      :to="item.link"
                      class="block w-full h-full text-base ml-2"
                      @click="setActiveSubMenu(item.name)"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- ปุ่มล็อคอิน -->
        <div
          class="login-button bg-green-500 h-12 cursor-pointer flex justify-center items-center select-none mt-auto"
          @click="redirectToLogin"
        >
          <div class="flex gap-2 justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="white"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <p class="text-white text-base">ล็อคอินเพื่อจัดการข้อมูล</p>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 mx-auto w-full sm:ml-60 overflow-x-auto overflow-y-hidden select-none"
      >
        <div
          class="bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 w-full h-[96px] p-5 shadow-lg flex items-center justify-center"
        >
          <p class="text-5xl font-extrabold text-gray-800 tracking-wider">
            แผนก <span class="text-orange-600">หบย-ช</span>
          </p>
        </div>
        <!-- title bar -->
        <div class="bg-teal-200 w-full h-10 flex justify-center items-center">
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
            <!-- แสดงชื่อเมนูที่เลือก -->
            <p class="text-lg font-semibold text-gray-900 tracking-wider">
              {{ activeMenu }}
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

            <!-- แสดงชื่อเมนูที่เลือก -->
          </div>
        </div>
        <!-- ตาราง-->
        <div class="p-4 overflow-x-auto overflow-y-hidden h-[calc(100vh-160px)]">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// ตัวแปรสำหรับจัดการเมนู
const openMenu = ref(null); // เมนูที่เปิด
const mobileNavOpen = ref(false); // ควบคุมการเปิด/ปิดเมนู Hamburger
const activeSubMenu = ref(null); // เมนูย่อยที่กำลังแสดง
const activeMenu = ref("รายการอะไหล่"); // เมนูที่เลือกไว้เริ่มต้น
const hamburgerMenuRef = ref(null); // อ้างอิงถึงเมนู Hamburger
const desktopMenuRef = ref(null); // อ้างอิงถึงเมนูบนเดสก์ท็อป

// รายการเมนูสำหรับผู้ใช้
const menus = ref([
  {
    name: "🏠 หน้าแรก",
    link: "/users",
  },
  {
    name: "⚙️ รายการอะไหล่",
    link: "/users/sparepartslist",
  },
  /*{
    name: "เครื่องจักรที่รับผิดชอบ",
    items: [
      { name: "รถบรรทุกเทท้าย(BEML)", link: "/users/usingmotor/BEML" },
      { name: "Hole Digger", link: "/users/usingmotor/HoleDigger" },
      { name: "Foldable Truck Crane", link: "/users/usingmotor/FoldableTruckCrane" },
      { name: "Mobile Crane", link: "/users/usingmotor/MobileCrane" },
      { name: "Volvo(A25)", link: "/users/usingmotor/VolvoA25" },
      { name: "Trailer", link: "/users/usingmotor/Trailer" },
      { name: "รถจักรยาน", link: "/users/usingmotor/Bikemotor" },
    ],
  },*/
  /*{
    name: "Fork-Lift",
    items: [
      { name: "Fork-Lift A", link: "/users/forklift/a" },
      { name: "Fork-Lift B", link: "/users/forklift/b" },
    ],
  },*/
  /*{
    name: "รถยนต์บริการ",
    items: [
      { name: "Toyota", link: "/users/servicemotor/toyota" },
      { name: "Honda", link: "/users/servicemotor/honda" },
      { name: "Isuzu", link: "/users/servicemotor/isuzu" },
    ],
  },*/
  {
    name: "📦 ครุภัณฑ์/เครื่องมือ",
    items: [
      { name: "ครุภัณฑ์", link: "/users/crument/curu" },
      { name: "เครื่องมือเครื่องใช้", link: "/users/crument/using" },
      {
        name: "เครื่องมือเครื่องใช้ < 10K",
        link: "/users/crument/using10000",
      },
    ],
  },
  /*{
    name: "งานเบิกซื้อ/จ้าง",
    items: [
      { name: "งานเบิกซื้อ", link: "/users/buy" },
      { name: "งานเบิกจ้าง", link: "/users/hire" },
    ],
  },*/
  /*{
    name: "Oil Analysis",
    link: "/users/oilanalysis",
  },*/
  /*{
    name: "งานเบิกซื้อ",
    link: "/users/buy",
  },*/
  /*{
    name: "งานเบิกจ้าง",
    link: "/users/hire",
  },*/
]);

// ฟังก์ชันสำหรับตั้งค่าเมนูที่ใช้งานอยู่
const setActiveMenu = (menuName) => {
  activeMenu.value = menuName;
};

// ฟังก์ชันเปิด/ปิดเมนู
const toggleMenu = (menuName) => {
  openMenu.value = openMenu.value === menuName ? null : menuName;
};

// ฟังก์ชันตั้งค่าซับเมนูที่ใช้งานอยู่
const setActiveSubMenu = (menuName) => {
  activeSubMenu.value = menuName;
};

// ฟังก์ชันเปิด/ปิดเมนู Hamburger
const toggleMobileNav = () => {
  mobileNavOpen.value = !mobileNavOpen.value;
};

// ฟังก์ชันปิดเมนู Hamburger เมื่อคลิกนอกพื้นที่
const handleClickOutsideHamburger = (event) => {
  if (hamburgerMenuRef.value && !hamburgerMenuRef.value.contains(event.target)) {
    openMenu.value = null;
  }
};

// ฟังก์ชันปิดเมนูบนเดสก์ท็อปเมื่อคลิกนอกพื้นที่
const handleClickOutsideDesktop = (event) => {
  if (desktopMenuRef.value && !desktopMenuRef.value.contains(event.target)) {
    openMenu.value = null;
  }
};

// ฟังก์ชันเปลี่ยนไปยังหน้า Login
const redirectToLogin = () => {
  router.push("/login"); // เปลี่ยนเส้นทางไปยังหน้า Login
};

// เพิ่ม Event Listener เมื่อ Component ถูก Mounted
onMounted(() => {
  window.addEventListener("click", handleClickOutsideHamburger);
  window.addEventListener("click", handleClickOutsideDesktop);
});

// ลบ Event Listener เมื่อ Component ถูก Unmounted
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutsideHamburger);
  window.removeEventListener("click", handleClickOutsideDesktop);
});

// Watch สำหรับติดตามการเปลี่ยนแปลงของเส้นทาง
watch(
  () => route.path,
  (newPath) => {
    // ค้นหาเมนูที่ตรงกับเส้นทางปัจจุบัน
    let matchedMenu = null;

    // ค้นหาในเมนูหลัก
    matchedMenu = menus.value.find((menu) => menu.link === newPath);

    // ค้นหาในเมนูย่อยถ้าไม่พบในเมนูหลัก
    if (!matchedMenu) {
      menus.value.forEach((menu) => {
        if (menu.items) {
          const subMenu = menu.items.find((item) => item.link === newPath);
          if (subMenu) {
            matchedMenu = subMenu;
          }
        }
      });
    }

    // ตั้งค่าเมนูที่เลือกหากพบเมนูที่ตรงกัน
    if (matchedMenu) {
      activeMenu.value = matchedMenu.name;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
* {
  font-family: "Kanit", sans-serif;
}

.text-stroke {
  text-shadow: -5px -1px 0 #ff8128, 1px -1px 0 #ff8128, -5px 1px 0 #ff8128,
    1px 1px 0 #ff8128;
}
li {
  transition: all 0.3s ease-in-out;
}

li:hover {
  transform: translateX(5px);
}
/* สำหรับเมนูย่อย */
.menu-sub {
  opacity: 0;
  transform: translateY(-20px); /* เลื่อนขึ้นเล็กน้อย */
  transition: opacity 0.7s ease-in-out, transform 0.7s ease-in-out; /* เอฟเฟกต์ช้า */
  max-height: 210px; /* กำหนดความสูงสูงสุดของเมนูย่อย */
  overflow-y: auto; /* เปิดการเลื่อนในแกน Y */
  border-radius: 8px; /* ปรับมุมให้โค้ง */
  padding: 8px; /* เพิ่มระยะห่างในเมนูย่อย */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* เพิ่มเงา */

  /* ซ่อน scrollbar */
  scrollbar-width: none; /* สำหรับ Firefox */
  -ms-overflow-style: none; /* สำหรับ Internet Explorer */
}
.menu-sub::-webkit-scrollbar {
  display: none; /* สำหรับ Chrome, Safari และ Edge */
}

/* เมื่อเมนูย่อยเปิด */
.menu-sub-active {
  opacity: 1;
  transform: translateY(0);
}
.submenu {
  position: absolute;
  left: 0;
  top: 100%; /* อยู่ด้านล่างของเมนูหลัก */
  background-color: white;
  z-index: 50;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  min-width: 100%;
  opacity: 1;
  transform: none;
  transition: none; /* ปิดเอฟเฟกต์การเปลี่ยนแปลง */
}
.hamburger-icon {
  display: inline-block;
  cursor: pointer;
  color: #1e40af; /* สีเริ่มต้น: น้ำเงินเข้ม (ตามธีมเว็บ) */
  transition: transform 0.3s ease-in-out, color 0.3s ease-in-out,
    transform 0.3s ease-in-out 0.1s; /* เพิ่ม delay ที่นี่ */
}

.hamburger-icon:hover {
  color: #f97316; /* สีส้มอ่อนเมื่อ Hover */
  transform: scale(1.1); /* ขยายเล็กน้อย */
}

.hamburger-icon:active {
  color: #ea580c; /* สีส้มเข้มเมื่อกด */
  transform: scale(0.9); /* หดเล็กน้อย */
}
.rotate-90 {
  transform: rotate(90deg);
}

.rotate-0 {
  transform: rotate(0deg);
}
.mobile-menu-overlay {
  opacity: 0;
  transform: translateY(-10%);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.mobile-menu-active {
  opacity: 1;
  transform: translateY(0);
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
  background: radial-gradient(ellipse, #e5e6dc, #ebd725); /* ไล่สีพื้นหลัง */
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
//userlayout//v1
