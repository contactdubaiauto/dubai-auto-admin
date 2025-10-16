<template>
  <Dialog :visible="true" modal header="Fuel type" @update:visible="cancel" :style="{ width: '25rem' }">
    <div class="flex flex-col gap-1">
      <label>Fuel type name</label>
      <InputText v-model="form.name" :disabled="loading" />
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

  import type { IFuelTypeForm, IFuelTypeItem } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IFuelTypeItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const form = reactive<IFuelTypeForm>({
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
