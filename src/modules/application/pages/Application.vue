<template>
  <div class="h-full flex flex-col">
    <div class="flex justify-between p-4 border-b-2 border-gray-100 mb-2">
      <Button @click="back" icon="pi pi-arrow-left" :label="t('base.back')" severity="secondary" />
    </div>
    <div v-if="application" class="flex-1 overflow-y-auto px-4">
      <div class="flex flex-col p-4 shadow my-4 border border-gray-200 rounded-md">
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.companyName') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.company_name }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.companyType') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.company_type }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.fieldOfActivity') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.activity_field }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.licenseIssue') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.licence_issue_date) }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.licenseExpiry') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.licence_expiry_date) }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.license') }}</div>
          <div class="flex-1">
            <a
              :href="`${application?.licence_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">{{ t('applications.clickForViewFile') }}</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.fullNameOfOwnerOrAuthorizedPerson') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.full_name }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.phoneNumber') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.phone }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.emailAddress') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.email }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.address') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.address }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.vatNumber') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ application.vat_number }}</div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.copyOfId') }}</div>
          <div class="flex-1">
            <a
              :href="`${application?.copy_of_id_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">{{ t('applications.clickForViewFile') }}</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.memorandumOfAssociation') }}</div>
          <div class="flex-1">
            <a
              :href="`${application?.memorandum_url}`"
              target="_blank"
              class="flex items-center gap-2 border rounded-lg p-2 pr-3 shadow bg-gray-50 w-fit hover:shadow-md"
            >
              <i class="pi pi-file-pdf text-gray-500"></i>
              <p class="font-semibold text-gray-700">{{ t('applications.clickForViewFile') }}</p>
            </a>
          </div>
        </div>
        <div class="flex items-center border-b border-gray-100 pb-3 pt-3">
          <div class="text-gray-500 w-[250px]">{{ t('applications.created') }}</div>
          <div class="text-gray-700 font-semibold flex-1">{{ formatDate(application.created_at) }}</div>
        </div>
        <div class="flex gap-4 pt-4">
          <Toast />
          <ConfirmPopup></ConfirmPopup>
          <Button @click="openPopUpReject" :label="t('applications.decline')" severity="danger" />
          <Button @click="accept($event)" :label="t('applications.accept')" severity="success" />
        </div>
      </div>
    </div>
  </div>
  <PopUpReject
    v-if="showPopUpReject"
    @save="declineApplication"
    @cancel="closePopUpReject"
    :loading="loadingPopUpReject"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import moment from 'moment'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { Button, ConfirmPopup, Toast } from 'primevue'
  import { useConfirm } from 'primevue/useconfirm'
  import { useToast } from 'primevue/usetoast'

  import PopUpReject from '../components/PopUpReject.vue'

  import { api } from '../api'
  import type { IApplicationItem } from '../types'
  import { usePopUp } from '@/shared/lib/use/usePopUp'

  const {
    showPopUp: showPopUpReject,
    openPopUp: openPopUpReject,
    closePopUp: closePopUpReject,
    loading: loadingPopUpReject
  } = usePopUp()

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const applicationID = route.params.id as string

  const confirm = useConfirm()
  const toast = useToast()

  const accept = (event: any) => {
    confirm.require({
      target: event.currentTarget,
      message: t('applications.confirmAccept'),
      icon: 'pi pi-info-circle',
      rejectProps: {
        label: t('base.cancel'),
        severity: 'secondary',
        outlined: true
      },
      acceptProps: {
        label: t('applications.accept'),
        severity: 'success'
      },
      accept: () => acceptApplication()
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
      toast.add({ severity: 'success', summary: t('applications.applicationAccepted'), life: 3000 })
    } catch (error) {
      console.error(error)
    }
  }

  async function declineApplication(message: string) {
    try {
      loadingPopUpReject.value = true
      await api.rejectApplication({ id: applicationID, message })
      back()
      toast.add({ severity: 'success', summary: t('applications.applicationDeclined'), life: 3000 })
    } catch (error) {
      console.error(error)
    } finally {
      loadingPopUpReject.value = false
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
