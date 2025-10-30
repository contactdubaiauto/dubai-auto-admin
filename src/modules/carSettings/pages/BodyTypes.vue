<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpBodyType" icon="pi pi-plus" label="Add body type" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="bodyTypes" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="image" header="Image" class="w-4">
          <template #body="slotProps">
            <div class="w-16 h-10 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.image"
                :src="slotProps.data.image"
                class="w-full h-full object-contain object-center"
              />
            </div>
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectBodyType(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteBodyType(slotProps.data)"
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
  <PopUpBodyType
    v-if="showPopUpBodyType"
    @save="saveBodyType"
    @cancel="closePopUpBodyType"
    :loading="loadingPopUpBodyType"
    :item="selectedBodyType"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteBodyType"
    description="Confirm delete body type!"
    @delete="deleteBodyType"
    @cancel="closePopUpDeleteBodyType"
    :loading="loadingPopUpDeleteBodyType"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpBodyType from '../components/PopUpBodyType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IBodyType, IBodyTypeForm, IBodyTypeItem } from '../types'

  const { showPopUp: showPopUpBodyType, openPopUp: openPopUpBodyType, loading: loadingPopUpBodyType } = usePopUp()
  const {
    showPopUp: showPopUpDeleteBodyType,
    openPopUp: openPopUpDeleteBodyType,
    closePopUp: closePopUpDeleteBodyType,
    loading: loadingPopUpDeleteBodyType
  } = usePopUp()

  const bodyTypes = ref<IBodyTypeItem[]>([])

  onMounted(() => {
    getBodyTypes()
  })

  const selectedBodyType = ref<IBodyTypeItem | null>(null)
  function selectBodyType(item: IBodyTypeItem) {
    selectedBodyType.value = item
    openPopUpBodyType()
  }
  function closePopUpBodyType() {
    selectedBodyType.value = null
    showPopUpBodyType.value = false
  }

  async function getBodyTypes() {
    try {
      const data: IBodyType[] = await api.getBodyTypes()

      bodyTypes.value = data.map((bodyType: IBodyType, index: number): IBodyTypeItem => {
        return {
          ...bodyType,
          index: index + 1
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveBodyType(form: IBodyTypeForm) {
    try {
      loadingPopUpBodyType.value = true
      if (selectedBodyType.value) {
        await api.updateBodyType({
          id: selectedBodyType.value.id,
          data: {
            ...form,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createBodyTypeImage({
            id: selectedBodyType.value.id,
            data: {
              image: form.image
            }
          })
        }
      } else {
        const { id } = await api.createBodyType({
          data: {
            ...form,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createBodyTypeImage({
            id,
            data: {
              image: form.image
            }
          })
        }
      }

      await getBodyTypes()
      closePopUpBodyType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpBodyType.value = false
    }
  }

  const selectedDeleteBodyType = ref<IBodyTypeItem>()
  function selectDeleteBodyType(item: IBodyTypeItem) {
    selectedDeleteBodyType.value = item
    openPopUpDeleteBodyType()
  }

  async function deleteBodyType() {
    try {
      loadingPopUpDeleteBodyType.value = true
      if (selectedDeleteBodyType.value) {
        await api.deleteBodyType({ id: selectedDeleteBodyType.value.id })
      }
      await getBodyTypes()
      closePopUpDeleteBodyType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteBodyType.value = false
    }
  }
</script>
