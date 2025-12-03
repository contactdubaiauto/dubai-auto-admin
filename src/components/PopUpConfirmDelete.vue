<template>
  <Dialog :visible="true" modal :header="titleText" :style="{ width: '24rem' }" @update:visible="cancel">
    <div class="flex mb-4">
      <div class="flex flex-col justify-center items-center gap-2 w-full">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
        <div class="text-lg text-center">{{ description }}</div>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
      <Button type="button" :label="t('base.delete')" severity="danger" :loading="loading" @click="confirm"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { Button, Dialog } from 'primevue'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['cancel', 'delete'])

  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      title?: string
      description?: string
      loading?: boolean
    }>(),
    {
      title: '',
      description: '',
      loading: false
    }
  )
  const titleText = computed(() => props.title || t('base.confirmDelete'))

  function cancel() {
    emit('cancel')
  }
  function confirm() {
    emit('delete')
  }
</script>

<style scoped></style>
