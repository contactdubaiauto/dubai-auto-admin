<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
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
			<DataTable :value="reports" :loading="loadingReports" rowHover stripedRows @row-click="onRowClick">
				<Column field="index" header="№" class="w-9"></Column>
				<Column field="created_at" :header="t('report.createdAt')">
					<template #body="{ data }">
						{{ formatDate(data.created_at) }}
					</template>
				</Column>
				<Column field="report_description" :header="t('report.description')"></Column>
				<Column field="report_type" :header="t('report.reportType')">
					<template #body="{ data }">
						{{ getReportTypeLabel(data.report_type) }}
					</template>
				</Column>
				<Column field="item_type" :header="t('report.itemType')">
					<template #body="{ data }">
						{{ getItemTypeLabel(data.item_type) }}
					</template>
				</Column>
				<Column field="item" :header="t('report.item')">
					<template #body="{ data }">
						<div v-if="data.item" class="flex items-center gap-2">
							<div class="w-24 min-w-24 h-16 bg-gray-100 rounded overflow-hidden">
								<img v-if="data.item.images && data.item.images.length > 0" :src="`${data.item.images[0]}_l.jpg`"
									:alt="getItemDisplayName(data)" class="w-full h-full object-cover" />
								<div v-else class="w-full h-full flex items-center justify-center text-gray-400">
									<span class="pi pi-image text-xl"></span>
								</div>
							</div>
							<div>
								<div>
									<router-link v-if="data.item_type && data.item.id" :to="getItemLink(data)"
										class="text-blue-600 hover:text-blue-800 hover:underline">
										{{ getItemDisplayName(data) }}
									</router-link>
									<span v-else>{{ getItemDisplayName(data) }}</span>
								</div>
								<div>
									{{ getItemPrice(data) }}
								</div>
							</div>
						</div>
						<span v-else>-</span>
					</template>
				</Column>
				<Column field="reported_user" :header="t('report.reportedUser')">
					<template #body="{ data }">
						<div v-if="data.reported_user">
							<div>{{ data.reported_user.username || '-' }}</div>
							<div class="text-xs text-gray-500 mt-1">
								{{ getUserContact(data.reported_user) }}
							</div>
						</div>
						<span v-else>-</span>
					</template>
				</Column>
				<Column field="reporter" :header="t('report.reporter')">
					<template #body="{ data }">
						<div v-if="data.reporter">
							<div>{{ data.reporter.username || '-' }}</div>
							<div class="text-xs text-gray-500 mt-1">
								{{ getUserContact(data.reporter) }}
							</div>
						</div>
						<span v-else>-</span>
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
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import moment from 'moment'
	import { DataTable, Column, Breadcrumb } from 'primevue'

	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'

	import { api } from '../api'
	import type { IReport } from '../types'

	const router = useRouter()
	const { t } = useI18n()

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.reports') }
	])

	onMounted(() => {
		getReports()
	})

	const reports = ref<IReport[]>([])
	const loadingReports = ref(false)

	async function getReports() {
		try {
			loadingReports.value = true
			const data: IReport[] = await api.getReports()

			reports.value = data.map((report: IReport, index: number): IReport & { index: number } => {
				return {
					index: index + 1,
					...report
				}
			})
		} catch (error) {
			console.error(error)
		} finally {
			loadingReports.value = false
		}
	}

	function formatDate(date: string) {
		return date ? moment(date).format('DD.MM.YYYY HH:mm') : '-'
	}

	function getReportTypeLabel(reportType: string): string {
		try {
			return t(`report.reportTypes.${reportType}`) || reportType
		} catch (e) {
			return reportType
		}
	}

	function getItemTypeLabel(itemType: string | null): string {
		if (!itemType) {
			return t('report.userComplaint')
		}
		const typeMap: Record<string, string> = {
			car: 'automobile',
			comtran: 'comtrans',
			motorcycle: 'moto'
		}
		const mappedType = typeMap[itemType] || itemType
		try {
			return t(`report.itemTypes.${mappedType}`) || mappedType
		} catch (e) {
			return mappedType
		}
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price)
	}

	function getUserContact(user: { email?: string | null; phone?: string | null }): string {
		if (user.email) {
			return user.email
		}
		if (user.phone) {
			return user.phone
		}
		return '-'
	}

	function getItemDisplayName(data: IReport): string {
		if (!data.item) {
			return '-'
		}
		if (data.item_type === 'motorcycle') {
			return `${(data.item as any).moto_brand || ''}, ${(data.item as any).moto_model || ''}`
		}
		if (data.item_type === 'truck') {
			return `${(data.item as any).comtran_brand || ''}, ${(data.item as any).comtran_model || ''}`
		}
		return `${data.item.brand || ''}, ${data.item.model || ''}`
	}

	function getItemPrice(data: IReport): string {
		if (!data.item || !data.item.price) {
			return '-'
		}
		return formatPrice(data.item.price)
	}

	function getItemLink(data: IReport): string {
		if (!data.item || !data.item.id || !data.item_type) {
			return '#'
		}
		const typeMap: Record<string, string> = {
			car: 'cars',
			moto: 'motorcycles',
			motorcycle: 'motorcycles',
			comtran: 'trucks',
			truck: 'trucks'
		}
		const routeType = typeMap[data.item_type] || data.item_type
		return `/publications/${routeType}/${data.item.id}`
	}

	function onRowClick(event: any) {
		const report = event.data as IReport
		if (report && report.item && report.item.id && report.item_type) {
			const link = getItemLink(report)
			if (link !== '#') {
				router.push(link)
			}
		}
	}
</script>

<style scoped></style>
