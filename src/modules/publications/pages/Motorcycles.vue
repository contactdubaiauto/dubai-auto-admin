<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full items-center">
				<Select v-model="moderationStatus" :options="moderationStatusOptions" optionLabel="label" optionValue="value"
					:placeholder="t('publications.selectModerationStatus')" class="w-64" @change="onModerationStatusChange" />
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
		<div ref="motorcyclesContainer" class="flex-1 overflow-y-auto" @scroll="handleScroll">
			<DataTable :value="motorcycles" :loading="loading" rowHover stripedRows size="small" @row-click="onRowClick">
				<Column field="id" header="ID" class="w-10"></Column>
				<Column :header="t('publications.motorcycleDetail.info')" class="w-46">
					<template #body="slotProps">
						<div class="flex items-center gap-2">
							<div class="w-24 h-16 bg-gray-100 rounded overflow-hidden">
								<img v-if="slotProps.data.images && slotProps.data.images.length > 0"
									:src="`${slotProps.data.images[0]}_l.jpg`" :alt="`${slotProps.data.brand} ${slotProps.data.model}`"
									class="w-full h-full object-cover" />
								<div v-else class="w-full h-full flex items-center justify-center text-gray-400">
									<span class="pi pi-image text-xl"></span>
								</div>
							</div>
							<div>
								<div>
									{{ slotProps.data.brand }}, {{ slotProps.data.model }}
								</div>
								<div>
									{{ formatPrice(slotProps.data.price) }}
								</div>
							</div>
						</div>
					</template>
				</Column>
				<Column :header="t('publications.motorcycleDetail.user')">
					<template #body="slotProps">
						<div class="flex items-center gap-2">
							<div v-if="slotProps.data.user_avatar" class="w-6 h-6 rounded-full overflow-hidden">
								<img :src="`${slotProps.data.user_avatar}_l.jpg`" :alt="slotProps.data.user_name || ''"
									class="w-full h-full object-cover" />
							</div>
							<div v-else class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
								<span class="text-xs text-gray-600">
									{{ (slotProps.data.user_name || slotProps.data.user_phone || 'U').charAt(0).toUpperCase() }}
								</span>
							</div>
							<div>
								<div class="font-semibold">{{ slotProps.data.user_name }}</div>
								<div class="text-xs text-gray-500 mt-1">{{ slotProps.data.user_phone }}</div>
							</div>
						</div>
					</template>
				</Column>
				<Column :header="t('publications.userRole')">
					<template #body="slotProps">
						{{ getUserRoleLabel(slotProps.data.user_role_id) }}
					</template>
				</Column>
				<Column :header="t('publications.motorcycleDetail.status')">
					<template #body="slotProps">
						<span :class="[
							'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
							slotProps.data.moderation_status === 1 ? 'bg-yellow-100 text-yellow-800' :
								slotProps.data.moderation_status === 2 ? 'bg-green-100 text-green-800' :
									slotProps.data.moderation_status === 3 ? 'bg-red-100 text-red-800' :
										'bg-gray-100 text-gray-800'
						]">
							{{ getStatusLabel(slotProps.data.moderation_status) }}
						</span>
					</template>
				</Column>
				<template #loading>
					<LoadingState />
				</template>
				<template #empty>
					<EmptyState />
				</template>
			</DataTable>
			<div v-if="loadingMore" class="p-4 flex justify-center">
				<LoadingState />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { Select, Breadcrumb, DataTable, Column } from 'primevue'

	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'

	import { api } from '../api'
	import type { IMotorcycle } from '../types'

	const router = useRouter()
	const { t } = useI18n()

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.publications') },
		{ label: t('publications.motorcycles'), to: '/publications/motorcycles' }
	])

	const motorcycles = ref<IMotorcycle[]>([])
	const loading = ref(false)
	const loadingMore = ref(false)
	const moderationStatus = ref<number>(0)
	const lastId = ref<number | null>(null)
	const hasMore = ref(true)
	const motorcyclesContainer = ref<HTMLElement | null>(null)

	const moderationStatusOptions = computed(() => [
		{ label: t('publications.moderationStatus.all'), value: 0 },
		{ label: t('publications.moderationStatus.pending'), value: 1 },
		{ label: t('publications.moderationStatus.accept'), value: 2 },
		{ label: t('publications.moderationStatus.decline'), value: 3 }
	])

	onMounted(() => {
		getMotorcycles()
	})

	async function getMotorcycles() {
		if (loading.value || loadingMore.value) return

		try {
			if (lastId.value === null) {
				loading.value = true
			} else {
				loadingMore.value = true
			}

			const params: any = {
				limit: 50,
				last_id: lastId.value
			}

			if (moderationStatus.value !== 0) {
				params.moderation_status = moderationStatus.value
			}

			const data: IMotorcycle[] = await api.getMotorcycles({ params })

			if (data && data.length > 0) {
				if (lastId.value === null) {
					motorcycles.value = data
				} else {
					motorcycles.value = [...motorcycles.value, ...data]
				}

				if (data.length < 50) {
					hasMore.value = false
				} else {
					lastId.value = data[data.length - 1].id
				}
			} else {
				hasMore.value = false
			}
		} catch (error) {
			console.error('Error on get motorcycles:', error)
		} finally {
			loading.value = false
			loadingMore.value = false
		}
	}

	function onModerationStatusChange() {
		lastId.value = null
		motorcycles.value = []
		hasMore.value = true
		getMotorcycles()
	}

	function handleScroll() {
		if (!motorcyclesContainer.value || loading.value || loadingMore.value || !hasMore.value) {
			return
		}

		const container = motorcyclesContainer.value
		const scrollTop = container.scrollTop
		const scrollHeight = container.scrollHeight
		const clientHeight = container.clientHeight

		if (scrollTop + clientHeight >= scrollHeight - 100) {
			getMotorcycles()
		}
	}

	function onRowClick(event: any) {
		const motorcycle = event.data as IMotorcycle
		if (motorcycle && motorcycle.id) {
			router.push(`/publications/motorcycles/${motorcycle.id}`)
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price)
	}

	function getStatusLabel(status: number): string {
		const statusMap = {
			1: t('publications.moderationStatus.pending'),
			2: t('publications.moderationStatus.accept'),
			3: t('publications.moderationStatus.decline')
		} as Record<number, string>
		return statusMap[status]
	}

	function getUserRoleLabel(userRoleId: number): string {
		const userRoleMap = {
			1: t('publications.role.user'),
			2: t('publications.role.dealer')
		} as Record<number, string>
		return userRoleMap[userRoleId]
	}
</script>

<style scoped></style>
