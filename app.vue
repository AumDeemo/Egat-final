<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from '#build/imports';

const authStore = useAuthStore()

authStore.initializeAuth()
</script>
