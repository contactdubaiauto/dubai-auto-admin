<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpGeneration" icon="pi pi-plus" :label="t('carSettings.generation.add')" />
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
      <DataTable
        :value="generations"
        :loading="loadingGenerations"
        rowHover
        stripedRows
        size="small"
        @row-click="onRowClick"
      >
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('carSettings.generation.logo')" class="w-6">
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
        <Column :header="t('base.name')">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column field="start_year" :header="t('carSettings.generation.startYear')"></Column>
        <Column field="end_year" :header="t('carSettings.generation.endYear')"></Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectGeneration(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteGeneration(slotProps.data)"
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
    :description="t('carSettings.generation.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpModelGeneration from '../components/PopUpModelGeneration.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IGeneration, IGenerationForm, IGenerationItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const { showPopUp: showPopUpGeneration, openPopUp: openPopUpGeneration, loading: loadingPopUpGeneration } = usePopUp()
  const {
    showPopUp: showPopUpDeleteGeneration,
    openPopUp: openPopUpDeleteGeneration,
    closePopUp: closePopUpDeleteGeneration,
    loading: loadingPopUpDeleteGeneration
  } = usePopUp()

  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const { getDataByLang } = useLang()

  const brandId = route.params.brand as string
  const modelId = Number(route.params.model) as number

  const breadcrumbs = ref([
    { label: t('sidebar.carSettings') },
    { label: t('carSettings.brand.title'), to: '/car-settings/brands' },
    { label: t('carSettings.model.title'), to: `/car-settings/brand/${brandId}/models` },
    {
      label: t('carSettings.generation.generations'),
      to: `/car-settings/brand/${brandId}/model/${modelId}/generations`
    }
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

  const loadingGenerations = ref(false)
  async function getGenerations() {
    try {
      loadingGenerations.value = true
      const data: IGeneration[] = await api.getModelGenerations({ brandId, modelId })

      generations.value = data.map((generation: IGeneration, index: number): IGenerationItem => {
        return {
          index: index + 1,
          ...generation
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingGenerations.value = false
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
