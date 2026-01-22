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
			<DataTable :value="reports" :loading="loadingReports" rowHover stripedRows>
				<Column field="index" header="№" class="w-9"></Column>
				<Column field="id" :header="t('report.id')" class="w-20"></Column>
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
				<Column field="report_status" :header="t('report.status')"></Column>
				<Column field="reported_user" :header="t('report.reportedUser')">
					<template #body="{ data }">
						{{ data.reported_user?.username || '-' }}
					</template>
				</Column>
				<Column field="reporter" :header="t('report.reporter')">
					<template #body="{ data }">
						{{ data.reporter?.username || '-' }}
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
	import { useI18n } from 'vue-i18n'
	import moment from 'moment'
	import { DataTable, Column, Breadcrumb } from 'primevue'

	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'

	import { api } from '../api'
	import type { IReport } from '../types'

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
</script>

<style scoped></style>
