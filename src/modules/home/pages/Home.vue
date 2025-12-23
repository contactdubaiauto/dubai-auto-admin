<template>
  <div class="flex p-10">
    <div class="text-2xl font-bold text-blue-500">{{ t('base.welcome') }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<style scoped></style>
