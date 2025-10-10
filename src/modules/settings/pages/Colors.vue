<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpColor" icon="pi pi-plus" label="Add color" />
      <div class="w-100">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="search" placeholder="Search" />
        </InputGroup>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="colors" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column header="Logo" class="w-6">
          <template #body="slotProps">
            <div class="w-6 h-6 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.image"
                :src="`${baseURL}${slotProps.data.image}`"
                class="w-full h-full object-contain object-center"
              />
            </div>
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectColor(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteColor(slotProps.data)"
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
  <PopUpColor
    v-if="showPopUpColor"
    @save="saveColor"
    @cancel="closePopUpColor"
    :loading="loadingPopUpColor"
    :item="selectedColor"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteColor"
    @delete="deleteColor"
    @cancel="closePopUpDeleteColor"
    :loading="loadingPopUpDeleteColor"
    description="Confirm delete color!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { InputGroup, InputGroupAddon, InputText, Button, DataTable, Column } from 'primevue'

  import PopUpColor from '../components/PopUpColor.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IColor, IColorForm, IColorItem } from '../types'
  import { baseURL } from '@/shared/lib/utils/urls'

  const { showPopUp: showPopUpColor, openPopUp: openPopUpColor, loading: loadingPopUpColor } = usePopUp()
  const {
    showPopUp: showPopUpDeleteColor,
    openPopUp: openPopUpDeleteColor,
    closePopUp: closePopUpDeleteColor,
    loading: loadingPopUpDeleteColor
  } = usePopUp()

  const search = ref('')
  const colors = ref<IColor[]>([])

  onMounted(() => {
    getColors()
  })

  const selectedColor = ref<IColorItem | null>(null)
  function selectColor(item: IColorItem) {
    selectedColor.value = item
    openPopUpColor()
  }
  function closePopUpColor() {
    selectedColor.value = null
    showPopUpColor.value = false
  }

  async function getColors() {
    try {
      const data: IColor[] = await api.getColors()

      colors.value = data.map((color: IColor, index: number): IColorItem => {
        return {
          index: index + 1,
          ...color
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveColor(form: IColorForm) {
    try {
      loadingPopUpColor.value = true
      if (selectedColor.value) {
        await api.updateColor({
          id: selectedColor.value.id,
          data: {
            ...form,
            image: typeof form.image === 'string' ? form.image : ' '
          }
        })
        if (typeof form.image !== 'string') {
          await api.createColorImage({
            id: selectedColor.value.id,
            data: {
              image: form.image
            }
          })
        }
      } else {
        const { id } = await api.createColor({
          data: {
            ...form,
            image: typeof form.image === 'string' ? form.image : ' '
          }
        })
        if (typeof form.image !== 'string') {
          await api.createColorImage({
            id,
            data: {
              image: form.image
            }
          })
        }
      }
      await getColors()
      closePopUpColor()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpColor.value = false
    }
  }

  const selectedDeleteColor = ref<IColorItem>()
  function selectDeleteColor(item: IColorItem) {
    selectedDeleteColor.value = item
    openPopUpDeleteColor()
  }

  async function deleteColor() {
    try {
      loadingPopUpDeleteColor.value = true
      if (selectedDeleteColor.value) {
        await api.deleteColor({ id: selectedDeleteColor.value.id })
      }
      await getColors()
      closePopUpDeleteColor()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteColor.value = false
    }
  }
</script>
