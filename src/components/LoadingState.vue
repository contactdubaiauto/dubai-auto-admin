<template>
  <div class="flex flex-col items-center gap-4 p-10 w-full bg-white">
    <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
    <div class="text-center text-gray-700">{{ t('base.loading') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  withDefaults(
    defineProps<{
      loading?: boolean
    }>(),
    {
      loading: false
    }
  )
</script>
