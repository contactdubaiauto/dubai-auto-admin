<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full">
				<Button @click="openPopUpStroke" icon="pi pi-plus" :label="t('motorcycleSettings.stroke.add')" />
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
			<DataTable :value="strokes" stripedRows size="small">
				<Column field="index" header="№" class="w-9"></Column>
				<Column field="name" :header="t('base.name')"></Column>
				<Column :header="t('base.actions')" class="w-24">
					<template #body="slotProps">
						<div class="flex gap-1">
							<Button @click.stop="selectStroke(slotProps.data)" icon="pi pi-pencil" rounded variant="outlined" />
							<Button @click.stop="selectDeleteStroke(slotProps.data)" icon="pi pi-trash" severity="danger" rounded
								variant="outlined" />
						</div>
					</template>
				</Column>
			</DataTable>
		</div>
	</div>
	<PopUpStroke v-if="showPopUpStroke" @save="saveStroke" @cancel="closePopUpStroke" :loading="loadingPopUpStroke"
		:item="selectedStroke" />
	<PopUpConfirmDelete v-if="showPopUpDeleteStroke" @delete="deleteStroke" @cancel="closePopUpDeleteStroke"
		:loading="loadingPopUpDeleteStroke" :description="t('motorcycleSettings.stroke.confirmDelete')" />
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { Button, DataTable, Column, Breadcrumb } from 'primevue'
	import { useI18n } from 'vue-i18n'

	import PopUpStroke from '../components/PopUpStroke.vue'
	import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
	import { usePopUp } from '@/shared/lib/use/usePopUp'

	import { api } from '../api'
	import type { IStroke, IStrokeForm, IStrokeItem } from '../types'

	const { t } = useI18n()

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.motorcycleSettings') },
		{ label: t('motorcycleSettings.stroke.strokes'), to: '/motorcycle-settings/strokes' }
	])

	const { showPopUp: showPopUpStroke, openPopUp: openPopUpStroke, loading: loadingPopUpStroke } = usePopUp()
	const {
		showPopUp: showPopUpDeleteStroke,
		openPopUp: openPopUpDeleteStroke,
		closePopUp: closePopUpDeleteStroke,
		loading: loadingPopUpDeleteStroke
	} = usePopUp()

	const strokes = ref<IStroke[]>([])

	onMounted(() => {
		getStrokes()
	})

	const selectedStroke = ref<IStrokeItem | null>(null)
	function selectStroke(item: IStrokeItem) {
		selectedStroke.value = item
		openPopUpStroke()
	}
	function closePopUpStroke() {
		selectedStroke.value = null
		showPopUpStroke.value = false
	}

	async function getStrokes() {
		try {
			const data: IStroke[] = await api.getStrokes()

			strokes.value = data.map((stroke: IStroke, index: number): IStrokeItem => {
				return {
					index: index + 1,
					...stroke
				}
			})
		} catch (error) {
			console.error(error)
		}
	}

	async function saveStroke(form: IStrokeForm) {
		try {
			loadingPopUpStroke.value = true
			if (selectedStroke.value) {
				await api.updateStroke({ id: selectedStroke.value.id, data: form })
			} else {
				await api.createStroke({ data: form })
			}
			await getStrokes()
			closePopUpStroke()
		} catch (error) {
			console.error(error)
		} finally {
			loadingPopUpStroke.value = false
		}
	}

	const selectedDeleteStroke = ref<IStrokeItem>()
	function selectDeleteStroke(item: IStrokeItem) {
		selectedDeleteStroke.value = item
		openPopUpDeleteStroke()
	}

	async function deleteStroke() {
		try {
			loadingPopUpDeleteStroke.value = true
			if (selectedDeleteStroke.value) {
				await api.deleteStroke({ id: selectedDeleteStroke.value.id })
			}
			await getStrokes()
			closePopUpDeleteStroke()
		} catch (error) {
			console.error(error)
		} finally {
			loadingPopUpDeleteStroke.value = false
		}
	}
</script>
