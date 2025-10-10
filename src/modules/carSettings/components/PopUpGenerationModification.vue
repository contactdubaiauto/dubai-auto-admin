<template>
  <Dialog :visible="true" modal header="Generation" :style="{ width: '25rem' }" @update:visible="cancel">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>Generation name</label>
        <Select
          v-model="form.body_type_id"
          :options="bodyTypes"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a body type"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label>Drivetrain</label>
        <Select
          v-model="form.drivetrain_id"
          :options="drivetrains"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a drivetrain"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label>Engine</label>
        <Select
          v-model="form.engine_id"
          :options="engines"
          optionLabel="value"
          optionValue="id"
          placeholder="Select a engine"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label>Fuel type</label>
        <Select
          v-model="form.fuel_type_id"
          :options="fuelTypes"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a fuel type"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label>Transmission</label>
        <Select
          v-model="form.transmission_id"
          :options="transmissions"
          optionLabel="name"
          optionValue="id"
          placeholder="Select a transmission"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Save" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Button, Dialog, Select } from 'primevue'

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

  const form = reactive<IGenerationModificationForm>({
    body_type_id: 0,
    drivetrain_id: 0,
    engine_id: 0,
    fuel_type_id: 0,
    transmission_id: 0
  })

  if (props.item) {
    form.body_type_id = props.item.body_type_id
    form.drivetrain_id = props.item.drivetrain_id
    form.engine_id = props.item.engine_id
    form.fuel_type_id = props.item.fuel_type_id
    form.transmission_id = props.item.transmission_id
  }

  const bodyTypes = ref<IBodyType[]>([])
  async function getBodyTypes() {
    try {
      const data = await api.getBodyTypes()
      bodyTypes.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getBodyTypes()

  const drivetrains = ref<IDrivetrain[]>([])
  async function getDrivetrains() {
    try {
      const data = await api.getDrivetrains()
      drivetrains.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getDrivetrains()

  const engines = ref<IEngine[]>([])
  async function getEngines() {
    try {
      const data = await api.getEngines()
      engines.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getEngines()

  const fuelTypes = ref<IFuelType[]>([])
  async function getFuelTypes() {
    try {
      const data = await api.getFuelTypes()
      fuelTypes.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getFuelTypes()

  const transmissions = ref<ITransmission[]>([])
  async function getTransmissions() {
    try {
      const data = await api.getTransmissions()
      transmissions.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getTransmissions()

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
