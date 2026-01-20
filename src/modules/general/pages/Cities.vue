<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpCity" icon="pi pi-plus" :label="t('general.city.add')" />
      </div>
      <div class="flex">
        <Breadcrumb :model="breadcrumbs" class="p-0">
          <template #item="{ item }">
            <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
            <div v-else>{{ item.label }}</div>
          </template>
        </Breadcrumb>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="cities" :loading="loadingCities" rowHover stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('base.name')" field="name"> </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectCity(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteCity(slotProps.data)"
                icon="pi pi-trash"
                severity="danger"
                rounded
                variant="outlined"
                size="small"
              />
            </div>
          </template>
        </Column>
        <template #loading>
          <LoadingState />
        </template>
        <template #empty>
          <EmptyState />
        </template>
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
    :description="t('general.city.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpCity from '../components/PopUpCity.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

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
  const { t } = useI18n()
  const toast = useToast()

  const breadcrumbs = computed(() => [{ label: t('sidebar.general') }, { label: t('sidebar.cities'), to: '/general/cities' }])

  onMounted(() => {
    getCities()
  })

  const cities = ref<ICity[]>([])
  const loadingCities = ref(false)
  async function getCities() {
    try {
      loadingCities.value = true
      const data: ICity[] = await api.getCities()

      cities.value = data.map((city: ICity, index: number): ICityItem => {
        return {
          index: index + 1,
          ...city
        }
      })
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: t('toast.errorSaving'),
        life: 3000
      })
    } finally {
      loadingCities.value = false
    }
  }

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
    router.push(`/general/city/${data.id}/regions`)
  }

  async function saveCity(form: ICityForm) {
    try {
      loadingPopUpCity.value = true
      if (selectedCity.value) {
        await api.updateCity({ id: selectedCity.value.id, data: form })
        toast.add({
          severity: 'success',
          summary: t('toast.successUpdated'),
          life: 3000
        })
      } else {
        await api.createCity({ data: form })
        toast.add({
          severity: 'success',
          summary: t('toast.successSaved'),
          life: 3000
        })
      }
      await getCities()
      closePopUpCity()
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: t('toast.errorSaving'),
        life: 3000
      })
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
        toast.add({
          severity: 'success',
          summary: t('toast.successDeleted'),
          life: 3000
        })
      }
      await getCities()
      closePopUpDeleteCity()
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: t('toast.errorSaving'),
        life: 3000
      })
    } finally {
      loadingPopUpDeleteCity.value = false
    }
  }
</script>
