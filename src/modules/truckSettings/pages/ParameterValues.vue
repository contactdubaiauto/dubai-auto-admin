<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpParameterValue" icon="pi pi-plus" label="Add parameter value" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="parameterValues" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectParameterValue(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
              />
              <Button
                @click.stop="selectDeleteParameterValue(slotProps.data)"
                icon="pi pi-trash"
                severity="danger"
                rounded
                variant="outlined"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <PopUpParameterValue
    v-if="showPopUpParameterValue"
    @save="saveParameterValue"
    @cancel="closePopUpParameterValue"
    :loading="loadingPopUpParameterValue"
    :item="selectedParameterValue"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteParameterValue"
    @delete="deleteParameterValue"
    @cancel="closePopUpDeleteParameterValue"
    :loading="loadingPopUpDeleteParameterValue"
    description="Confirm delete parameter value!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpParameterValue from '../components/PopUpParameterValue.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IParameterValue, IParameterValueForm, IParameterValueItem } from '../types'

  const {
    showPopUp: showPopUpParameterValue,
    openPopUp: openPopUpParameterValue,
    loading: loadingPopUpParameterValue
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteParameterValue,
    openPopUp: openPopUpDeleteParameterValue,
    closePopUp: closePopUpDeleteParameterValue,
    loading: loadingPopUpDeleteParameterValue
  } = usePopUp()

  const route = useRoute()

  const parameterId = route.params.parameter as string

  const parameterValues = ref<IParameterValue[]>([])

  onMounted(() => {
    getParameterValues()
  })

  const selectedParameterValue = ref<IParameterValueItem | null>(null)
  function selectParameterValue(item: IParameterValueItem) {
    selectedParameterValue.value = item
    openPopUpParameterValue()
  }
  function closePopUpParameterValue() {
    selectedParameterValue.value = null
    showPopUpParameterValue.value = false
  }

  async function getParameterValues() {
    try {
      const data: IParameterValue[] = await api.getParameterValues({ parameterId: parameterId })

      parameterValues.value = data.map((parameterValue: IParameterValue, index: number): IParameterValueItem => {
        return {
          index: index + 1,
          ...parameterValue
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveParameterValue(form: IParameterValueForm) {
    try {
      loadingPopUpParameterValue.value = true
      if (selectedParameterValue.value) {
        await api.updateParameterValue({ parameterId: parameterId, id: selectedParameterValue.value.id, data: form })
      } else {
        await api.createParameterValue({ parameterId: parameterId, data: form })
      }
      await getParameterValues()
      closePopUpParameterValue()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpParameterValue.value = false
    }
  }

  const selectedDeleteParameterValue = ref<IParameterValueItem>()
  function selectDeleteParameterValue(item: IParameterValueItem) {
    selectedDeleteParameterValue.value = item
    openPopUpDeleteParameterValue()
  }

  async function deleteParameterValue() {
    try {
      loadingPopUpDeleteParameterValue.value = true
      if (selectedDeleteParameterValue.value) {
        await api.deleteParameterValue({ parameterId: parameterId, id: selectedDeleteParameterValue.value.id })
      }
      await getParameterValues()
      closePopUpDeleteParameterValue()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteParameterValue.value = false
    }
  }
</script>
