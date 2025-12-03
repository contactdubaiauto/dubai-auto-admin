<template>
  <Dialog
    :visible="true"
    modal
    :header="item ? t('settings.adminUser.title') : t('settings.adminUser.add')"
    :style="{ width: '30rem' }"
    @update:visible="cancel"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label>{{ t('settings.adminUser.username') }} <span class="text-red-500">*</span></label>
        <InputText v-model="form.username" :disabled="loading" />
      </div>
      
      <div class="flex flex-col gap-1">
        <label>{{ t('settings.adminUser.email') }} <span class="text-red-500">*</span></label>
        <InputText v-model="form.email" type="email" :disabled="loading" />
      </div>
      
      <div class="flex flex-col gap-1">
        <label>
          {{ t('settings.adminUser.password') }} 
          <span v-if="!item" class="text-red-500">*</span>
          <span v-else class="text-gray-500 text-sm">({{ t('base.optional') }})</span>
        </label>
        <Password 
          v-model="form.password" 
          :disabled="loading" 
          toggleMask 
          :feedback="false"
          inputClass="w-full"
        />
      </div>
      
      <div class="flex flex-col gap-1">
        <label>{{ t('settings.adminUser.permissions') }}</label>
        <MultiSelect 
          v-model="form.permissions" 
          :options="permissionOptions"
          optionLabel="label"
          optionValue="value"
          :placeholder="t('settings.adminUser.selectPermissions')"
          :disabled="loading"
          display="chip"
          class="w-full"
        />
      </div>
    </div>
    
    <div class="flex justify-end gap-2 mt-4">
      <Button 
        type="button" 
        :label="t('base.cancel')" 
        severity="secondary" 
        @click="cancel" 
        :disabled="loading"
      />
      <Button 
        type="button" 
        :label="t('base.save')" 
        :loading="loading" 
        @click="save"
        :disabled="!isFormValid"
      />
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Button, InputText, Dialog, Password, MultiSelect } from 'primevue'

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
    { value: 'application', label: t('sidebar.applications') },
    { value: 'user', label: t('sidebar.users') },
    { value: 'car', label: t('sidebar.carSettings') },
    { value: 'motorcycles', label: t('sidebar.motorcycleSettings') },
    { value: 'trucks', label: t('sidebar.truckSettings') },
    { value: 'general', label: t('sidebar.general') },
    { value: 'settings', label: t('sidebar.settings') }
  ])

  const form = reactive<IAdminUserForm>({
    username: '',
    email: '',
    password: '',
    permissions: []
  })

  if (props.item) {
    form.username = props.item.username
    form.email = props.item.email
    form.password = ''
    form.permissions = props.item.permissions || []
  }

  const isFormValid = computed(() => {
    if (!form.username.trim() || !form.email.trim()) {
      return false
    }
    // Пароль обязателен только при создании нового пользователя
    if (!props.item && !form.password.trim()) {
      return false
    }
    return true
  })

  function cancel() {
    emit('cancel')
  }

  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>

