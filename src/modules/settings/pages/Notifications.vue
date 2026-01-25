<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full">
				<Button @click="openPopUpNotification" icon="pi pi-plus" :label="t('settings.notification.send')" />
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
			<DataTable :value="notifications" :loading="loadingNotifications" rowHover stripedRows size="small">
				<Column field="index" header="№" class="w-9"></Column>
				<Column field="title" :header="t('settings.notification.title')"></Column>
				<Column :header="t('settings.notification.description')">
					<template #body="slotProps">
						{{ getDescriptionPreview(slotProps.data.description) }}
					</template>
				</Column>
				<Column :header="t('settings.notification.recipients')">
					<template #body="{ data }">
						{{ getRoleLabel(data.user_role_id) }}
					</template>
				</Column>
				<Column field="created_at" :header="t('settings.notification.createdAt')">
					<template #body="{ data }">
						{{ formatDate(data.created_at) }}
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
	<PopUpNotification v-if="showPopUpNotification" @save="sendNotification" @cancel="closePopUpNotification"
		:loading="loadingPopUpNotification" />
	<Toast />
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useI18n } from 'vue-i18n'
	import moment from 'moment'
	import { Button, DataTable, Column, Breadcrumb, Toast } from 'primevue'
	import { useToast } from 'primevue/usetoast'

	import PopUpNotification from '../components/PopUpNotification.vue'
	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'

	import { usePopUp } from '@/shared/lib/use/usePopUp'
	import { api } from '../api'
	import type { INotification, INotificationForm } from '../types'

	const { showPopUp: showPopUpNotification, openPopUp: openPopUpNotification, loading: loadingPopUpNotification } = usePopUp()

	const { t } = useI18n()
	const toast = useToast()

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.settings') },
		{ label: t('settings.notification.notifications') }
	])

	interface INotificationItem extends INotification {
		index: number
	}

	const notifications = ref<INotificationItem[]>([])

	onMounted(() => {
		getNotifications()
	})

	const loadingNotifications = ref(false)

	async function getNotifications() {
		try {
			loadingNotifications.value = true
			const data: any[] = await api.getNotifications()

			notifications.value = data.map((notification: any, index: number): INotificationItem => {
				return {
					id: notification.id,
					title: notification.title,
					description: notification.message || notification.description || '',
					role_id: notification.user_role_id ?? notification.role_id ?? 0,
					user_role_id: notification.user_role_id ?? notification.role_id ?? 0,
					created_at: notification.created_at,
					index: index + 1
				}
			})
		} catch (error) {
			console.error(error)
			toast.add({
				severity: 'error',
				summary: t('base.error'),
				detail: 'Failed to load notifications',
				life: 3000
			})
		} finally {
			loadingNotifications.value = false
		}
	}

	function closePopUpNotification() {
		showPopUpNotification.value = false
	}

	async function sendNotification(form: INotificationForm) {
		try {
			loadingPopUpNotification.value = true
			await api.sendNotification({ data: form })
			toast.add({
				severity: 'success',
				summary: t('settings.notification.successSent'),
				life: 3000
			})
			await getNotifications()
			closePopUpNotification()
		} catch (error) {
			console.error(error)
			toast.add({
				severity: 'error',
				summary: t('base.error'),
				detail: 'Failed to send notification',
				life: 3000
			})
		} finally {
			loadingPopUpNotification.value = false
		}
	}

	function formatDate(date: string) {
		return date ? moment(date).format('DD.MM.YYYY HH:mm') : '-'
	}

	function getDescriptionPreview(description: string): string {
		if (!description) return '-'
		// Сокращаем текст до 50 символов
		if (description.length > 50) {
			return description.substring(0, 50) + '...'
		}
		return description
	}

	function getRoleLabel(roleId: number): string {
		switch (roleId) {
			case 0:
				return t('settings.notification.all')
			case 1:
				return t('settings.notification.user')
			case 2:
				return t('settings.notification.dealer')
			case 3:
				return t('settings.notification.logistic')
			case 4:
				return t('settings.notification.broker')
			case 5:
				return t('settings.notification.carService')
			default:
				return '-'
		}
	}
</script>

<style scoped></style>
