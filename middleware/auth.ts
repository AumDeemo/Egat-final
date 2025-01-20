export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    authStore.initializeAuth();

    if (authStore.isAuthenticated !== true) {
        return navigateTo('/login');
    }

});
