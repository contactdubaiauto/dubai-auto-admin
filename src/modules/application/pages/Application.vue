<template>
  <div></div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  import { api } from '../api'
  import type { IApplication } from '../types'

  const route = useRoute()
  const applicationID = route.params.id as string

  getApplication()

  const application = ref<IApplication>()
  async function getApplication() {
    try {
      const data = await api.getApplication({ id: applicationID })
      application.value = data
    } catch (error) {
      console.error(error)
    }
  }
</script>

<style scoped></style>
