<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpTransmission" icon="pi pi-plus" label="Add transmission" />
        <div class="w-100">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-search"></i>
            </InputGroupAddon>
            <InputText v-model="search" placeholder="Search" />
          </InputGroup>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="transmissions" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectTransmission(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteTransmission(slotProps.data)"
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
  <PopUpTransmission
    v-if="showPopUpTransmission"
    @save="saveTransmission"
    @cancel="closePopUpTransmission"
    :loading="loadingPopUpTransmission"
    :item="selectedTransmission"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteTransmission"
    description="Confirm delete transmission!"
    @delete="deleteTransmission"
    @cancel="closePopUpDeleteTransmission"
    :loading="loadingPopUpDeleteTransmission"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { InputGroup, InputGroupAddon, InputText, Button, DataTable, Column } from 'primevue'

  import PopUpTransmission from '../components/PopUpTransmission.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { ITransmission, ITransmissionForm, ITransmissionItem } from '../types'

  const {
    showPopUp: showPopUpTransmission,
    openPopUp: openPopUpTransmission,
    loading: loadingPopUpTransmission
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteTransmission,
    openPopUp: openPopUpDeleteTransmission,
    closePopUp: closePopUpDeleteTransmission,
    loading: loadingPopUpDeleteTransmission
  } = usePopUp()

  const search = ref('')
  const transmissions = ref<ITransmissionItem[]>([])

  onMounted(() => {
    getTransmissions()
  })

  const selectedTransmission = ref<ITransmissionItem | null>(null)
  function selectTransmission(item: ITransmissionItem) {
    selectedTransmission.value = item
    openPopUpTransmission()
  }
  function closePopUpTransmission() {
    selectedTransmission.value = null
    showPopUpTransmission.value = false
  }

  async function getTransmissions() {
    try {
      const data: ITransmission[] = await api.getTransmissions()

      transmissions.value = data.map((transmission: ITransmission, index: number): ITransmissionItem => {
        return {
          index: index + 1,
          ...transmission
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveTransmission(form: ITransmissionForm) {
    try {
      loadingPopUpTransmission.value = true
      if (selectedTransmission.value) {
        await api.updateTransmission({ id: selectedTransmission.value.id, data: form })
      } else {
        await api.createTransmission({ data: form })
      }
      await getTransmissions()
      closePopUpTransmission()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpTransmission.value = false
    }
  }

  const selectedDeleteTransmission = ref<ITransmissionItem>()
  function selectDeleteTransmission(item: ITransmissionItem) {
    selectedDeleteTransmission.value = item
    openPopUpDeleteTransmission()
  }

  async function deleteTransmission() {
    try {
      loadingPopUpDeleteTransmission.value = true
      if (selectedDeleteTransmission.value) {
        await api.deleteTransmission({ id: selectedDeleteTransmission.value.id })
      }
      await getTransmissions()
      closePopUpDeleteTransmission()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteTransmission.value = false
    }
  }
</script>
