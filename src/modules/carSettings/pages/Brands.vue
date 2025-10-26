<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpBrand" icon="pi pi-plus" label="Add brand" />
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="brands" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column header="Logo" class="w-6">
          <template #body="slotProps">
            <div class="w-6 h-6 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.logo"
                :src="`${baseURL}${slotProps.data.logo}`"
                class="w-full h-full object-contain object-center"
              />
            </div>
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column field="model_count" header="Model count"></Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectBrand(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteBrand(slotProps.data)"
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
  <PopUpBrand
    v-if="showPopUpBrand"
    @save="saveBrand"
    @cancel="closePopUpBrand"
    :loading="loadingPopUpBrand"
    :item="selectedBrand"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteBrand"
    @delete="deleteBrand"
    @cancel="closePopUpDeleteBrand"
    :loading="loadingPopUpDeleteBrand"
    description="Confirm delete brand!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button, DataTable, Column } from 'primevue'

  import PopUpBrand from '../components/PopUpBrand.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IBrand, IBrandForm, IBrandItem } from '../types'
  import { baseURL } from '@/shared/lib/utils/urls'

  const { showPopUp: showPopUpBrand, openPopUp: openPopUpBrand, loading: loadingPopUpBrand } = usePopUp()
  const {
    showPopUp: showPopUpDeleteBrand,
    openPopUp: openPopUpDeleteBrand,
    closePopUp: closePopUpDeleteBrand,
    loading: loadingPopUpDeleteBrand
  } = usePopUp()

  const router = useRouter()

  const brands = ref<IBrand[]>([])

  onMounted(() => {
    getBrands()
  })

  const selectedBrand = ref<IBrandItem | null>(null)
  function selectBrand(item: IBrandItem) {
    selectedBrand.value = item
    openPopUpBrand()
  }
  function closePopUpBrand() {
    selectedBrand.value = null
    showPopUpBrand.value = false
  }

  function onRowClick({ data }: { data: IBrandItem }) {
    router.push(`/car-settings/brand/${data.id}/models`)
  }

  async function getBrands() {
    try {
      const data: IBrand[] = await api.getBrands()

      brands.value = data.map((brand: IBrand, index: number): IBrandItem => {
        return {
          ...brand,
          index: index + 1
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveBrand(form: IBrandForm) {
    try {
      loadingPopUpBrand.value = true
      if (selectedBrand.value) {
        await api.updateBrand({
          id: selectedBrand.value.id,
          data: {
            ...form,
            logo: typeof form.logo === 'string' ? form.logo : ''
          }
        })
        if (typeof form.logo !== 'string') {
          await api.createBrandImage({
            id: selectedBrand.value.id,
            data: {
              image: form.logo
            }
          })
        }
      } else {
        const { id } = await api.createBrand({
          data: {
            ...form,
            logo: typeof form.logo === 'string' ? form.logo : ''
          }
        })
        if (typeof form.logo !== 'string') {
          await api.createBrandImage({
            id,
            data: {
              image: form.logo
            }
          })
        }
      }
      await getBrands()
      closePopUpBrand()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpBrand.value = false
    }
  }

  const selectedDeleteBrand = ref<IBrandItem>()
  function selectDeleteBrand(item: IBrandItem) {
    selectedDeleteBrand.value = item
    openPopUpDeleteBrand()
  }

  async function deleteBrand() {
    try {
      loadingPopUpDeleteBrand.value = true
      if (selectedDeleteBrand.value) {
        await api.deleteBrand({ id: selectedDeleteBrand.value.id })
      }
      await getBrands()
      closePopUpDeleteBrand()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteBrand.value = false
    }
  }
</script>
