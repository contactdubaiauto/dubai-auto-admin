<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full items-center">
				<Button @click="goBack" icon="pi pi-arrow-left" :label="t('publications.motorcycleDetail.back')"
					severity="secondary" />
				<div class="flex items-center gap-2">
					<div v-if="motorcycle" class="text-sm text-gray-700 font-semibold">
						<span :class="[
							'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
							motorcycle.moderation_status === 1 ? 'bg-yellow-100 text-yellow-800' :
								motorcycle.moderation_status === 2 ? 'bg-green-100 text-green-800' :
									motorcycle.moderation_status === 3 ? 'bg-red-100 text-red-800' :
										'bg-gray-100 text-gray-800'
						]">
							{{ getStatusLabel(motorcycle.moderation_status) }}
						</span>
					</div>
					<Button @click="openPopUpModerate" :label="t('publications.moderate')" />
					<Button @click="confirmDelete" :label="t('base.delete')" severity="danger" />
				</div>
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
		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="loading" class="flex justify-center items-center h-full">
				<LoadingState />
			</div>
			<div v-else-if="motorcycle" class="max-w-4xl mx-auto">
				<div class="mb-6">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<template v-if="motorcycle.images && motorcycle.images.length > 0">
							<div v-for="(image, index) in motorcycle.images.slice(0, 4)" :key="index" class="relative"
								style="aspect-ratio: 4 / 3; background-color: #f3f4f6; border-radius: 0.5rem; overflow: hidden;">
								<img :src="`${image}_l.jpg`" :alt="`${motorcycle.moto_brand} ${motorcycle.moto_model} - ${index + 1}`"
									class="w-full h-full object-cover" style="aspect-ratio: 4 / 3;" />
							</div>
						</template>
						<template v-else>
							<div class="relative flex items-center justify-center text-gray-600"
								style="aspect-ratio: 4 / 3; background-color: #f3f4f6; border-radius: 0.5rem; overflow: hidden;">
								<span class="pi pi-image text-4xl"></span>
							</div>
						</template>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.user') }}</div>
						<div class="flex items-center gap-2 mb-4">
							<div v-if="motorcycle.owner.avatar" class="w-8 h-8 rounded-full overflow-hidden">
								<img :src="`${motorcycle.owner.avatar}_l.jpg`" :alt="motorcycle.owner.username || ''"
									class="w-full h-full object-cover" />
							</div>
							<div v-else class="w-8	 h-8 rounded-full bg-gray-200 flex items-center justify-center">
								<span class="text-l text-gray-600">{{ (motorcycle.owner.username || 'U').slice(0, 1).toUpperCase()
									}}</span>
							</div>
							<div>
								<div v-if="motorcycle.owner.username" class="font-semibold text-gray-800">{{ motorcycle.owner.username
									}}
								</div>
							</div>
						</div>
					</div>
					<div v-if="motorcycle.owner.role_id">
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.userRole') }}</div>
						<div class="font-semibold text-gray-800">{{ getRoleLabel(motorcycle.owner.role_id) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.city') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.city }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.status') }}</div>
						<div class="font-semibold text-gray-800">{{ getStatusLabel(Number(motorcycle.status)) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.price') }}</div>
						<div class="font-semibold text-gray-800">{{ formatPrice(motorcycle.price) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.vinCode') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.vin_code }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.brand') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.moto_brand }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.model') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.moto_model }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.year') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.year }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.motorcycleCategory') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.moto_category }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.milage') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.odometer }} {{ t('publications.km') }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.engineType') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.engine_type }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.engineSm') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.engine }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.power') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.power }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.numberOfCycles') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.number_of_cycles }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.color') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.color }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.crash') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.crash ? t('publications.yes') : t('publications.no')
							}}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.wheel') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.wheel ? t('publications.yes') : t('publications.no')
							}}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.tradeIn') }}</div>
						<div class="font-semibold text-gray-800">{{ getTradeInLabel(motorcycle.trade_in) }}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.owners') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.owners }}
						</div>
					</div>
					<div class="col-span-2">
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.description') }}</div>
						<div class="font-semibold text-gray-800">{{ motorcycle.description }}</div>
					</div>
				</div>
			</div>
			<div v-else class="flex justify-center items-center h-full">
				<EmptyState />
			</div>
		</div>
		<PopUpModerate v-if="showPopUpModerate" @save="moderateMotorcycle" @cancel="closePopUpModerate"
			:loading="loadingPopUpModerate" />
		<ConfirmPopup></ConfirmPopup>
		<Toast></Toast>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { Button, Breadcrumb, ConfirmPopup, Toast } from 'primevue'
	import { useConfirm } from 'primevue/useconfirm'
	import { useToast } from 'primevue/usetoast'

	import EmptyState from '@/components/EmptyState.vue'
	import LoadingState from '@/components/LoadingState.vue'
	import PopUpModerate from '../components/PopUpModerate.vue'

	import { api } from '../api'
	import type { IMotorcycle } from '../types'
	import { usePopUp } from '@/shared/lib/use/usePopUp'

	const router = useRouter()
	const route = useRoute()
	const { t } = useI18n()

	const {
		showPopUp: showPopUpModerate,
		openPopUp: openPopUpModerate,
		closePopUp: closePopUpModerate,
		loading: loadingPopUpModerate
	} = usePopUp()

	const confirm = useConfirm()
	const toast = useToast()

	const motorcycle = ref<IMotorcycle | null>(null)
	const loading = ref(false)

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.publications') },
		{ label: t('publications.motorcycles'), to: '/publications/motorcycles' },
		{ label: motorcycle.value ? `${motorcycle.value.moto_brand} ${motorcycle.value.moto_model}` : t('publications.motorcycleDetail.back') }
	])

	onMounted(() => {
		getMotorcycle()
	})

	async function getMotorcycle() {
		try {
			loading.value = true
			const motorcycleId = route.params.id as string
			const data: IMotorcycle = await api.getMotorcycle({ id: motorcycleId })
			motorcycle.value = data
		} catch (error) {
			console.error('Ошибка при загрузке мотоцикла:', error)
		} finally {
			loading.value = false
		}
	}

	function goBack() {
		router.back()
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(price)
	}

	function getStatusLabel(status: number | string): string {
		const statusNum = typeof status === 'string' ? Number(status) : status
		const statusMap: Record<number, string> = {
			1: t('publications.moderationStatus.pending'),
			2: t('publications.moderationStatus.accept'),
			3: t('publications.moderationStatus.decline')
		}
		return statusMap[statusNum] || String(status)
	}
	function getRoleLabel(roleId: number): string {
		const roleMap: Record<number, string> = {
			1: t('publications.role.user'),
			2: t('publications.role.dealer')
		}
		return roleMap[roleId] || String(roleId)
	}

	function getTradeInLabel(tradeIn: number): string {
		const tradeInMap: Record<number, string> = {
			1: t('publications.tradeInOptions.noExchange'),
			2: t('publications.tradeInOptions.equalValue'),
			3: t('publications.tradeInOptions.moreExpensive'),
			4: t('publications.tradeInOptions.cheaper'),
			5: t('publications.tradeInOptions.notACar'),
		}
		return tradeInMap[tradeIn] || String(tradeIn)
	}

	function confirmDelete(event: any) {
		confirm.require({
			target: event.currentTarget,
			message: t('publications.confirmDeleteMotorcycle'),
			icon: 'pi pi-exclamation-triangle',
			rejectProps: {
				label: t('base.cancel'),
				severity: 'secondary',
				outlined: true
			},
			acceptProps: {
				label: t('base.delete'),
				severity: 'danger'
			},
			accept: () => deleteMotorcycle()
		})
	}

	async function deleteMotorcycle() {
		if (!motorcycle.value) return

		try {
			const motorcycleId = route.params.id as string
			await api.deleteMotorcycle({ id: motorcycleId })
			toast.add({
				severity: 'success',
				summary: t('toast.successDeleted'),
				life: 3000
			})
			router.back()
		} catch (error) {
			console.error('Ошибка при удалении мотоцикла:', error)
			toast.add({
				severity: 'error',
				summary: t('base.error'),
				detail: t('toast.errorSaving'),
				life: 3000
			})
		}
	}

	async function moderateMotorcycle(formData: { status: number; title?: string; description?: string }) {
		if (!motorcycle.value) return

		try {
			loadingPopUpModerate.value = true
			const motorcycleId = route.params.id as string
			await api.moderateMotorcycle({
				data: {
					id: Number(motorcycleId),
					status: formData.status,
					title: formData.title,
					description: formData.description
				}
			})
			toast.add({
				severity: 'success',
				summary: t('publications.moderationSuccess'),
				life: 3000
			})
			closePopUpModerate()
			await getMotorcycle()
		} catch (error) {
			console.error('Ошибка при модерации мотоцикла:', error)
			toast.add({
				severity: 'error',
				summary: t('base.error'),
				detail: t('toast.errorSaving'),
				life: 3000
			})
		} finally {
			loadingPopUpModerate.value = false
		}
	}
</script>

<style scoped></style>
