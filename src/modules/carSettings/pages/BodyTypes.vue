<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpBodyType" icon="pi pi-plus" :label="t('carSettings.bodyType.add')" />
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
      <DataTable :value="bodyTypes" :loading="loadingBodyTypes" rowHover stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('carSettings.bodyType.image')" class="w-4">
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
        <Column :header="t('base.name')">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectBodyType(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteBodyType(slotProps.data)"
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
  <PopUpBodyType
    v-if="showPopUpBodyType"
    @save="saveBodyType"
    @cancel="closePopUpBodyType"
    :loading="loadingPopUpBodyType"
    :item="selectedBodyType"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteBodyType"
    :description="t('carSettings.bodyType.confirmDelete')"
    @delete="deleteBodyType"
    @cancel="closePopUpDeleteBodyType"
    :loading="loadingPopUpDeleteBodyType"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useToast } from 'primevue/usetoast'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpBodyType from '../components/PopUpBodyType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import { useLang } from '@/shared/lib/use/useLang'
  import type { IBodyType, IBodyTypeForm, IBodyTypeItem } from '../types'

  const { showPopUp: showPopUpBodyType, openPopUp: openPopUpBodyType, loading: loadingPopUpBodyType } = usePopUp()
  const {
    showPopUp: showPopUpDeleteBodyType,
    openPopUp: openPopUpDeleteBodyType,
    closePopUp: closePopUpDeleteBodyType,
    loading: loadingPopUpDeleteBodyType
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()
  const toast = useToast()

  const breadcrumbs = ref([
    { label: t('sidebar.carSettings') },
    { label: t('carSettings.bodyType.bodyTypes'), to: '/car-settings/body-types' }
  ])

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

  const loadingBodyTypes = ref(false)
  async function getBodyTypes() {
    try {
      loadingBodyTypes.value = true
      const data: IBodyType[] = await api.getBodyTypes()

      bodyTypes.value = data.map((bodyType: IBodyType, index: number): IBodyTypeItem => {
        return {
          ...bodyType,
          index: index + 1
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingBodyTypes.value = false
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
        toast.add({ severity: 'success', summary: t('toast.successUpdated'), life: 3000 })
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
        toast.add({ severity: 'success', summary: t('toast.successSaved'), life: 3000 })
      }

      await getBodyTypes()
      closePopUpBodyType()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
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
        toast.add({ severity: 'success', summary: t('toast.successDeleted'), life: 3000 })
      }
      await getBodyTypes()
      closePopUpDeleteBodyType()
    } catch (error) {
      console.error(error)
      toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
    } finally {
      loadingPopUpDeleteBodyType.value = false
    }
  }
</script>
