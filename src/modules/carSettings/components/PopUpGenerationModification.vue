<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.modification.title')"
    :style="{ width: '25rem' }"
    @update:visible="cancel"
  >
    <Form
      v-slot="$form"
      :initialValues="form"
      :resolver="resolver"
      :validateOnBlur="true"
      @submit="onFormSubmit"
    >
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          <label>{{ t('carSettings.modification.bodyType') }} <span class="text-red-500">*</span></label>
          <Select
            name="body_type_id"
            :options="bodyTypes"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('carSettings.modification.selectBodyType')"
            :disabled="loading"
          />
          <Message v-if="$form.body_type_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.body_type_id.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('carSettings.modification.drivetrain') }} <span class="text-red-500">*</span></label>
          <Select
            name="drivetrain_id"
            :options="drivetrains"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('carSettings.modification.selectDrivetrain')"
            :disabled="loading"
          />
          <Message v-if="$form.drivetrain_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.drivetrain_id.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('carSettings.modification.engine') }} <span class="text-red-500">*</span></label>
          <Select
            name="engine_id"
            :options="engines"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('carSettings.modification.selectEngine')"
            :disabled="loading"
          />
          <Message v-if="$form.engine_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.engine_id.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('carSettings.modification.fuelType') }} <span class="text-red-500">*</span></label>
          <Select
            name="fuel_type_id"
            :options="fuelTypes"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('carSettings.modification.selectFuelType')"
            :disabled="loading"
          />
          <Message v-if="$form.fuel_type_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.fuel_type_id.error.message
          }}</Message>
        </div>
        <div class="flex flex-col gap-1">
          <label>{{ t('carSettings.modification.transmission') }} <span class="text-red-500">*</span></label>
          <Select
            name="transmission_id"
            :options="transmissions"
            optionLabel="name"
            optionValue="id"
            :placeholder="t('carSettings.modification.selectTransmission')"
            :disabled="loading"
          />
          <Message v-if="$form.transmission_id?.invalid" severity="error" size="small" variant="simple">{{
            $form.transmission_id.error.message
          }}</Message>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
        <Button type="submit" :label="t('base.save')" :loading="loading"></Button>
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Button, Dialog, Select, Message } from 'primevue'
  import { Form } from '@primevue/forms'

  import type {
    IGenerationModificationItem,
    IGenerationModificationForm,
    IBodyType,
    IDrivetrain,
    IEngine,
    IFuelType,
    ITransmission
  } from '../types'
  import { api } from '../api'
  import { useLang } from '@/shared/lib/use/useLang'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IGenerationModificationItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const { t } = useI18n()
  const { getDataByLang } = useLang()

  const form = ref<IGenerationModificationForm>({
    body_type_id: props.item?.body_type_id || 0,
    drivetrain_id: props.item?.drivetrain_id || 0,
    engine_id: props.item?.engine_id || 0,
    fuel_type_id: props.item?.fuel_type_id || 0,
    transmission_id: props.item?.transmission_id || 0
  })

  function resolver({ values }: any) {
    const errors = {} as any

    if (!values.body_type_id || values.body_type_id === 0) {
      errors.body_type_id = [{ message: t('validation.required') }]
    }

    if (!values.drivetrain_id || values.drivetrain_id === 0) {
      errors.drivetrain_id = [{ message: t('validation.required') }]
    }

    if (!values.engine_id || values.engine_id === 0) {
      errors.engine_id = [{ message: t('validation.required') }]
    }

    if (!values.fuel_type_id || values.fuel_type_id === 0) {
      errors.fuel_type_id = [{ message: t('validation.required') }]
    }

    if (!values.transmission_id || values.transmission_id === 0) {
      errors.transmission_id = [{ message: t('validation.required') }]
    }

    return { errors }
  }

  const bodyTypes = ref<IBodyType[]>([])
  async function getBodyTypes() {
    try {
      const data = await api.getBodyTypes()
      bodyTypes.value = data.map((item: IBodyType) => {
        return {
          ...item,
          name: getDataByLang({ data: item })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getBodyTypes()

  const drivetrains = ref<IDrivetrain[]>([])
  async function getDrivetrains() {
    try {
      const data = await api.getDrivetrains()
      drivetrains.value = data.map((item: IDrivetrain) => {
        return {
          ...item,
          name: getDataByLang({ data: item })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getDrivetrains()

  const engines = ref<IEngine[]>([])
  async function getEngines() {
    try {
      const data = await api.getEngines()
      engines.value = data.map((item: IEngine) => {
        return {
          ...item,
          name: getDataByLang({ data: item })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getEngines()

  const fuelTypes = ref<IFuelType[]>([])
  async function getFuelTypes() {
    try {
      const data = await api.getFuelTypes()
      fuelTypes.value = data.map((item: IFuelType) => {
        return {
          ...item,
          name: getDataByLang({ data: item })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getFuelTypes()

  const transmissions = ref<ITransmission[]>([])
  async function getTransmissions() {
    try {
      const data = await api.getTransmissions()
      transmissions.value = data.map((item: ITransmission) => {
        return {
          ...item,
          name: getDataByLang({ data: item })
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getTransmissions()

  function cancel() {
    emit('cancel')
  }

  function onFormSubmit({ states, valid }: any) {
    if (valid) {
      const formData: IGenerationModificationForm = {
        body_type_id: states.body_type_id.value,
        drivetrain_id: states.drivetrain_id.value,
        engine_id: states.engine_id.value,
        fuel_type_id: states.fuel_type_id.value,
        transmission_id: states.transmission_id.value
      }
      emit('save', formData)
    }
  }
</script>

<style scoped></style>
