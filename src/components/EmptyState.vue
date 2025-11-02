<template>
  <div class="flex flex-col items-center gap-4 p-10 w-full bg-white">
    <i class="pi pi-inbox text-[40px] text-gray-400"></i>
    <div class="text-center text-gray-700">{{ t('base.noData') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>
