<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpDrivetrain" icon="pi pi-plus" label="Add drivetrain" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="drivetrains" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectDrivetrain(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteDrivetrain(slotProps.data)"
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
  <PopUpDrivetrain
    v-if="showPopUpDrivetrain"
    @save="saveDrivetrain"
    @cancel="closePopUpDrivetrain"
    :loading="loadingPopUpDrivetrain"
    :item="selectedDrivetrain"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteDrivetrain"
    description="Confirm delete drivetrain!"
    @delete="deleteDrivetrain"
    @cancel="closePopUpDeleteDrivetrain"
    :loading="loadingPopUpDeleteDrivetrain"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import {  Button, DataTable, Column } from 'primevue'

  import PopUpDrivetrain from '../components/PopUpDrivetrain.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IDrivetrain, IDrivetrainForm, IDrivetrainItem } from '../types'

  const { showPopUp: showPopUpDrivetrain, openPopUp: openPopUpDrivetrain, loading: loadingPopUpDrivetrain } = usePopUp()
  const {
    showPopUp: showPopUpDeleteDrivetrain,
    openPopUp: openPopUpDeleteDrivetrain,
    closePopUp: closePopUpDeleteDrivetrain,
    loading: loadingPopUpDeleteDrivetrain
  } = usePopUp()

  const drivetrains = ref<IDrivetrainItem[]>([])

  onMounted(() => {
    getDrivetrains()
  })

  const selectedDrivetrain = ref<IDrivetrainItem | null>(null)
  function selectDrivetrain(item: IDrivetrainItem) {
    selectedDrivetrain.value = item
    openPopUpDrivetrain()
  }
  function closePopUpDrivetrain() {
    selectedDrivetrain.value = null
    showPopUpDrivetrain.value = false
  }

  async function getDrivetrains() {
    try {
      const data: IDrivetrain[] = await api.getDrivetrains()

      drivetrains.value = data.map((drivetrain: IDrivetrain, index: number): IDrivetrainItem => {
        return {
          index: index + 1,
          ...drivetrain
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveDrivetrain(form: IDrivetrainForm) {
    try {
      loadingPopUpDrivetrain.value = true
      if (selectedDrivetrain.value) {
        await api.updateDrivetrain({ id: selectedDrivetrain.value.id, data: form })
      } else {
        await api.createDrivetrain({ data: form })
      }
      await getDrivetrains()
      closePopUpDrivetrain()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDrivetrain.value = false
    }
  }

  const selectedDeleteDrivetrain = ref<IDrivetrainItem>()
  function selectDeleteDrivetrain(item: IDrivetrainItem) {
    selectedDeleteDrivetrain.value = item
    openPopUpDeleteDrivetrain()
  }

  async function deleteDrivetrain() {
    try {
      loadingPopUpDeleteDrivetrain.value = true
      if (selectedDeleteDrivetrain.value) {
        await api.deleteDrivetrain({ id: selectedDeleteDrivetrain.value.id })
      }
      await getDrivetrains()
      closePopUpDeleteDrivetrain()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteDrivetrain.value = false
    }
  }
</script>
