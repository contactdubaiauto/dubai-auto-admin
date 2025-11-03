<template>
  <Dialog
    :visible="true"
    modal
    :header="t('carSettings.brand.title')"
    :style="{ width: '25rem' }"
    @update:visible="cancel"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label>{{ t('base.name') }} (en)</label>
        <InputText v-model="form.name" :disabled="loading" />
      </div>
      <div class="flex flex-col gap-1">
        <label>{{ t('base.name') }} (ру)</label>
        <InputText v-model="form.name_ru" :disabled="loading" />
      </div>
    </div>
    <div class="flex items-center gap-1 mt-4">
      <Checkbox v-model="form.popular" inputId="popular" name="popular" binary />
      <label for="popular">{{ t('base.popular') }}</label>
    </div>
    <div class="flex justify-end gap-2 mt-4">
      <Button type="button" :label="t('base.cancel')" severity="secondary" @click="cancel" :disabled="loading"></Button>
      <Button type="button" :label="t('base.save')" :loading="loading" @click="save"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { Button, InputText, Dialog, Checkbox } from 'primevue'
  import { useI18n } from 'vue-i18n'

  import type { IModelItem, IModelForm } from '../types'

  const emit = defineEmits(['cancel', 'save'])

  const props = withDefaults(
    defineProps<{
      item?: IModelItem | null
      loading?: boolean
    }>(),
    {
      item: null,
      loading: false
    }
  )

  const { t } = useI18n()

  const form = reactive<IModelForm>({
    name: '',
    name_ru: '',
    popular: false
  })

  if (props.item) {
    form.name = props.item.name
    form.name_ru = props.item.name_ru
    form.popular = props.item.popular
  }

  function cancel() {
    emit('cancel')
  }
  function save() {
    emit('save', form)
  }
</script>

<style scoped></style>
