<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="back" icon="pi pi-arrow-left" label="Back" severity="secondary" />
    </div>
    <div v-if="application" class="flex-1 overflow-y-auto px-4">
      <div class="flex flex-col p-4 shadow my-4 border border-gray-200 rounded-md">
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Company name</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.company_name }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Company Type</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.company_type }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Field of Activity</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.activity_field }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">License issue</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.licence_issue_date) }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">License expiry</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.licence_expiry_date) }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">License</div>
          <div class="flex-1">
            <a
              :href="`${baseURL}${application?.licence_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">Click for view file</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Full Name of Owner or Authorized Person</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.full_name }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Phone Number</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.phone }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Email Address</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.email }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Address</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.address }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">VAT Number (Value Added Tax)</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.vat_number }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Copy of ID (Emirates ID)</div>
          <div class="flex-1">
            <a
              :href="`${baseURL}${application?.copy_of_id_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">Click for view file</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Memorandum of Association</div>
          <div class="flex-1">
            <a
              :href="`${baseURL}${application?.memorandum_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">Click for view file</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">Created</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.created_at) }}</div>
        </div>
        <div class="flex gap-4 pt-4">
          <Toast />
          <ConfirmPopup></ConfirmPopup>
          <Button @click="decline($event)" label="Decline" severity="danger" />
          <Button @click="accept($event)" label="Accept" severity="success" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Button, ConfirmPopup, Toast } from 'primevue'
  import { useConfirm } from 'primevue/useconfirm'
  import { useToast } from 'primevue/usetoast'

  import { api } from '../api'
  import type { IApplicationItem } from '../types'
  import { baseURL } from '@/shared/lib/utils/urls'
  import moment from 'moment'

  const route = useRoute()
  const router = useRouter()

  const applicationID = route.params.id as string

  const confirm = useConfirm()
  const toast = useToast()

  const accept = (event: any) => {
    confirm.require({
      target: event.currentTarget,
      message: 'Confirm acceptance of this application?',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: 'Yes',
        severity: 'success'
      },
      accept: () => acceptApplication()
    })
  }

  const decline = (event: any) => {
    confirm.require({
      target: event.currentTarget,
      message: 'Confirm decline of this application?',
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: 'Yes',
        severity: 'danger'
      },
      accept: () => declineApplication()
    })
  }

  getApplication()

  const application = ref<IApplicationItem>()
  async function getApplication() {
    try {
      const data = await api.getApplication({ id: applicationID })
      application.value = data
    } catch (error) {
      console.error(error)
    }
  }

  async function acceptApplication() {
    try {
      await api.acceptApplication({ id: applicationID })
      back()
      toast.add({ severity: 'success', summary: 'Application accepted', life: 3000 })
    } catch (error) {
      console.error(error)
    }
  }

  async function declineApplication() {
    try {
      await api.rejectApplication({ id: applicationID })
      back()
      toast.add({ severity: 'success', summary: 'Application declined', life: 3000 })
    } catch (error) {
      console.error(error)
    }
  }
  function back() {
    router.go(-1)
  }

  function formatDate(date: string) {
    return date ? moment(date).format('DD.MM.YYYY HH:mm') : '-'
  }
</script>

<style scoped></style>
