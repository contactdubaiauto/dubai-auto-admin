<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpParameter" icon="pi pi-plus" label="Add parameter" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="parameters" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="moto_category_name" header="Categtory"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectParameter(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteParameter(slotProps.data)"
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
  <PopUpParameter
    v-if="showPopUpParameter"
    @save="saveParameter"
    @cancel="closePopUpParameter"
    :loading="loadingPopUpParameter"
    :item="selectedParameter"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteParameter"
    @delete="deleteParameter"
    @cancel="closePopUpDeleteParameter"
    :loading="loadingPopUpDeleteParameter"
    description="Confirm delete parameter!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpParameter from '../components/PopUpParameter.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IParameter, IParameterForm, IParameterItem } from '../types'

  const { showPopUp: showPopUpParameter, openPopUp: openPopUpParameter, loading: loadingPopUpParameter } = usePopUp()
  const {
    showPopUp: showPopUpDeleteParameter,
    openPopUp: openPopUpDeleteParameter,
    closePopUp: closePopUpDeleteParameter,
    loading: loadingPopUpDeleteParameter
  } = usePopUp()

  const router = useRouter()

  const parameters = ref<IParameter[]>([])

  onMounted(() => {
    getParameters()
  })

  const selectedParameter = ref<IParameterItem | null>(null)
  function selectParameter(item: IParameterItem) {
    selectedParameter.value = item
    openPopUpParameter()
  }
  function closePopUpParameter() {
    selectedParameter.value = null
    showPopUpParameter.value = false
  }

  async function getParameters() {
    try {
      const data: IParameter[] = await api.getParameters()

      parameters.value = data.map((parameter: IParameter, index: number): IParameterItem => {
        return {
          index: index + 1,
          ...parameter
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveParameter(form: IParameterForm) {
    try {
      loadingPopUpParameter.value = true
      if (selectedParameter.value) {
        await api.updateParameter({ id: selectedParameter.value.id, data: form })
      } else {
        await api.createParameter({ data: form })
      }
      await getParameters()
      closePopUpParameter()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpParameter.value = false
    }
  }

  const selectedDeleteParameter = ref<IParameterItem>()
  function selectDeleteParameter(item: IParameterItem) {
    selectedDeleteParameter.value = item
    openPopUpDeleteParameter()
  }

  async function deleteParameter() {
    try {
      loadingPopUpDeleteParameter.value = true
      if (selectedDeleteParameter.value) {
        await api.deleteParameter({ id: selectedDeleteParameter.value.id })
      }
      await getParameters()
      closePopUpDeleteParameter()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteParameter.value = false
    }
  }

  function onRowClick({ data }: { data: IParameterItem }) {
    router.push(`/motorcycle-settings/parameter/${data.id}/values`)
  }
</script>
