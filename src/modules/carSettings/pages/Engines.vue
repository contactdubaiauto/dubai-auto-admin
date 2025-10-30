<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpEngine" icon="pi pi-plus" label="Add engine" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="engines" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="value" header="Value"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectEngine(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteEngine(slotProps.data)"
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
  <PopUpEngine
    v-if="showPopUpEngine"
    @save="saveEngine"
    @cancel="closePopUpEngine"
    :loading="loadingPopUpEngine"
    :item="selectedEngine"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteEngine"
    description="Confirm delete engine!"
    @delete="deleteEngine"
    @cancel="closePopUpDeleteEngine"
    :loading="loadingPopUpDeleteEngine"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpEngine from '../components/PopUpEngine.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IEngine, IEngineForm, IEngineItem } from '../types'

  const { showPopUp: showPopUpEngine, openPopUp: openPopUpEngine, loading: loadingPopUpEngine } = usePopUp()
  const {
    showPopUp: showPopUpDeleteEngine,
    openPopUp: openPopUpDeleteEngine,
    closePopUp: closePopUpDeleteEngine,
    loading: loadingPopUpDeleteEngine
  } = usePopUp()

  const engines = ref<IEngineItem[]>([])

  onMounted(() => {
    getEngines()
  })

  const selectedEngine = ref<IEngineItem | null>(null)
  function selectEngine(item: IEngineItem) {
    selectedEngine.value = item
    openPopUpEngine()
  }
  function closePopUpEngine() {
    selectedEngine.value = null
    showPopUpEngine.value = false
  }

  async function getEngines() {
    try {
      const data: IEngine[] = await api.getEngines()

      engines.value = data.map((engine: IEngine, index: number): IEngineItem => {
        return {
          index: index + 1,
          ...engine
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveEngine(form: IEngineForm) {
    try {
      loadingPopUpEngine.value = true
      if (selectedEngine.value) {
        await api.updateEngine({ id: selectedEngine.value.id, data: form })
      } else {
        await api.createEngine({ data: form })
      }
      await getEngines()
      closePopUpEngine()
    } catch (error) {
      console.error(error)
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
      }
      await getEngines()
      closePopUpDeleteEngine()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteEngine.value = false
    }
  }
</script>
