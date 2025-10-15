<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpModel" icon="pi pi-plus" label="Add model" />
      </div>
      <div class="flex">
        <Breadcrumb :home="home" :model="items" class="p-0" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="models" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectModel(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteModel(slotProps.data)"
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
  <PopUpModel
    v-if="showPopUpModel"
    @save="saveModel"
    @cancel="closePopUpModel"
    :loading="loadingPopUpModel"
    :item="selectedModel"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteModel"
    description="Confirm delete model!"
    @delete="deleteModel"
    @cancel="closePopUpDeleteModel"
    :loading="loadingPopUpDeleteModel"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpModel from '../components/PopUpModel.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IModel, IModelForm, IModelItem } from '../types'

  const { showPopUp: showPopUpModel, openPopUp: openPopUpModel, loading: loadingPopUpModel } = usePopUp()
  const {
    showPopUp: showPopUpDeleteModel,
    openPopUp: openPopUpDeleteModel,
    closePopUp: closePopUpDeleteModel,
    loading: loadingPopUpDeleteModel
  } = usePopUp()

  const router = useRouter()
  const route = useRoute()

  const brandId = route.params.brand as string

  const home = ref({
    icon: 'pi pi-car',
    label: 'Brand'
  })

  const items = ref([{ label: 'Models' }])

  const models = ref<IModelItem[]>([])

  onMounted(() => {
    getModels()
  })

  const selectedModel = ref<IModelItem | null>(null)
  function selectModel(item: IModelItem) {
    selectedModel.value = item
    openPopUpModel()
  }
  function closePopUpModel() {
    selectedModel.value = null
    showPopUpModel.value = false
  }

  async function getModels() {
    try {
      const data: IModel[] = await api.getModels()

      models.value = data.map((model: IModel, index: number): IModelItem => {
        return {
          index: index + 1,
          ...model
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveModel(form: IModelForm) {
    try {
      loadingPopUpModel.value = true
      if (selectedModel.value) {
        await api.updateModel({ id: selectedModel.value.id, data: form })
      } else {
        await api.createModel({ data: form })
      }
      await getModels()
      closePopUpModel()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpModel.value = false
    }
  }

  const selectedDeleteModel = ref<IModelItem>()
  function selectDeleteModel(item: IModelItem) {
    selectedDeleteModel.value = item
    openPopUpDeleteModel()
  }

  async function deleteModel() {
    try {
      loadingPopUpDeleteModel.value = true
      if (selectedDeleteModel.value) {
        await api.deleteModel({ id: selectedDeleteModel.value.id })
      }
      await getModels()
      closePopUpDeleteModel()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteModel.value = false
    }
  }

  function onRowClick({ data }: { data: IModelItem }) {
    router.push(`/truck-settings/brand/${brandId}/model/${data.id}/generations`)
  }
</script>
