<template>
  <Dialog :visible="true" modal :header="title" :style="{ width: '20rem' }">
    <div class="flex mb-4">
      <div class="flex items-center gap-2">
        <i class="pi pi-info-circle text-xl text-gray-500"></i>
        <div class="text-lg">{{ description }}</div>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Delete" severity="danger" :loading="loading" @click="confirm"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { Button, Dialog } from 'primevue'

  const emit = defineEmits(['cancel', 'delete'])

  withDefaults(
    defineProps<{
      title?: string
      description?: string
      loading?: boolean
    }>(),
    {
      title: 'Confirm delete',
      description: '',
      loading: false
    }
  )

  function cancel() {
    emit('cancel')
  }
  function confirm() {
    emit('delete')
  }
</script>

<style scoped></style>
