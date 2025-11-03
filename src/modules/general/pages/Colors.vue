<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpColor" icon="pi pi-plus" :label="t('general.color.add')" />
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
      <DataTable :value="colors" :loading="loadingColors" rowHover stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('general.color.logo')" class="w-6">
          <template #body="slotProps">
            <div class="w-6 h-6 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.image"
                :src="slotProps.data.image"
                class="w-full h-full object-contain object-center"
              />
            </div>
          </template>
        </Column>
        <Column :header="t('base.name')" field="name">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectColor(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteColor(slotProps.data)"
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
    :description="t('general.color.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpColor from '../components/PopUpColor.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IColor, IColorForm, IColorItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const { showPopUp: showPopUpColor, openPopUp: openPopUpColor, loading: loadingPopUpColor } = usePopUp()
  const {
    showPopUp: showPopUpDeleteColor,
    openPopUp: openPopUpDeleteColor,
    closePopUp: closePopUpDeleteColor,
    loading: loadingPopUpDeleteColor
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()

  const breadcrumbs = ref([{ label: t('sidebar.general') }, { label: t('sidebar.colors'), to: '/general/colors' }])

  onMounted(() => {
    getColors()
  })

  const colors = ref<IColor[]>([])
  const loadingColors = ref(false)
  async function getColors() {
    try {
      loadingColors.value = true
      const data: IColor[] = await api.getColors()

      colors.value = data.map((color: IColor, index: number): IColorItem => {
        return {
          index: index + 1,
          ...color
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingColors.value = false
    }
  }

  const selectedColor = ref<IColorItem | null>(null)
  function selectColor(item: IColorItem) {
    selectedColor.value = item
    openPopUpColor()
  }
  function closePopUpColor() {
    selectedColor.value = null
    showPopUpColor.value = false
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
