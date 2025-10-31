<template>
  <Dialog :visible="true" modal header="City" :style="{ width: '25rem' }" @update:visible="cancel">
    <div class="flex flex-col gap-1">
      <label for="city">City</label>
      <InputText v-model="form.name" id="city" :disabled="loading" />
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Save" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { Button, InputText, Dialog } from 'primevue'

  import type { ICityItem, ICityForm } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: ICityItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const form = reactive<ICityForm>({
    name: ''
  })

  if (props.item) {
    form.name = props.item.name
  }

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
