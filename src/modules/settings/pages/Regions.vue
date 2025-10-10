<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpRegion" icon="pi pi-plus" label="Add region" />
        <div class="w-100">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-search"></i>
            </InputGroupAddon>
            <InputText v-model="search" placeholder="Search" />
          </InputGroup>
        </div>
      </div>
      <div class="flex">
        <Breadcrumb :home="home" :model="items" class="p-0" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="regions" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectRegion(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteRegion(slotProps.data)"
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
  <PopUpRegion
    v-if="showPopUpRegion"
    @save="saveRegion"
    @cancel="closePopUpRegion"
    :loading="loadingPopUpRegion"
    :item="selectedRegion"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteRegion"
    description="Confirm delete region!"
    @delete="deleteRegion"
    @cancel="closePopUpDeleteRegion"
    :loading="loadingPopUpDeleteRegion"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { InputGroup, InputGroupAddon, InputText, Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpRegion from '../components/PopUpRegion.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IRegion, IRegionForm, IRegionItem } from '../types'

  const { showPopUp: showPopUpRegion, openPopUp: openPopUpRegion, loading: loadingPopUpRegion } = usePopUp()
  const {
    showPopUp: showPopUpDeleteRegion,
    openPopUp: openPopUpDeleteRegion,
    closePopUp: closePopUpDeleteRegion,
    loading: loadingPopUpDeleteRegion
  } = usePopUp()

  const route = useRoute()

  const cityId = route.params.city as string

  const home = ref({
    icon: 'pi pi-building',
    label: 'City'
  })

  const items = ref([{ label: 'Regions' }])

  const search = ref('')
  const regions = ref<IRegionItem[]>([])

  onMounted(() => {
    getRegions()
  })

  const selectedRegion = ref<IRegionItem | null>(null)
  function selectRegion(item: IRegionItem) {
    selectedRegion.value = item
    openPopUpRegion()
  }
  function closePopUpRegion() {
    selectedRegion.value = null
    showPopUpRegion.value = false
  }

  async function getRegions() {
    try {
      const data: IRegion[] = await api.getRegions({ cityId: cityId })

      regions.value = data.map((region: IRegion, index: number): IRegionItem => {
        return {
          index: index + 1,
          ...region
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveRegion(form: IRegionForm) {
    try {
      loadingPopUpRegion.value = true
      if (selectedRegion.value) {
        await api.updateRegion({ cityId: cityId, id: selectedRegion.value.id, data: form })
      } else {
        await api.createRegion({ cityId: cityId, data: form })
      }
      await getRegions()
      closePopUpRegion()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpRegion.value = false
    }
  }

  const selectedDeleteRegion = ref<IRegionItem>()
  function selectDeleteRegion(item: IRegionItem) {
    selectedDeleteRegion.value = item
    openPopUpDeleteRegion()
  }

  async function deleteRegion() {
    try {
      loadingPopUpDeleteRegion.value = true
      if (selectedDeleteRegion.value) {
        await api.deleteRegion({ cityId: cityId, id: selectedDeleteRegion.value.id })
      }
      await getRegions()
      closePopUpDeleteRegion()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteRegion.value = false
    }
  }
</script>
