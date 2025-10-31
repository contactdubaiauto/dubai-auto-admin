<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpActivityField" icon="pi pi-plus" label="Add activity field" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="cities" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectActivityField(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteActivityField(slotProps.data)"
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
  <PopUpActivityField
    v-if="showPopUpActivityField"
    @save="saveActivityField"
    @cancel="closePopUpActivityField"
    :loading="loadingPopUpActivityField"
    :item="selectedActivityField"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteActivityField"
    @delete="deleteActivityField"
    @cancel="closePopUpDeleteActivityField"
    :loading="loadingPopUpDeleteActivityField"
    description="Confirm delete activity field!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpActivityField from '../components/PopUpActivityField.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IActivityField, IActivityFieldForm, IActivityFieldItem } from '../types'

  const { showPopUp: showPopUpActivityField, openPopUp: openPopUpActivityField, loading: loadingPopUpActivityField } = usePopUp()
  const {
    showPopUp: showPopUpDeleteActivityField,
    openPopUp: openPopUpDeleteActivityField,
    closePopUp: closePopUpDeleteActivityField,
    loading: loadingPopUpDeleteActivityField
  } = usePopUp()


  const cities = ref<IActivityField[]>([])

  onMounted(() => {
    getActivityFields()
  })

  const selectedActivityField = ref<IActivityFieldItem | null>(null)
  function selectActivityField(item: IActivityFieldItem) {
    selectedActivityField.value = item
    openPopUpActivityField()
  }
  function closePopUpActivityField() {
    selectedActivityField.value = null
    showPopUpActivityField.value = false
  }

  async function getActivityFields() {
    try {
      const data: IActivityField[] = await api.getActivityFields()

      cities.value = data.map((activityField: IActivityField, index: number): IActivityFieldItem => {
        return {
          index: index + 1,
          ...activityField
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveActivityField(form: IActivityFieldForm) {
    try {
      loadingPopUpActivityField.value = true
      if (selectedActivityField.value) {
        await api.updateActivityField({ id: selectedActivityField.value.ID, data: form })
      } else {
        await api.createActivityField({ data: form })
      }
      await getActivityFields()
      closePopUpActivityField()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpActivityField.value = false
    }
  }

  const selectedDeleteActivityField = ref<IActivityFieldItem>()
  function selectDeleteActivityField(item: IActivityFieldItem) {
    selectedDeleteActivityField.value = item
    openPopUpDeleteActivityField()
  }

  async function deleteActivityField() {
    try {
      loadingPopUpDeleteActivityField.value = true
      if (selectedDeleteActivityField.value) {
        await api.deleteActivityField({ id: selectedDeleteActivityField.value.ID })
      }
      await getActivityFields()
      closePopUpDeleteActivityField()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteActivityField.value = false
    }
  }
</script>
