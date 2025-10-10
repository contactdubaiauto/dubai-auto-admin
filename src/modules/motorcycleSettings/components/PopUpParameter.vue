<template>
  <Dialog :visible="true" modal header="Parameter" :style="{ width: '25rem' }" @update:visible="cancel">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label>Parameter name</label>
        <InputText v-model="form.name" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-1 col-span-2">
        <label>Category</label>
        <CascadeSelect
          v-model="form.moto_category_id"
          placeholder="Select a category"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          data-key="id"
          optionGroupChildren="children"
        />
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
  import { Button, InputText, Dialog, CascadeSelect } from 'primevue'

  import type { IParameterItem, IParameterForm, ICategory } from '../types'

  import { api } from '../api'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IParameterItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const form = reactive<IParameterForm>({
    name: '',
    moto_category_id: 0
  })

  if (props.item) {
    form.name = props.item.name
    form.moto_category_id = props.item.moto_category_id
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
