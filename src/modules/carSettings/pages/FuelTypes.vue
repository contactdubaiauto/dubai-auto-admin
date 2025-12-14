<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpFuelType" icon="pi pi-plus" :label="t('carSettings.fuelType.add')" />
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
      <DataTable :value="fuelTypes" :loading="loadingFuelType" rowHover stripedRowssize="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('carSettings.fuelType.name')">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectFuelType(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteFuelType(slotProps.data)"
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
  <PopUpFuelType
    v-if="showPopUpFuelType"
    @save="saveFuelType"
    @cancel="closePopUpFuelType"
    :loading="loadingPopUpFuelType"
    :item="selectedFuelType"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteFuelType"
    @delete="deleteFuelType"
    @cancel="closePopUpDeleteFuelType"
    :loading="loadingPopUpDeleteFuelType"
    :description="t('carSettings.fuelType.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'

  import PopUpFuelType from '../components/PopUpFuelType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IFuelType, IFuelTypeForm, IFuelTypeItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const { showPopUp: showPopUpFuelType, openPopUp: openPopUpFuelType, loading: loadingPopUpFuelType } = usePopUp()
  const {
    showPopUp: showPopUpDeleteFuelType,
    openPopUp: openPopUpDeleteFuelType,
    closePopUp: closePopUpDeleteFuelType,
    loading: loadingPopUpDeleteFuelType
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()
  const toast = useToast()

  const breadcrumbs = ref([
    { label: t('sidebar.carSettings') },
    { label: t('carSettings.fuelType.fuelTypes'), to: '/car-settings/fuel-types' }
  ])

  onMounted(() => {
    getFuelTypes()
  })

  const fuelTypes = ref<IFuelTypeItem[]>([])
  const loadingFuelType = ref(false)
  async function getFuelTypes() {
    try {
      loadingFuelType.value = true
      const data: IFuelType[] = await api.getFuelTypes()

      fuelTypes.value = data.map((fuelType: IFuelType, index: number): IFuelTypeItem => {
        return {
          index: index + 1,
          ...fuelType
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingFuelType.value = false
    }
  }

  const selectedFuelType = ref<IFuelTypeItem | null>(null)
  function selectFuelType(item: IFuelTypeItem) {
    selectedFuelType.value = item
    openPopUpFuelType()
  }
  function closePopUpFuelType() {
    selectedFuelType.value = null
    showPopUpFuelType.value = false
  }

  async function saveFuelType(form: IFuelTypeForm) {
    try {
      loadingPopUpFuelType.value = true
      if (selectedFuelType.value) {
        await api.updateFuelType({ id: selectedFuelType.value.id, data: form })
        toast.add({ severity: 'success', summary: t('toast.successUpdated'), life: 3000 })
      } else {
        await api.createFuelType({ data: form })
        toast.add({ severity: 'success', summary: t('toast.successSaved'), life: 3000 })
      }
      await getFuelTypes()
      closePopUpFuelType()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
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
        toast.add({ severity: 'success', summary: t('toast.successDeleted'), life: 3000 })
      }
      await getFuelTypes()
      closePopUpDeleteFuelType()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
    } finally {
      loadingPopUpDeleteFuelType.value = false
    }
  }
</script>
