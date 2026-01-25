<template>
	<Dialog :visible="true" modal :header="t('publications.moderateCar')" @update:visible="cancel"
		:style="{ width: '25rem' }">
		<Form v-slot="$form" :initialValues="form" :resolver="resolver" :validateOnBlur="true" @submit="onFormSubmit">
			<div class="flex flex-col gap-2">
				<div class="flex flex-col gap-1">
					<label>{{ t('publications.moderationStatusTitle') }} <span class="text-red-500">*</span></label>
					<Select name="status" :disabled="loading" :options="statusOptions" optionLabel="label" optionValue="value" />
					<Message v-if="$form.status?.invalid" severity="error" size="small" variant="simple">
						{{ $form.status.error.message }}
					</Message>
				</div>
				<div class="flex flex-col gap-1" v-if="$form.status?.value === 3">
					<label>{{ t('publications.moderationTitle') }} <span class="text-red-500">*</span></label>
					<InputText name="title" :disabled="loading" />
					<Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
						{{ $form.title.error.message }}
					</Message>
				</div>
				<div class="flex flex-col gap-1" v-if="$form.status?.value === 3">
					<label>
						{{ t('publications.moderationDescription') }} <span class="text-red-500">*</span>
					</label>
					<Textarea name="description" :disabled="loading" :rows="5" />
					<Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
						{{ $form.description.error.message }}
					</Message>
				</div>
			</div>
			<div class="flex justify-end gap-2 mt-4">
				<Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel"
					:disabled="loading"></Button>
				<Button type="submit" :label="t('base.save')" :loading="loading"></Button>
			</div>
		</Form>
	</Dialog>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { Button, InputText, Textarea, Dialog, Message, Select } from 'primevue'
	import { Form } from '@primevue/forms'
	import { useI18n } from 'vue-i18n'

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

	const form = ref({
		status: 0,
		title: '',
		description: ''
	})

	const statusOptions = computed(() => [
		{ label: t('publications.moderationStatus.pending'), value: 1 },
		{ label: t('publications.moderationStatus.accept'), value: 2 },
		{ label: t('publications.moderationStatus.decline'), value: 3 }
	])

	const resolver = ({ values }: any) => {
		const errors = {} as any

		// Validate status
		if (!values.status || values.status === 0) {
			errors.status = [{ message: t('validation.required') }]
		}

		// Validate title and description only if status is 3 (declined)
		if (values.status === 3) {
			if (!values.title || !String(values.title).trim()) {
				errors.title = [{ message: t('validation.required') }]
			}
			if (!values.description || !String(values.description).trim()) {
				errors.description = [{ message: t('validation.required') }]
			}
		}

		return { errors }
	}

	function cancel() {
		emit('cancel')
	}

	function onFormSubmit({ states, valid }: any) {
		if (valid) {
			const formData = {
				status: states.status?.value,
				title:
					states.title?.value && states.title.value.trim() !== ''
						? states.title.value.trim()
						: undefined,
				description:
					states.description?.value && states.description.value.trim() !== ''
						? states.description.value.trim()
						: undefined
			}
			emit('save', formData)
		}
	}
</script>

<style scoped></style>
