<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpEngine" icon="pi pi-plus" :label="t('motorcycleSettings.engine.add')" />
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
      <DataTable :value="engines" :loading="loadingEngines" stripedRows rowHover size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('motorcycleSettings.engine.name')">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectEngine(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteEngine(slotProps.data)"
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
  <PopUpEngine
    v-if="showPopUpEngine"
    @save="saveEngine"
    @cancel="closePopUpEngine"
    :loading="loadingPopUpEngine"
    :item="selectedEngine"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteEngine"
    @delete="deleteEngine"
    @cancel="closePopUpDeleteEngine"
    :loading="loadingPopUpDeleteEngine"
    :description="t('motorcycleSettings.engine.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'

  import PopUpEngine from '../components/PopUpEngine.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IEngine, IEngineForm, IEngineItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const { showPopUp: showPopUpEngine, openPopUp: openPopUpEngine, loading: loadingPopUpEngine } = usePopUp()
  const {
    showPopUp: showPopUpDeleteEngine,
    openPopUp: openPopUpDeleteEngine,
    closePopUp: closePopUpDeleteEngine,
    loading: loadingPopUpDeleteEngine
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()
  const toast = useToast()

  const breadcrumbs = computed(() => [
    { label: t('sidebar.motorcycleSettings') },
    { label: t('motorcycleSettings.engine.title'), to: '/motorcycle-settings/engines' }
  ])

  onMounted(() => {
    getEngines()
  })

  const engines = ref<IEngineItem[]>([])
  const loadingEngines = ref(false)
  async function getEngines() {
    try {
      loadingEngines.value = true
      const data: IEngine[] = await api.getEngines()

      engines.value = data.map((engine: IEngine, index: number): IEngineItem => {
        return {
          index: index + 1,
          ...engine
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingEngines.value = false
    }
  }

  const selectedEngine = ref<IEngineItem | null>(null)
  function selectEngine(item: IEngineItem) {
    selectedEngine.value = item
    openPopUpEngine()
  }
  function closePopUpEngine() {
    selectedEngine.value = null
    showPopUpEngine.value = false
  }

  async function saveEngine(form: IEngineForm) {
    try {
      loadingPopUpEngine.value = true
      if (selectedEngine.value) {
        await api.updateEngine({ id: selectedEngine.value.id, data: form })
        toast.add({ severity: 'success', summary: t('toast.successUpdated'), life: 3000 })
      } else {
        await api.createEngine({ data: form })
        toast.add({ severity: 'success', summary: t('toast.successSaved'), life: 3000 })
      }
      await getEngines()
      closePopUpEngine()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
    } finally {
      loadingPopUpEngine.value = false
    }
  }

  const selectedDeleteEngine = ref<IEngineItem>()
  function selectDeleteEngine(item: IEngineItem) {
    selectedDeleteEngine.value = item
    openPopUpDeleteEngine()
  }

  async function deleteEngine() {
    try {
      loadingPopUpDeleteEngine.value = true
      if (selectedDeleteEngine.value) {
        await api.deleteEngine({ id: selectedDeleteEngine.value.id })
        toast.add({ severity: 'success', summary: t('toast.successDeleted'), life: 3000 })
      }
      await getEngines()
      closePopUpDeleteEngine()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
    } finally {
      loadingPopUpDeleteEngine.value = false
    }
  }
</script>
