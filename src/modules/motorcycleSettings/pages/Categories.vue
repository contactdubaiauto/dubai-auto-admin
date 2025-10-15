<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="openPopUpCategory" icon="pi pi-plus" label="Add category" />
      <div class="w-100">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-search"></i>
          </InputGroupAddon>
          <InputText v-model="search" placeholder="Search" />
        </InputGroup>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="categories" stripedRows size="small" @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="name" header="Name"></Column>
        <Column header="Parameters" class="w-9">
          <template #body="slotProps">
            <Button @click="openCategoryParameters(slotProps.data)" label="Parameters" size="small" />
          </template>
        </Column>
        <Column header="Actions" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button @click.stop="selectCategory(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
              <Button
                @click.stop="selectDeleteCategory(slotProps.data)"
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
  <PopUpCategory
    v-if="showPopUpCategory"
    @save="saveCategory"
    @cancel="closePopUpCategory"
    :loading="loadingPopUpCategory"
    :item="selectedCategory"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteCategory"
    @delete="deleteCategory"
    @cancel="closePopUpDeleteCategory"
    :loading="loadingPopUpDeleteCategory"
    description="Confirm delete category!"
  />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { InputGroup, InputGroupAddon, InputText, Button, DataTable, Column } from 'primevue'

  import PopUpCategory from '../components/PopUpCategory.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  import { api } from '../api'
  import type { ICategory, ICategoryForm, ICategoryItem } from '../types'

  const { showPopUp: showPopUpCategory, openPopUp: openPopUpCategory, loading: loadingPopUpCategory } = usePopUp()
  const {
    showPopUp: showPopUpDeleteCategory,
    openPopUp: openPopUpDeleteCategory,
    closePopUp: closePopUpDeleteCategory,
    loading: loadingPopUpDeleteCategory
  } = usePopUp()

  const router = useRouter()

  const search = ref('')
  const categories = ref<ICategory[]>([])

  onMounted(() => {
    getCategories()
  })

  const selectedCategory = ref<ICategoryItem | null>(null)
  function selectCategory(item: ICategoryItem) {
    selectedCategory.value = item
    openPopUpCategory()
  }
  function closePopUpCategory() {
    selectedCategory.value = null
    showPopUpCategory.value = false
  }

  function onRowClick({ data }: { data: ICategoryItem }) {
    router.push(`/motorcycle-settings/category/${data.id}/brands`)
  }

  function openCategoryParameters(data: ICategoryItem) {
    router.push(`/motorcycle-settings/category/${data.id}/parameters`)
  }

  async function getCategories() {
    try {
      const data: ICategory[] = await api.getCategories()

      categories.value = data.map((category: ICategory, index: number): ICategoryItem => {
        return {
          index: index + 1,
          ...category
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function saveCategory(form: ICategoryForm) {
    try {
      loadingPopUpCategory.value = true
      if (selectedCategory.value) {
        await api.updateCategory({ id: selectedCategory.value.id, data: form })
      } else {
        await api.createCategory({ data: form })
      }
      await getCategories()
      closePopUpCategory()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpCategory.value = false
    }
  }

  const selectedDeleteCategory = ref<ICategoryItem>()
  function selectDeleteCategory(item: ICategoryItem) {
    selectedDeleteCategory.value = item
    openPopUpDeleteCategory()
  }

  async function deleteCategory() {
    try {
      loadingPopUpDeleteCategory.value = true
      if (selectedDeleteCategory.value) {
        await api.deleteCategory({ id: selectedDeleteCategory.value.id })
      }
      await getCategories()
      closePopUpDeleteCategory()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpDeleteCategory.value = false
    }
  }
</script>
