<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpBrand" icon="pi pi-plus" label="Add brand" />
      </div>
      <div class="flex">
        <Breadcrumb :home="home" :model="items" class="p-0" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="brands" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column header="Image" class="w-6">
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
        <Column field="name" header="Name"></Column>
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
    description="Confirm delete brand!"
    @delete="deleteBrand"
    @cancel="closePopUpDeleteBrand"
    :loading="loadingPopUpDeleteBrand"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpBrand from '../components/PopUpBrand.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { IBrand, IBrandForm, IBrandItem } from '../types'

  const { showPopUp: showPopUpBrand, openPopUp: openPopUpBrand, loading: loadingPopUpBrand } = usePopUp()
  const {
    showPopUp: showPopUpDeleteBrand,
    openPopUp: openPopUpDeleteBrand,
    closePopUp: closePopUpDeleteBrand,
    loading: loadingPopUpDeleteBrand
  } = usePopUp()

  const router = useRouter()
  const route = useRoute()

  const categoryId = Number(route.params.category) as number

  const home = ref({
    icon: 'pi pi-car',
    label: 'Categories'
  })

  const items = ref([{ label: 'Brands' }])

  const brands = ref<IBrandItem[]>([])

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

  async function getBrands() {
    try {
      const data: IBrand[] = await api.getCategoryBrands({ id: categoryId })

      brands.value = data.map((brand: IBrand, index: number): IBrandItem => {
        return {
          index: index + 1,
          ...brand
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
            moto_category_id: categoryId,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createBrandImage({
            id: selectedBrand.value.id,
            data: {
              image: form.image
            }
          })
        }
      } else {
        const { id } = await api.createBrand({
          data: {
            ...form,
            moto_category_id: categoryId,
            image: typeof form.image === 'string' ? form.image : ''
          }
        })
        if (typeof form.image !== 'string') {
          await api.createBrandImage({
            id,
            data: {
              image: form.image
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

  function onRowClick({ data }: { data: IBrandItem }) {
    router.push(`/motorcycle-settings/category/${categoryId}/brand/${data.id}/models`)
  }
</script>
