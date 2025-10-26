<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 border-b-2 border-gray-100 mb-2">
      <div class="flex">
        <Breadcrumb :home="home" :model="items" class="p-0" />
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <DataTable :value="applications" stripedRows>
        <Column field="index" header="№" class="w-9"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="phone" header="Phone"></Column>
        <Column field="created_at" header="Date">
          <template #body="{ data }">
            {{ formatDate(data.created_at) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { DataTable, Column, Breadcrumb } from 'primevue'

  import { api } from '../api'
  import type { IApplication } from '../types'
  import moment from 'moment'

  const home = ref({
    icon: 'pi pi-car',
    label: 'Users'
  })

  const items = ref([{ label: 'Clients' }])

  const applications = ref<IApplication[]>([])

  onMounted(() => {
    getApplications()
  })

  async function getApplications() {
    try {
      const data: IApplication[] = await api.getApplications({
        params: {
          role: 1,
          status: 2
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
    }
  }

  function formatDate(date: string) {
    return date ? moment(date).format('DD.MM.YYYY HH:mm') : '-'
  }
</script>
