<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpGenerationModification" icon="pi pi-plus" label="Add generation modification" />
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
      <DataTable :value="generationModifications" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="body_type_name" header="Body type"></Column>
        <Column field="drivetrain_name" header="Drivetrain"></Column>
        <Column field="engine_value" header="Engine"></Column>
        <Column field="fuel_type_name" header="Fuel type"></Column>
        <Column field="transmission_name" header="Transmission"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectGenerationModification(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
              />
              <Button
                @click.stop="selectDeleteGenerationModification(slotProps.data)"
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
  <PopUpGenerationModification
    v-if="showPopUpGenerationModification"
    @save="saveGenerationModification"
    @cancel="closePopUpGenerationModification"
    :loading="loadingPopUpGenerationModification"
    :item="selectedGenerationModification"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteGenerationModification"
    @delete="deleteGenerationModification"
    @cancel="closePopUpDeleteGenerationModification"
    :loading="loadingPopUpDeleteGenerationModification"
    description="Confirm delete generation modification!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpGenerationModification from '../components/PopUpGenerationModification.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IGenerationModification, IGenerationModificationForm, IGenerationModificationItem } from '../types'

  const {
    showPopUp: showPopUpGenerationModification,
    openPopUp: openPopUpGenerationModification,
    loading: loadingPopUpGenerationModification
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteGenerationModification,
    openPopUp: openPopUpDeleteGenerationModification,
    closePopUp: closePopUpDeleteGenerationModification,
    loading: loadingPopUpDeleteGenerationModification
  } = usePopUp()

  const route = useRoute()

  const brandId = route.params.brand as string
  const modelId = Number(route.params.model) as number
  const generationId = Number(route.params.generation) as number

  const items = ref([
    { label: 'Car settings' },
    { label: 'Brand', to: '/car-settings/brands' },
    { label: 'Model', to: `/car-settings/brand/${brandId}/models` },
    { label: 'Generation', to: `/car-settings/brand/${brandId}/model/${modelId}/generations` },
    {
      label: 'Modification',
      to: `/car-settings/brand/${brandId}/model/${modelId}/generation/${generationId}/modifications`
    }
  ])

  const generationModifications = ref<IGenerationModification[]>([])

  onMounted(() => {
    getGenerationModifications()
  })

  const selectedGenerationModification = ref<IGenerationModificationItem | null>(null)
  function selectGenerationModification(item: IGenerationModificationItem) {
    selectedGenerationModification.value = item
    openPopUpGenerationModification()
  }
  function closePopUpGenerationModification() {
    selectedGenerationModification.value = null
    showPopUpGenerationModification.value = false
  }

  async function getGenerationModifications() {
    try {
      const data: IGenerationModification[] = await api.getGenerationModifications({ generationId })

      generationModifications.value = data.map(
        (generationModification: IGenerationModification, index: number): IGenerationModificationItem => {
          return {
            index: index + 1,
            ...generationModification
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function saveGenerationModification(form: IGenerationModificationForm) {
    try {
      loadingPopUpGenerationModification.value = true
      if (selectedGenerationModification.value) {
        await api.updateGenerationModification({
          generationId: generationId,
          id: selectedGenerationModification.value.id,
          data: form
        })
      } else {
        await api.createGenerationModification({
          generationId: generationId,
          data: form
        })
      }
      await getGenerationModifications()
      closePopUpGenerationModification()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpGenerationModification.value = false
    }
  }

  const selectedDeleteGenerationModification = ref<IGenerationModificationItem>()
  function selectDeleteGenerationModification(item: IGenerationModificationItem) {
    selectedDeleteGenerationModification.value = item
    openPopUpDeleteGenerationModification()
  }

  async function deleteGenerationModification() {
    try {
      loadingPopUpDeleteGenerationModification.value = true
      if (selectedDeleteGenerationModification.value) {
        await api.deleteGenerationModification({
          generationId: generationId,
          id: selectedDeleteGenerationModification.value.id
        })
      }
      await getGenerationModifications()
      closePopUpDeleteGenerationModification()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteGenerationModification.value = false
    }
  }
</script>
