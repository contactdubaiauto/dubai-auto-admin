<template>
	<div class="h-full flex flex-col">
		<div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
			<div class="flex justify-between w-full items-center">
				<Button @click="goBack" icon="pi pi-arrow-left" :label="t('publications.carDetail.back')"
					severity="secondary" />
				<div class="flex items-center gap-2">
					<div v-if="car" class="text-sm text-gray-700 font-semibold">
						<span :class="[
							'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
							car.moderation_status === 1 ? 'bg-yellow-100 text-yellow-800' :
								car.moderation_status === 2 ? 'bg-green-100 text-green-800' :
									car.moderation_status === 3 ? 'bg-red-100 text-red-800' :
										'bg-gray-100 text-gray-800'
						]">
							{{ getStatusLabel(car.moderation_status) }}
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
			<div v-else-if="car" class="max-w-4xl mx-auto">
				<div class="mb-6">
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<template v-if="car.images && car.images.length > 0">
							<div v-for="(image, index) in car.images.slice(0, 4)" :key="index" class="relative"
								style="aspect-ratio: 4 / 3; background-color: #f3f4f6; border-radius: 0.5rem; overflow: hidden;">
								<img :src="`${image}_l.jpg`" :alt="`${car.brand} ${car.model} - ${index + 1}`"
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
							<div v-if="car.owner.avatar" class="w-8 h-8 rounded-full overflow-hidden">
								<img :src="`${car.owner.avatar}_l.jpg`" :alt="car.owner.username || ''"
									class="w-full h-full object-cover" />
							</div>
							<div v-else class="w-8	 h-8 rounded-full bg-gray-200 flex items-center justify-center">
								<span class="text-l text-gray-600">{{ (car.owner.username || 'U').slice(0, 1).toUpperCase() }}</span>
							</div>
							<div>
								<div v-if="car.owner.username" class="font-semibold text-gray-800">{{ car.owner.username }}
								</div>
							</div>
						</div>
					</div>
					<div v-if="car.owner.role_id">
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.userRole') }}</div>
						<div class="font-semibold text-gray-800">{{ getRoleLabel(car.owner.role_id) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.city') }}</div>
						<div class="font-semibold text-gray-800">{{ car.city }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.status') }}</div>
						<div class="font-semibold text-gray-800">{{ getStatusLabel(car.status) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.price') }}</div>
						<div class="font-semibold text-gray-800">{{ formatPrice(car.price) }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.vinCode') }}</div>
						<div class="font-semibold text-gray-800">{{ car.vin_code }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.brand') }}</div>
						<div class="font-semibold text-gray-800">{{ car.brand }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.model') }}</div>
						<div class="font-semibold text-gray-800">{{ car.model }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.year') }}</div>
						<div class="font-semibold text-gray-800">{{ car.year }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.bodyType') }}</div>
						<div class="font-semibold text-gray-800">{{ car.body_type }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.milage') }}</div>
						<div class="font-semibold text-gray-800">{{ car.mileage }} {{ t('publications.km') }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.fuelType') }}</div>
						<div class="font-semibold text-gray-800">{{ car.fuel_type }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.transmission') }}</div>
						<div class="font-semibold text-gray-800">{{ car.transmission }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.drivetrain') }}</div>
						<div class="font-semibold text-gray-800">{{ car.drivetrain }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.engine') }}</div>
						<div class="font-semibold text-gray-800">{{ car.engine }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.color') }}</div>
						<div class="font-semibold text-gray-800">{{ car.color }}</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.crash') }}</div>
						<div class="font-semibold text-gray-800">{{ car.crash ? t('publications.yes') : t('publications.no') }}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.tradeIn') }}</div>
						<div class="font-semibold text-gray-800">{{ getTradeInLabel(car.trade_in) }}
						</div>
					</div>
					<div>
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.owners') }}</div>
						<div class="font-semibold text-gray-800">{{ car.owners }}
						</div>
					</div>
					<div class="col-span-2">
						<div class="text-sm text-gray-500 mb-1">{{ t('publications.description') }}</div>
						<div class="font-semibold text-gray-800">{{ car.description }}</div>
					</div>
				</div>
			</div>
			<div v-else class="flex justify-center items-center h-full">
				<EmptyState />
			</div>
		</div>
		<PopUpModerate v-if="showPopUpModerate" @save="moderateCar" @cancel="closePopUpModerate"
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
	import type { ICar } from '../types'
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

	const car = ref<ICar | null>(null)
	const loading = ref(false)

	const breadcrumbs = computed(() => [
		{ label: t('sidebar.publications') },
		{ label: t('publications.cars'), to: '/publications/cars' },
		{ label: car.value ? `${car.value.brand} ${car.value.model}` : t('publications.carDetail.back') }
	])

	onMounted(() => {
		getCar()
	})

	async function getCar() {
		try {
			loading.value = true
			const carId = route.params.id as string
			const data: ICar = await api.getCar({ id: carId })
			car.value = data
		} catch (error) {
			console.error('Ошибка при загрузке машины:', error)
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

	function getStatusLabel(status: number): string {
		const statusMap: Record<number, string> = {
			1: t('publications.moderationStatus.pending'),
			2: t('publications.moderationStatus.accept'),
			3: t('publications.moderationStatus.decline')
		}
		return statusMap[status] || String(status)
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
			message: t('publications.confirmDeleteCar'),
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
			accept: () => deleteCar()
		})
	}

	async function deleteCar() {
		if (!car.value) return

		try {
			const carId = route.params.id as string
			await api.deleteCar({ id: carId })
			toast.add({
				severity: 'success',
				summary: t('toast.successDeleted'),
				life: 3000
			})
			router.back()
		} catch (error) {
			console.error('Ошибка при удалении автомобиля:', error)
			toast.add({
				severity: 'error',
				summary: t('base.error'),
				detail: t('toast.errorSaving'),
				life: 3000
			})
		}
	}

	async function moderateCar(formData: { status: number; title?: string; description?: string }) {
		if (!car.value) return

		try {
			loadingPopUpModerate.value = true
			const carId = route.params.id as string
			await api.moderateCar({
				data: {
					id: Number(carId),
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
			await getCar()
		} catch (error) {
			console.error('Ошибка при модерации автомобиля:', error)
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
