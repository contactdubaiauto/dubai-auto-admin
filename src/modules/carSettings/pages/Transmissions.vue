<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpTransmission" icon="pi pi-plus" :label="t('carSettings.transmission.add')" />
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
      <DataTable :value="transmissions" :loading="loadingTransmissions" rowHover stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('carSettings.transmission.name')">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectTransmission(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteTransmission(slotProps.data)"
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
  <PopUpTransmission
    v-if="showPopUpTransmission"
    @save="saveTransmission"
    @cancel="closePopUpTransmission"
    :loading="loadingPopUpTransmission"
    :item="selectedTransmission"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteTransmission"
    @delete="deleteTransmission"
    @cancel="closePopUpDeleteTransmission"
    :loading="loadingPopUpDeleteTransmission"
    :description="t('carSettings.transmission.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'

  import PopUpTransmission from '../components/PopUpTransmission.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { useLang } from '@/shared/lib/use/useLang'
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

  const { t } = useI18n()
  const { getDataByLang } = useLang()
  const toast = useToast()

  const breadcrumbs = ref([
    { label: t('sidebar.carSettings') },
    { label: t('carSettings.transmission.transmissions'), to: '/car-settings/transmissions' }
  ])

  onMounted(() => {
    getTransmissions()
  })

  const transmissions = ref<ITransmissionItem[]>([])
  const loadingTransmissions = ref(false)
  async function getTransmissions() {
    try {
      loadingTransmissions.value = true
      const data: ITransmission[] = await api.getTransmissions()

      transmissions.value = data.map((transmission: ITransmission, index: number): ITransmissionItem => {
        return {
          index: index + 1,
          ...transmission
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingTransmissions.value = false
    }
  }

  const selectedTransmission = ref<ITransmissionItem | null>(null)
  function selectTransmission(item: ITransmissionItem) {
    selectedTransmission.value = item
    openPopUpTransmission()
  }
  function closePopUpTransmission() {
    selectedTransmission.value = null
    showPopUpTransmission.value = false
  }

  async function saveTransmission(form: ITransmissionForm) {
    try {
      loadingPopUpTransmission.value = true
      if (selectedTransmission.value) {
        await api.updateTransmission({ id: selectedTransmission.value.id, data: form })
        toast.add({ severity: 'success', summary: t('toast.successUpdated'), life: 3000 })
      } else {
        await api.createTransmission({ data: form })
        toast.add({ severity: 'success', summary: t('toast.successSaved'), life: 3000 })
      }
      await getTransmissions()
      closePopUpTransmission()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
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
        toast.add({ severity: 'success', summary: t('toast.successDeleted'), life: 3000 })
      }
      await getTransmissions()
      closePopUpDeleteTransmission()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
    } finally {
      loadingPopUpDeleteTransmission.value = false
    }
  }
</script>
