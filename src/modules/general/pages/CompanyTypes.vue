<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpCompanyType" icon="pi pi-plus" label="Add company type" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="cities" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectCompanyType(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteCompanyType(slotProps.data)"
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
    description="Confirm delete company type!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpCompanyType from '../components/PopUpCompanyType.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { ICompanyType, ICompanyTypeForm, ICompanyTypeItem } from '../types'

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

  const cities = ref<ICompanyType[]>([])

  onMounted(() => {
    getCompanyTypes()
  })

  const selectedCompanyType = ref<ICompanyTypeItem | null>(null)
  function selectCompanyType(item: ICompanyTypeItem) {
    selectedCompanyType.value = item
    openPopUpCompanyType()
  }
  function closePopUpCompanyType() {
    selectedCompanyType.value = null
    showPopUpCompanyType.value = false
  }

  async function getCompanyTypes() {
    try {
      const data: ICompanyType[] = await api.getCompanyTypes()

      cities.value = data.map((companyType: ICompanyType, index: number): ICompanyTypeItem => {
        return {
          index: index + 1,
          ...companyType
        }
      })
    } catch (error) {
      console.error(error)
    }
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
