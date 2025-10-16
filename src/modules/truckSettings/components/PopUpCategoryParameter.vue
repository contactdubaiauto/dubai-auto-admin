<template>
  <Dialog :visible="true" modal header="Category parameter" :style="{ width: '25rem' }" @update:visible="cancel">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label>Parameter</label>
        <Select
          v-model="form.comtrans_parameter_id"
          :options="parameters"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a parameter"
          :disabled="loading"
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
  import { Button, Select, Dialog } from 'primevue'

  import type { ICategoryParameterItem, ICategoryParameterForm, IParameter } from '../types'

  import { api } from '../api'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: ICategoryParameterItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const form = reactive<ICategoryParameterForm>({
    comtrans_parameter_id: 0
  })

  if (props.item) {
    form.comtrans_parameter_id = props.item.comtrans_parameter_id
  }

  const parameters = ref<IParameter[]>([])
  async function getParameters() {
    try {
      const data = await api.getParameters()
      parameters.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getParameters()

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
