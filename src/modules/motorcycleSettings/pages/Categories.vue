<template>
	<div class="h-full flex flex-col">
		<div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
			<Button @click="openPopUpCategory" icon="pi pi-plus" :label="t('motorcycleSettings.category.add')" />
		</div>
		<div class="flex-1 overflow-y-auto">
			<DataTable :value="categories" stripedRows size="small">
				<Column field="index" header="№" class="w-9"></Column>
				<Column field="name" :header="t('base.name')"></Column>
				<Column :header="t('base.actions')" class="w-24">
					<template #body="slotProps">
						<div class="flex gap-1">
							<Button @click.stop="selectCategory(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
							<Button @click.stop="selectDeleteCategory(slotProps.data)" icon="pi pi-trash" severity="danger" rounded
								variant="outlined" />
						</div>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
	<PopUpCategory v-if="showPopUpCategory" @save="saveCategory" @cancel="closePopUpCategory"
		:loading="loadingPopUpCategory" :item="selectedCategory" />
	<PopUpConfirmDelete v-if="showPopUpDeleteCategory" @delete="deleteCategory" @cancel="closePopUpDeleteCategory"
		:loading="loadingPopUpDeleteCategory" :description="t('motorcycleSettings.category.confirmDelete')" />
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { Button, DataTable, Column } from 'primevue'
	import { useI18n } from 'vue-i18n'

	import PopUpCategory from '../components/PopUpCategory.vue'
	import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
	import { usePopUp } from '@/shared/lib/use/usePopUp'

	import { api } from '../api'
	import type { ICategory, ICategoryForm, ICategoryItem } from '../types'

	const { t } = useI18n()

	const { showPopUp: showPopUpCategory, openPopUp: openPopUpCategory, loading: loadingPopUpCategory } = usePopUp()
	const {
		showPopUp: showPopUpDeleteCategory,
		openPopUp: openPopUpDeleteCategory,
		closePopUp: closePopUpDeleteCategory,
		loading: loadingPopUpDeleteCategory
	} = usePopUp()


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
