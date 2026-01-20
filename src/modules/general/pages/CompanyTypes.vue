<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpCompanyType" icon="pi pi-plus" :label="t('general.companyType.add')" />
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
      <DataTable :value="companyTypes" :loading="loadingCompanyTypes" rowHover stripedRows size="small">
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
                @click.stop="selectCompanyType(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteCompanyType(slotProps.data)"
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
  <PopUpCompanyType
    v-if="showPopUpCompanyType"
    @save="saveCompanyType"
    @cancel="closePopUpCompanyType"
    :loading="loadingPopUpCompanyType"
    :item="selectedCompanyType"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteCompanyType"
    @delete="deleteCompanyType"
    @cancel="closePopUpDeleteCompanyType"
    :loading="loadingPopUpDeleteCompanyType"
    :description="t('general.companyType.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'
  import { useI18n } from 'vue-i18n'

  import PopUpCompanyType from '../components/PopUpCompanyType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { ICompanyType, ICompanyTypeForm, ICompanyTypeItem } from '../types'
  import { useLang } from '@/shared/lib/use/useLang'

  const {
    showPopUp: showPopUpCompanyType,
    openPopUp: openPopUpCompanyType,
    loading: loadingPopUpCompanyType
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteCompanyType,
    openPopUp: openPopUpDeleteCompanyType,
    closePopUp: closePopUpDeleteCompanyType,
    loading: loadingPopUpDeleteCompanyType
  } = usePopUp()

  const { t } = useI18n()
  const { getDataByLang } = useLang()

  const breadcrumbs = computed(() => [
    { label: t('sidebar.general') },
    { label: t('sidebar.companyTypes'), to: '/general/company-types' }
  ])

  onMounted(() => {
    getCompanyTypes()
  })

  const companyTypes = ref<ICompanyType[]>([])
  const loadingCompanyTypes = ref(false)
  async function getCompanyTypes() {
    try {
      loadingCompanyTypes.value = true
      const data: ICompanyType[] = await api.getCompanyTypes()

      companyTypes.value = data.map((companyType: ICompanyType, index: number): ICompanyTypeItem => {
        return {
          index: index + 1,
          ...companyType
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingCompanyTypes.value = false
    }
  }

  const selectedCompanyType = ref<ICompanyTypeItem | null>(null)
  function selectCompanyType(item: ICompanyTypeItem) {
    selectedCompanyType.value = item
    openPopUpCompanyType()
  }
  function closePopUpCompanyType() {
    selectedCompanyType.value = null
    showPopUpCompanyType.value = false
  }

  async function saveCompanyType(form: ICompanyTypeForm) {
    try {
      loadingPopUpCompanyType.value = true
      if (selectedCompanyType.value) {
        await api.updateCompanyType({ id: selectedCompanyType.value.id, data: form })
      } else {
        await api.createCompanyType({ data: form })
      }
      await getCompanyTypes()
      closePopUpCompanyType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpCompanyType.value = false
    }
  }

  const selectedDeleteCompanyType = ref<ICompanyTypeItem>()
  function selectDeleteCompanyType(item: ICompanyTypeItem) {
    selectedDeleteCompanyType.value = item
    openPopUpDeleteCompanyType()
  }

  async function deleteCompanyType() {
    try {
      loadingPopUpDeleteCompanyType.value = true
      if (selectedDeleteCompanyType.value) {
        await api.deleteCompanyType({ id: selectedDeleteCompanyType.value.id })
      }
      await getCompanyTypes()
      closePopUpDeleteCompanyType()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteCompanyType.value = false
    }
  }
</script>
