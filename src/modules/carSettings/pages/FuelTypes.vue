<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpFuelType" icon="pi pi-plus" label="Add fuel type" />
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
      <DataTable :value="fuelTypes" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectFuelType(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteFuelType(slotProps.data)"
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
  <PopUpFuelType
    v-if="showPopUpFuelType"
    @save="saveFuelType"
    @cancel="closePopUpFuelType"
    :loading="loadingPopUpFuelType"
    :item="selectedFuelType"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteFuelType"
    description="Confirm delete fuel type!"
    @delete="deleteFuelType"
    @cancel="closePopUpDeleteFuelType"
    :loading="loadingPopUpDeleteFuelType"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { InputGroup, InputGroupAddon, InputText, Button, DataTable, Column } from 'primevue'

  import PopUpFuelType from '../components/PopUpFuelType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IFuelType, IFuelTypeForm, IFuelTypeItem } from '../types'

  const { showPopUp: showPopUpFuelType, openPopUp: openPopUpFuelType, loading: loadingPopUpFuelType } = usePopUp()
  const {
    showPopUp: showPopUpDeleteFuelType,
    openPopUp: openPopUpDeleteFuelType,
    closePopUp: closePopUpDeleteFuelType,
    loading: loadingPopUpDeleteFuelType
  } = usePopUp()

  const search = ref('')
  const fuelTypes = ref<IFuelTypeItem[]>([])

  onMounted(() => {
    getFuelTypes()
  })

  const selectedFuelType = ref<IFuelTypeItem | null>(null)
  function selectFuelType(item: IFuelTypeItem) {
    selectedFuelType.value = item
    openPopUpFuelType()
  }
  function closePopUpFuelType() {
    selectedFuelType.value = null
    showPopUpFuelType.value = false
  }

  async function getFuelTypes() {
    try {
      const data: IFuelType[] = await api.getFuelTypes()

      fuelTypes.value = data.map((fuelType: IFuelType, index: number): IFuelTypeItem => {
        return {
          index: index + 1,
          ...fuelType
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveFuelType(form: IFuelTypeForm) {
    try {
      loadingPopUpFuelType.value = true
      if (selectedFuelType.value) {
        await api.updateFuelType({ id: selectedFuelType.value.id, data: form })
      } else {
        await api.createFuelType({ data: form })
      }
      await getFuelTypes()
      closePopUpFuelType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpFuelType.value = false
    }
  }

  const selectedDeleteFuelType = ref<IFuelTypeItem>()
  function selectDeleteFuelType(item: IFuelTypeItem) {
    selectedDeleteFuelType.value = item
    openPopUpDeleteFuelType()
  }

  async function deleteFuelType() {
    try {
      loadingPopUpDeleteFuelType.value = true
      if (selectedDeleteFuelType.value) {
        await api.deleteFuelType({ id: selectedDeleteFuelType.value.id })
      }
      await getFuelTypes()
      closePopUpDeleteFuelType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteFuelType.value = false
    }
  }
</script>
