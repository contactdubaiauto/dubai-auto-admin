<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpCategoryParameter" icon="pi pi-plus" label="Add category parameter" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="categoryParameters" stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="comtrans_parameter_name" header="Parameter"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectCategoryParameter(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
              />
              <Button
                @click.stop="selectDeleteCategoryParameter(slotProps.data)"
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
  <PopUpCategoryParameter
    v-if="showPopUpCategoryParameter"
    @save="saveCategoryParameter"
    @cancel="closePopUpCategoryParameter"
    :loading="loadingPopUpCategoryParameter"
    :item="selectedCategoryParameter"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteCategoryParameter"
    @delete="deleteCategoryParameter"
    @cancel="closePopUpDeleteCategoryParameter"
    :loading="loadingPopUpDeleteCategoryParameter"
    description="Confirm delete category parameter!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpCategoryParameter from '../components/PopUpCategoryParameter.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { ICategoryParameter, ICategoryParameterForm, ICategoryParameterItem } from '../types'

  const {
    showPopUp: showPopUpCategoryParameter,
    openPopUp: openPopUpCategoryParameter,
    loading: loadingPopUpCategoryParameter
  } = usePopUp()
  const {
    showPopUp: showPopUpDeleteCategoryParameter,
    openPopUp: openPopUpDeleteCategoryParameter,
    closePopUp: closePopUpDeleteCategoryParameter,
    loading: loadingPopUpDeleteCategoryParameter
  } = usePopUp()

  const route = useRoute()

  const categoryId = route.params.category as string

  const categoryParameters = ref<ICategoryParameter[]>([])

  onMounted(() => {
    getCategoryParameters()
  })

  const selectedCategoryParameter = ref<ICategoryParameterItem | null>(null)
  function selectCategoryParameter(item: ICategoryParameterItem) {
    selectedCategoryParameter.value = item
    openPopUpCategoryParameter()
  }
  function closePopUpCategoryParameter() {
    selectedCategoryParameter.value = null
    showPopUpCategoryParameter.value = false
  }

  async function getCategoryParameters() {
    try {
      const data: ICategoryParameter[] = await api.getCategoryParameters({ categoryId: categoryId })

      categoryParameters.value = data.map(
        (categoryParameter: ICategoryParameter, index: number): ICategoryParameterItem => {
          return {
            index: index + 1,
            ...categoryParameter
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  async function saveCategoryParameter(form: ICategoryParameterForm) {
    try {
      loadingPopUpCategoryParameter.value = true
      if (selectedCategoryParameter.value) {
        await api.updateCategoryParameter({
          categoryId: categoryId,
          id: selectedCategoryParameter.value.comtrans_parameter_id,
          data: form
        })
      } else {
        await api.createCategoryParameter({ categoryId: categoryId, data: form })
      }
      await getCategoryParameters()
      closePopUpCategoryParameter()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpCategoryParameter.value = false
    }
  }

  const selectedDeleteCategoryParameter = ref<ICategoryParameterItem>()
  function selectDeleteCategoryParameter(item: ICategoryParameterItem) {
    selectedDeleteCategoryParameter.value = item
    openPopUpDeleteCategoryParameter()
  }

  async function deleteCategoryParameter() {
    try {
      loadingPopUpDeleteCategoryParameter.value = true
      if (selectedDeleteCategoryParameter.value) {
        await api.deleteCategoryParameter({
          categoryId: categoryId,
          id: selectedDeleteCategoryParameter.value.comtrans_parameter_id
        })
      }
      await getCategoryParameters()
      closePopUpDeleteCategoryParameter()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteCategoryParameter.value = false
    }
  }
</script>
