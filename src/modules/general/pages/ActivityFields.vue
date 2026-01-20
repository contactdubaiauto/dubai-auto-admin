<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpActivityField" icon="pi pi-plus" :label="t('general.activityField.add')" />
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
      <DataTable :value="activityFields" :loading="loadingActivityFields" rowHover stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('base.name')" field="name">
          <template #body="slotProps">
            {{ getDataByLang({ data: slotProps.data }) }}
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectActivityField(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteActivityField(slotProps.data)"
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
  <PopUpActivityField
    v-if="showPopUpActivityField"
    @save="saveActivityField"
    @cancel="closePopUpActivityField"
    :loading="loadingPopUpActivityField"
    :item="selectedActivityField"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteActivityField"
    @delete="deleteActivityField"
    @cancel="closePopUpDeleteActivityField"
    :loading="loadingPopUpDeleteActivityField"
    :description="t('general.activityField.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'
  import { useI18n } from 'vue-i18n'

  import PopUpActivityField from '../components/PopUpActivityField.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IActivityField, IActivityFieldForm, IActivityFieldItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const {
    showPopUp: showPopUpActivityField,
    openPopUp: openPopUpActivityField,
    loading: loadingPopUpActivityField
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteActivityField,
    openPopUp: openPopUpDeleteActivityField,
    closePopUp: closePopUpDeleteActivityField,
    loading: loadingPopUpDeleteActivityField
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()

  const breadcrumbs = computed(() => [
    { label: t('sidebar.general') },
    { label: t('sidebar.activityFields'), to: '/general/activity-fields' }
  ])

  onMounted(() => {
    getActivityFields()
  })

  const activityFields = ref<IActivityField[]>([])
  const loadingActivityFields = ref(false)
  async function getActivityFields() {
    try {
      loadingActivityFields.value = true
      const data: IActivityField[] = await api.getActivityFields()

      activityFields.value = data.map((activityField: IActivityField, index: number): IActivityFieldItem => {
        return {
          index: index + 1,
          ...activityField
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingActivityFields.value = false
    }
  }

  const selectedActivityField = ref<IActivityFieldItem | null>(null)
  function selectActivityField(item: IActivityFieldItem) {
    selectedActivityField.value = item
    openPopUpActivityField()
  }
  function closePopUpActivityField() {
    selectedActivityField.value = null
    showPopUpActivityField.value = false
  }

  async function saveActivityField(form: IActivityFieldForm) {
    try {
      loadingPopUpActivityField.value = true
      if (selectedActivityField.value) {
        await api.updateActivityField({ id: selectedActivityField.value.id, data: form })
      } else {
        await api.createActivityField({ data: form })
      }
      await getActivityFields()
      closePopUpActivityField()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpActivityField.value = false
    }
  }

  const selectedDeleteActivityField = ref<IActivityFieldItem>()
  function selectDeleteActivityField(item: IActivityFieldItem) {
    selectedDeleteActivityField.value = item
    openPopUpDeleteActivityField()
  }

  async function deleteActivityField() {
    try {
      loadingPopUpDeleteActivityField.value = true
      if (selectedDeleteActivityField.value) {
        await api.deleteActivityField({ id: selectedDeleteActivityField.value.id })
      }
      await getActivityFields()
      closePopUpDeleteActivityField()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteActivityField.value = false
    }
  }
</script>
