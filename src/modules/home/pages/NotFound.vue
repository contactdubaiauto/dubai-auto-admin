<template>
  <div class="flex items-center justify-center h-screen bg-gray-50">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600">404</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mt-4">{{ t('base.pageNotFound') }}</h2>
      <p class="text-gray-600 mt-2">{{ t('base.pageNotFoundDescription') }}</p>
      <Button @click="goHome" :label="t('base.backToHome')" icon="pi pi-home" class="mt-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Button } from 'primevue'

  const router = useRouter()
  const { t } = useI18n()

  function goHome() {
    router.push('/')
  }
</script>

<style scoped></style>
