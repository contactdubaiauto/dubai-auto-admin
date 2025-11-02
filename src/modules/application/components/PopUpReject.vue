<template>
  <Dialog :visible="true" modal header="Reject message" @update:visible="cancel" :style="{ width: '25rem' }">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>Message</label>
        <Textarea v-model="message" :disabled="loading" />
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Save" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Textarea, Dialog } from 'primevue'

  const emit = defineEmits(['cancel', 'save'])

  withDefaults(
    defineProps<{
      loading?: boolean
    }>(),
    {
      loading: false
    }
  )

  const message = ref('')

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', message.value)
  }
</script>

<style scoped></style>
