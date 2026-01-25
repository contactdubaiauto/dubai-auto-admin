<template>
	<Dialog :visible="true" modal :header="t('settings.notification.send')" :style="{ width: '35rem' }"
		@update:visible="cancel">
		<Form v-slot="$form" :initialValues="form" :resolver="resolver" :validateOnBlur="true" @submit="onFormSubmit">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<label>{{ t('settings.notification.role') }} <span class="text-red-500">*</span></label>
					<Select name="role_id" :disabled="loading" :options="roles" v-model="form.role_id" optionLabel="label"
						optionValue="value" />
					<Message v-if="$form.role_id?.invalid" severity="error" size="small" variant="simple">{{
						$form.role_id.error.message
					}}</Message>
				</div>
				<div class="flex flex-col gap-1">
					<label>{{ t('settings.notification.title') }} <span class="text-red-500">*</span></label>
					<InputText name="title" :disabled="loading" />
					<Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">{{
						$form.title.error.message
					}}</Message>
				</div>
				<div class="flex flex-col gap-1">
					<label>{{ t('settings.notification.description') }} <span class="text-red-500">*</span></label>
					<Textarea name="description" :disabled="loading" :rows="5" />
					<Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">{{
						$form.description.error.message
					}}</Message>
				</div>
			</div>
			<div class="flex justify-end gap-2 mt-4">
				<Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading" />
				<Button type="submit" :label="t('settings.notification.send')" :loading="loading" />
			</div>
		</Form>
	</Dialog>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { Button, InputText, Textarea, Dialog, Message, Select } from 'primevue'
	import { Form } from '@primevue/forms'
	import { useFormValidation } from '@/shared/lib/use/useFormValidation'

	import type { INotificationForm } from '../types'

	const emit = defineEmits(['cancel', 'save'])

	withDefaults(
		defineProps<{
			loading?: boolean
		}>(),
		{
			loading: false
		}
	)

	const { t } = useI18n()
	const { createCustomResolver } = useFormValidation()

	const form = ref<INotificationForm>({
		title: '',
		description: '',
		role_id: 0
	})

	const resolver = createCustomResolver({
		title: (value) => (!value || !value.trim() ? t('validation.required') : null),
		description: (value) => (!value || !value.trim() ? t('validation.required') : null),
		role_id: (value) => (value === null || value === undefined ? t('validation.required') : null)
	})

	function cancel() {
		emit('cancel')
	}

	function onFormSubmit({ states, valid }: any) {
		if (valid) {
			const formData: INotificationForm = {
				title: states.title.value,
				description: states.description.value,
				role_id: states.role_id.value
			}
			emit('save', formData)
		}
	}

	const roles = computed(() => {
		return [
			{ label: t('settings.notification.all'), value: 0 },
			{ label: t('settings.notification.user'), value: 1 },
			{ label: t('settings.notification.dealer'), value: 2 },
			{ label: t('settings.notification.logistic'), value: 3 },
			{ label: t('settings.notification.broker'), value: 4 },
			{ label: t('settings.notification.carService'), value: 5 },
		]
	})
</script>

<style scoped></style>
