<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex justify-between w-full">
        <Button @click="openPopUpAdminUser" icon="pi pi-plus" :label="t('settings.adminUser.add')" />
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
      <DataTable :value="adminUsers" :loading="loadingAdminUsers" rowHover stripedRows size="small">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="username" :header="t('settings.adminUser.username')"></Column>
        <Column field="email" :header="t('settings.adminUser.email')"></Column>
        <Column :header="t('settings.adminUser.permissions')">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-1">
              <Tag
                v-for="(permission, idx) in slotProps.data.permissions"
                :key="idx"
                :value="getPermissionLabel(permission)"
                severity="info"
                class="text-xs"
              />
              <span v-if="!slotProps.data.permissions || slotProps.data.permissions.length === 0" class="text-gray-400"
                >-</span
              >
            </div>
          </template>
        </Column>
        <Column :header="t('base.actions')" class="w-24">
          <template #body="slotProps">
            <div class="flex gap-1">
              <Button
                @click.stop="selectAdminUser(slotProps.data)"
                icon="pi pi-pencil"
                rounded
                variant="outlined"
                size="small"
              />
              <Button
                @click.stop="selectDeleteAdminUser(slotProps.data)"
                icon="pi pi-trash"
                severity="danger"
                rounded
                variant="outlined"
                size="small"
              />
            </div>
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
  <PopUpAdminUser
    v-if="showPopUpAdminUser"
    @save="saveAdminUser"
    @cancel="closePopUpAdminUser"
    :loading="loadingPopUpAdminUser"
    :item="selectedAdminUser"
  />
  <PopUpConfirmDelete
    v-if="showPopUpDeleteAdminUser"
    @delete="deleteAdminUser"
    @cancel="closePopUpDeleteAdminUser"
    :loading="loadingPopUpDeleteAdminUser"
    :description="t('settings.adminUser.confirmDelete')"
  />
  <Toast />
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Button, DataTable, Column, Breadcrumb, Tag, Toast } from 'primevue'
  import { useToast } from 'primevue/usetoast'

  import PopUpAdminUser from '../components/PopUpAdminUser.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'
  import EmptyState from '@/components/EmptyState.vue'
  import LoadingState from '@/components/LoadingState.vue'

  import { usePopUp } from '@/shared/lib/use/usePopUp'
  import { api } from '../api'
  import type { IAdminUser, IAdminUserForm } from '../types'

  const { showPopUp: showPopUpAdminUser, openPopUp: openPopUpAdminUser, loading: loadingPopUpAdminUser } = usePopUp()

  const {
    showPopUp: showPopUpDeleteAdminUser,
    openPopUp: openPopUpDeleteAdminUser,
    closePopUp: closePopUpDeleteAdminUser,
    loading: loadingPopUpDeleteAdminUser
  } = usePopUp()

  const { t } = useI18n()
  const toast = useToast()

  const breadcrumbs = ref([
    { label: t('sidebar.settings') },
    { label: t('settings.adminUser.adminUsers'), to: '/settings/admin-users' }
  ])

  interface IAdminUserItem extends IAdminUser {
    index: number
  }

  const adminUsers = ref<IAdminUserItem[]>([])

  onMounted(() => {
    getAdminUsers()
  })

  const selectedAdminUser = ref<IAdminUser | null>(null)

  function selectAdminUser(item: IAdminUser) {
    selectedAdminUser.value = item
    openPopUpAdminUser()
  }

  function closePopUpAdminUser() {
    selectedAdminUser.value = null
    showPopUpAdminUser.value = false
  }

  const loadingAdminUsers = ref(false)

  async function getAdminUsers() {
    try {
      loadingAdminUsers.value = true
      const data: IAdminUser[] = await api.getAdminUsers({ params: {} })

      adminUsers.value = data.map((user: IAdminUser, index: number): IAdminUserItem => {
        return {
          ...user,
          index: index + 1
        }
      })
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: 'Failed to load admin users',
        life: 3000
      })
    } finally {
      loadingAdminUsers.value = false
    }
  }

  async function saveAdminUser(form: IAdminUserForm) {
    try {
      loadingPopUpAdminUser.value = true

      if (selectedAdminUser.value) {
        // Обновление существующего пользователя
        await api.updateAdminUser({
          id: selectedAdminUser.value.id,
          data: form
        })
        toast.add({
          severity: 'success',
          summary: t('settings.adminUser.successUpdated'),
          life: 3000
        })
      } else {
        // Создание нового пользователя
        await api.createAdminUser({ data: form })
        toast.add({
          severity: 'success',
          summary: t('settings.adminUser.successCreated'),
          life: 3000
        })
      }

      await getAdminUsers()
      closePopUpAdminUser()
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: 'Failed to save admin user',
        life: 3000
      })
    } finally {
      loadingPopUpAdminUser.value = false
    }
  }

  const selectedDeleteAdminUser = ref<IAdminUser>()

  function selectDeleteAdminUser(item: IAdminUser) {
    selectedDeleteAdminUser.value = item
    openPopUpDeleteAdminUser()
  }

  async function deleteAdminUser() {
    try {
      loadingPopUpDeleteAdminUser.value = true

      if (selectedDeleteAdminUser.value) {
        await api.deleteAdminUser({ id: selectedDeleteAdminUser.value.id })
        toast.add({
          severity: 'success',
          summary: t('settings.adminUser.successDeleted'),
          life: 3000
        })
      }

      await getAdminUsers()
      closePopUpDeleteAdminUser()
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'error',
        summary: t('base.error'),
        detail: 'Failed to delete admin user',
        life: 3000
      })
    } finally {
      loadingPopUpDeleteAdminUser.value = false
    }
  }

  const permissionLabels: Record<string, string> = {
    chat: 'sidebar.chat',
    application: 'sidebar.applications',
    user: 'sidebar.users',
    car: 'sidebar.carSettings',
    motorcycles: 'sidebar.motorcycleSettings',
    trucks: 'sidebar.truckSettings',
    general: 'sidebar.general',
    settings: 'sidebar.settings'
  }

  function getPermissionLabel(permission: string): string {
    const key = permissionLabels[permission]
    return key ? t(key) : permission
  }
</script>

<style scoped></style>
