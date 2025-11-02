<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpGeneration" icon="pi pi-plus" label="Add generation" />
      </div>
      <div class="flex">
        <Breadcrumb :model="items" class="p-0">
          <template #item="{ item }">
            <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
            <div v-else>{{ item.label }}</div>
          </template>
        </Breadcrumb>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="generations" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column header="Logo" class="w-6">
          <template #body="slotProps">
            <div class="w-6 h-6 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.image"
                :src="`${slotProps.data.image}_l.jpg`"
                class="w-full h-full object-contain object-center"
              />
            </div>
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column field="start_year" header="Start year"></Column>
        <Column field="end_year" header="End year"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectGeneration(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteGeneration(slotProps.data)"
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
  <PopUpModelGeneration
    v-if="showPopUpGeneration"
    @save="saveGeneration"
    @cancel="closePopUpGeneration"
    :loading="loadingPopUpGeneration"
    :item="selectedGeneration"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteGeneration"
    @delete="deleteGeneration"
    @cancel="closePopUpDeleteGeneration"
    :loading="loadingPopUpDeleteGeneration"
    description="Confirm delete generation!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpModelGeneration from '../components/PopUpModelGeneration.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IGeneration, IGenerationForm, IGenerationItem } from '../types'

  const { showPopUp: showPopUpGeneration, openPopUp: openPopUpGeneration, loading: loadingPopUpGeneration } = usePopUp()
  const {
    showPopUp: showPopUpDeleteGeneration,
    openPopUp: openPopUpDeleteGeneration,
    closePopUp: closePopUpDeleteGeneration,
    loading: loadingPopUpDeleteGeneration
  } = usePopUp()

  const router = useRouter()
  const route = useRoute()

  const brandId = route.params.brand as string
  const modelId = Number(route.params.model) as number

  const items = ref([
    { label: 'Car settings' },
    { label: 'Brand', to: '/car-settings/brands' },
    { label: 'Model', to: `/car-settings/brand/${brandId}/models` },
    { label: 'Generations', to: `/car-settings/brand/${brandId}/model/${modelId}/generations` }
  ])

  const generations = ref<IGeneration[]>([])

  onMounted(() => {
    getGenerations()
  })

  const selectedGeneration = ref<IGenerationItem | null>(null)
  function selectGeneration(item: IGenerationItem) {
    selectedGeneration.value = item
    openPopUpGeneration()
  }
  function closePopUpGeneration() {
    selectedGeneration.value = null
    showPopUpGeneration.value = false
  }

  function onRowClick({ data }: { data: IGenerationItem }) {
    router.push(`/car-settings/brand/${brandId}/model/${modelId}/generation/${data.id}/modifications`)
  }

  async function getGenerations() {
    try {
      const data: IGeneration[] = await api.getModelGenerations({ brandId, modelId })

      generations.value = data.map((generation: IGeneration, index: number): IGenerationItem => {
        return {
          index: index + 1,
          ...generation
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveGeneration(form: IGenerationForm) {
    try {
      loadingPopUpGeneration.value = true
      if (selectedGeneration.value) {
        await api.updateGeneration({
          id: selectedGeneration.value.id,
          data: {
            ...form,
            model_id: modelId,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createGenerationImage({
            id: selectedGeneration.value.id,
            data: {
              image: form.image
            }
          })
        }
      } else {
        const { id } = await api.createGeneration({
          data: {
            ...form,
            model_id: modelId,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createGenerationImage({
            id,
            data: {
              image: form.image
            }
          })
        }
      }
      await getGenerations()
      closePopUpGeneration()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpGeneration.value = false
    }
  }

  const selectedDeleteGeneration = ref<IGenerationItem>()
  function selectDeleteGeneration(item: IGenerationItem) {
    selectedDeleteGeneration.value = item
    openPopUpDeleteGeneration()
  }

  async function deleteGeneration() {
    try {
      loadingPopUpDeleteGeneration.value = true
      if (selectedDeleteGeneration.value) {
        await api.deleteGeneration({ id: selectedDeleteGeneration.value.id })
      }
      await getGenerations()
      closePopUpDeleteGeneration()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteGeneration.value = false
    }
  }
</script>
