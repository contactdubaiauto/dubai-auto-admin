<template>
  <Dialog :visible="true" modal header="Parameter value" :style="{ width: '25rem' }" @update:visible="cancel">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>Name (en)</label>
        <InputText v-model="form.name" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-1">
        <label>Name (ru)</label>
        <InputText v-model="form.name_ru" :disabled="loading" />
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Save" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Button, InputText, Dialog } from 'primevue'

  import type { IParameterValueItem, IParameterValueForm, ICategory } from '../types'

  import { api } from '../api'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IParameterValueItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const form = reactive<IParameterValueForm>({
    name: '',
    name_ru: ''
  })

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
  }

  const categories = ref<ICategory[]>([])
  async function getCategories() {
    try {
      const data = await api.getCategories()
      categories.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getCategories()

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
