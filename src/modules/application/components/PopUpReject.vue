<template>
  <Dialog
    :visible="true"
    modal
    :header="t('applications.rejectMessage')"
    @update:visible="cancel"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>{{ t('applications.message') }}</label>
        <Textarea v-model="message" :disabled="loading" />
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
      <Button type="button" :label="t('applications.send')" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Textarea, Dialog } from 'primevue'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['cancel', 'save'])

  withDefaults(
    defineProps<{
      loading?: boolean
    }>(),
    {
      loading: false
    }
  )

  const { t } = useI18n()

  const message = ref('')

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', message.value)
  }
</script>

<style scoped></style>
