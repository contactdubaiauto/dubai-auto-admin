<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full">
				<Button @click="openPopUpModel" icon="pi pi-plus" :label="t('motorcycleSettings.model.add')" />
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
			<DataTable :value="models" :loading="loadingModels" stripedRows rowHover size="small">
				<Column field="index" header="№" class="w-9"></Column>
				<Column :header="t('base.name')">
					<template #body="slotProps">
						{{ getDataByLang({ data: slotProps.data }) }}
					</template>
				</Column>
				<Column :header="t('base.actions')" class="w-24">
					<template #body="slotProps">
						<div class="flex gap-1">
							<Button @click.stop="selectModel(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined"
								size="small" />
							<Button @click.stop="selectDeleteModel(slotProps.data)" icon="pi pi-trash" severity="danger" rounded
								variant="outlined" size="small" />
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
	<PopUpModel v-if="showPopUpModel" @save="saveModel" @cancel="closePopUpModel" :loading="loadingPopUpModel"
		:item="selectedModel" />
	<PopUpConfirmDelete v-if="showPopUpDeleteModel" @delete="deleteModel" @cancel="closePopUpDeleteModel"
		:loading="loadingPopUpDeleteModel" :description="t('motorcycleSettings.model.confirmDelete')" />
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { useToast } from 'primevue/usetoast'
	import { useRoute } from 'vue-router'
	import { Button, DataTable, Column, Breadcrumb } from 'primevue'

	import PopUpModel from '../components/PopUpModel.vue'
	import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'

	import { usePopUp } from '@/shared/lib/use/usePopUp'
	import { api } from '../api'
	import type { IModel, IModelForm, IModelItem } from '../types'
	import { useLang } from '@/shared/lib/use/useLang'

	const { showPopUp: showPopUpModel, openPopUp: openPopUpModel, loading: loadingPopUpModel } = usePopUp()
	const {
		showPopUp: showPopUpDeleteModel,
		openPopUp: openPopUpDeleteModel,
		closePopUp: closePopUpDeleteModel,
		loading: loadingPopUpDeleteModel
	} = usePopUp()

	const route = useRoute()
	const { t } = useI18n()
	const { getDataByLang } = useLang()
	const toast = useToast()

	const brandId = Number(route.params.brand) as number

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.motorcycleSettings') },
		{ label: t('motorcycleSettings.brand.title'), to: '/motorcycle-settings/brands' },
		{ label: t('motorcycleSettings.model.models'), to: `/motorcycle-settings/brand/${brandId}/models` }
	])

	onMounted(() => {
		getModels()
	})

	const models = ref<IModelItem[]>([])
	const loadingModels = ref(false)
	async function getModels() {
		try {
			loadingModels.value = true
			const data: IModel[] = await api.getBrandModels({ id: brandId })

			models.value = data.map((model: IModel, index: number): IModelItem => {
				return {
					...model,
					index: index + 1
				}
			})
		} catch (error) {
			console.error(error)
		} finally {
			loadingModels.value = false
		}
	}

	const selectedModel = ref<IModelItem | null>(null)
	function selectModel(item: IModelItem) {
		selectedModel.value = item
		openPopUpModel()
	}
	function closePopUpModel() {
		selectedModel.value = null
		showPopUpModel.value = false
	}

	async function saveModel(form: IModelForm) {
		try {
			loadingPopUpModel.value = true
			if (selectedModel.value) {
				await api.updateModel({
					id: selectedModel.value.id,
					data: {
						...form,
						moto_brand_id: brandId
					}
				})
				toast.add({ severity: 'success', summary: t('toast.successUpdated'), life: 3000 })
			} else {
				await api.createModel({
					data: {
						...form,
						moto_brand_id: brandId
					}
				})
				toast.add({ severity: 'success', summary: t('toast.successSaved'), life: 3000 })
			}
			await getModels()
			closePopUpModel()
		} catch (error) {
			console.error(error)
			toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
		} finally {
			loadingPopUpModel.value = false
		}
	}

	const selectedDeleteModel = ref<IModelItem>()
	function selectDeleteModel(item: IModelItem) {
		selectedDeleteModel.value = item
		openPopUpDeleteModel()
	}

	async function deleteModel() {
		try {
			loadingPopUpDeleteModel.value = true
			if (selectedDeleteModel.value) {
				await api.deleteModel({ id: selectedDeleteModel.value.id })
				toast.add({ severity: 'success', summary: t('toast.successDeleted'), life: 3000 })
			}
			await getModels()
			closePopUpDeleteModel()
		} catch (error) {
			console.error(error)
			toast.add({ severity: 'error', summary: t('base.error'), detail: t('toast.errorSaving'), life: 3000 })
		} finally {
			loadingPopUpDeleteModel.value = false
		}
	}
</script>
