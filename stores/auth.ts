//stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'

export const useAuthStore = defineStore('auth', () => {
    const isAuthenticated = ref(false);
    const user = ref({
        id: null,
        email: '',
        fullname: '',
        phoneNumber: '',
        role: '',
    });

    const router = useRouter();

    const initializeAuth = () => {
        localStorage.setItem('role', 'users');
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (savedUser && token) {
                localStorage.setItem('role', 'admin')
                isAuthenticated.value = true;
                user.value = JSON.parse(savedUser);
            }
        }
    };

    const login = (userData) => {
        isAuthenticated.value = true;
        user.value = {
            id: userData.user.id,
            email: userData.user.email,
            fullname: userData.user.fullname,
            phoneNumber: userData.user.phoneNumber,
            role: userData.user.role,
        };

        if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user.value));
            localStorage.setItem('token', userData.token);
            localStorage.setItem('role', 'admin');
        }

        if (userData.user.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/admin/sparepartslist');
        }
    };

    const logout = async () => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: 'คุณต้องการออกจากระบบหรือไม่',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
        });

        if (result.isConfirmed) {
            isAuthenticated.value = false;
            user.value = {
                id: null,
                email: '',
                fullname: '',
                phoneNumber: '',
                role: '',
            };

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('role');
            }

            router.push('/users');

            await Swal.fire('ออกจากระบบสำเร็จ', 'คุณได้ออกจากระบบเรียบร้อยแล้ว', 'success')
        }
    };

    const isAdmin = computed(() => user.value?.role === 'admin');

    onMounted(() => {
        initializeAuth();
    });

    return {
        isAuthenticated,
        user,
        login,
        logout,
        initializeAuth,
        isAdmin,
    };
});