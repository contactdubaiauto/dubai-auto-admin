<template>
	<Dialog :visible="true" modal :header="item ? t('settings.adminUser.title') : t('settings.adminUser.add')"
		:style="{ width: '30rem' }" @update:visible="cancel">
		<Form v-slot="$form" :initialValues="form" :resolver="resolver" :validateOnBlur="true" @submit="onFormSubmit">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<label>{{ t('settings.adminUser.username') }} <span class="text-red-500">*</span></label>
					<InputText name="username" :disabled="loading" />
					<Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{
						$form.username.error.message
					}}</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label>{{ t('settings.adminUser.email') }} <span class="text-red-500">*</span></label>
					<InputText name="email" type="email" :disabled="loading" />
					<Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
						$form.email.error.message
					}}</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label>
						{{ t('settings.adminUser.password') }}
						<span v-if="!item" class="text-red-500">*</span>
						<span v-else class="text-gray-500 text-sm">({{ t('base.optional') }})</span>
					</label>
					<Password name="password" :disabled="loading" toggleMask :feedback="false" inputClass="w-full" />
					<Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
						$form.password.error.message
					}}</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label>{{ t('settings.adminUser.permissions') }}</label>
					<MultiSelect name="permissions" :options="permissionOptions" optionLabel="label" optionValue="value"
						:placeholder="t('settings.adminUser.selectPermissions')" :disabled="loading" display="chip"
						class="w-full" />
				</div>
			</div>

			<div class="flex justify-end gap-2 mt-4">
				<Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading" />
				<Button type="submit" :label="t('base.save')" :loading="loading" />
			</div>
		</Form>
	</Dialog>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { Button, InputText, Dialog, Password, MultiSelect, Message } from 'primevue'
	import { Form } from '@primevue/forms'

	import type { IAdminUser, IAdminUserForm } from '../types'

	const emit = defineEmits(['cancel', 'save'])

	const props = withDefaults(
		defineProps<{
			item?: IAdminUser | null
			loading?: boolean
		}>(),
		{
			item: null,
			loading: false
		}
	)

	const { t } = useI18n()

	const permissionOptions = computed(() => [
		{ value: 'chat', label: t('sidebar.chat') },
		{ value: 'reports', label: t('sidebar.reports') },
		{ value: 'application', label: t('sidebar.applications') },
		{ value: 'user', label: t('sidebar.users') },
		{ value: 'car', label: t('sidebar.carSettings') },
		{ value: 'motorcycles', label: t('sidebar.motorcycleSettings') },
		{ value: 'trucks', label: t('sidebar.truckSettings') },
		{ value: 'general', label: t('sidebar.general') },
		{ value: 'settings', label: t('sidebar.settings') }
	])

	const form = ref<IAdminUserForm>({
		username: props.item?.username || '',
		email: props.item?.email || '',
		password: '',
		permissions: props.item?.permissions || []
	})

	function resolver({ values }: any) {
		const errors = {} as any

		if (!values.username || !values.username.trim()) {
			errors.username = [{ message: t('validation.usernameRequired') }]
		}

		if (!values.email || !values.email.trim()) {
			errors.email = [{ message: t('validation.emailRequired') }]
		}

		if (!props.item && (!values.password || !values.password.trim())) {
			errors.password = [{ message: t('validation.passwordRequired') }]
		}

		return { errors }
	}

	function cancel() {
		emit('cancel')
	}

	function onFormSubmit({ states, valid }: any) {
		if (valid) {
			const formData: IAdminUserForm = {
				username: states.username.value,
				email: states.email.value,
				password: states.password.value,
				permissions: states.permissions.value
			}
			emit('save', formData)
		}
	}
</script>

<style scoped></style>
