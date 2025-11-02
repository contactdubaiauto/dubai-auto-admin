<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpBrand" icon="pi pi-plus" :label="t('carSettings.brand.add')" />
      </div>
      <div class="flex">
        <Breadcrumb :model="items" class="p-0">
          <template #item="{ item }">
            <router-link v-if="item.to" :to="item.to">{{ item.label }}</router-link>
            <div v-else>{{ item.label }}</div>
          </template>
        </Breadcrumb>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="brands" :loading="loadingBrands" rowHover stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column :header="t('carSettings.brand.logo')" class="w-6">
          <template #body="slotProps">
            <div class="w-6 h-6 bg-gray-100 rounded-md">
              <img
                v-if="slotProps.data.logo"
                :src="slotProps.data.logo"
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
        <Column field="model_count" :header="t('carSettings.brand.modelCount')"></Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectBrand(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteBrand(slotProps.data)"
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
    :description="t('carSettings.brand.confirmDelete')"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { Button, DataTable, Column, Breadcrumb } from 'primevue'

  import PopUpBrand from '../components/PopUpBrand.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IBrand, IBrandForm, IBrandItem } from '../types'
  import { getDataByLang } from '@/shared/lib/utils/lang'

  const { showPopUp: showPopUpBrand, openPopUp: openPopUpBrand, loading: loadingPopUpBrand } = usePopUp()
  const {
    showPopUp: showPopUpDeleteBrand,
    openPopUp: openPopUpDeleteBrand,
    closePopUp: closePopUpDeleteBrand,
    loading: loadingPopUpDeleteBrand
  } = usePopUp()

  const router = useRouter()
  const { t } = useI18n()

  const items = ref([{ label: t('sidebar.carSettings') }, { label: t('sidebar.brands'), to: '/car-settings/brands' }])

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

  const loadingBrands = ref(false)
  async function getBrands() {
    try {
      loadingBrands.value = true
      const data: IBrand[] = await api.getBrands()

      brands.value = data.map((brand: IBrand, index: number): IBrandItem => {
        return {
          ...brand,
          index: index + 1
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingBrands.value = false
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
