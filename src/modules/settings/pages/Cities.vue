<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpCity" icon="pi pi-plus" label="Add city" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="cities" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectCity(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteCity(slotProps.data)"
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
  <PopUpCity
    v-if="showPopUpCity"
    @save="saveCity"
    @cancel="closePopUpCity"
    :loading="loadingPopUpCity"
    :item="selectedCity"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteCity"
    @delete="deleteCity"
    @cancel="closePopUpDeleteCity"
    :loading="loadingPopUpDeleteCity"
    description="Confirm delete city!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpCity from '../components/PopUpCity.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { ICity, ICityForm, ICityItem } from '../types'

  const { showPopUp: showPopUpCity, openPopUp: openPopUpCity, loading: loadingPopUpCity } = usePopUp()
  const {
    showPopUp: showPopUpDeleteCity,
    openPopUp: openPopUpDeleteCity,
    closePopUp: closePopUpDeleteCity,
    loading: loadingPopUpDeleteCity
  } = usePopUp()

  const router = useRouter()

  const cities = ref<ICity[]>([])

  onMounted(() => {
    getCities()
  })

  const selectedCity = ref<ICityItem | null>(null)
  function selectCity(item: ICityItem) {
    selectedCity.value = item
    openPopUpCity()
  }
  function closePopUpCity() {
    selectedCity.value = null
    showPopUpCity.value = false
  }

  function onRowClick({ data }: { data: ICityItem }) {
    router.push(`/settings/city/${data.id}/regions`)
  }

  async function getCities() {
    try {
      const data: ICity[] = await api.getCities()

      cities.value = data.map((city: ICity, index: number): ICityItem => {
        return {
          index: index + 1,
          ...city
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveCity(form: ICityForm) {
    try {
      loadingPopUpCity.value = true
      if (selectedCity.value) {
        await api.updateCity({ id: selectedCity.value.id, data: form })
      } else {
        await api.createCity({ data: form })
      }
      await getCities()
      closePopUpCity()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpCity.value = false
    }
  }

  const selectedDeleteCity = ref<ICityItem>()
  function selectDeleteCity(item: ICityItem) {
    selectedDeleteCity.value = item
    openPopUpDeleteCity()
  }

  async function deleteCity() {
    try {
      loadingPopUpDeleteCity.value = true
      if (selectedDeleteCity.value) {
        await api.deleteCity({ id: selectedDeleteCity.value.id })
      }
      await getCities()
      closePopUpDeleteCity()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteCity.value = false
    }
  }
</script>
