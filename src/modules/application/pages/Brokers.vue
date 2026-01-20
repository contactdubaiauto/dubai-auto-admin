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
      <DataTable :value="applications" :loading="loadingApplications" rowHover stripedRows @row-click="onRowClick">
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="email" :header="t('applications.email')"></Column>
        <Column field="company_name" :header="t('applications.companyName')"></Column>
        <Column field="phone" :header="t('applications.phone')"></Column>
        <Column field="created_at" :header="t('applications.date')">
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
  import type { IApplication } from '../types'

  const router = useRouter()
  const { t } = useI18n()

  const breadcrumbs = computed(() => [
    { label: t('sidebar.applications') },
    { label: t('sidebar.brokers'), to: '/application/brokers' }
  ])

  onMounted(() => {
    getApplications()
  })

  const applications = ref<IApplication[]>([])
  const loadingApplications = ref(false)

  async function getApplications() {
    try {
      loadingApplications.value = true
      const data: IApplication[] = await api.getApplications({
        params: {
          role: 4,
          status: 1
        }
      })

      applications.value = data.map((application: IApplication, index: number): IApplication => {
        return {
          index: index + 1,
          ...application
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      loadingApplications.value = false
    }
  }

  function onRowClick({ data }: { data: IApplication }) {
    router.push(`/application/view/${data.id}`)
  }

  function formatDate(date: string) {
    return date ? moment(date).format('DD.MM.YYYY HH:mm') : '-'
  }
</script>
