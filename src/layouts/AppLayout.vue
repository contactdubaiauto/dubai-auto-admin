<template>
  <component :is="route.meta.layoutComponent">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'

  const route = useRoute()
  const { cookies } = useCookies()
  const { locale } = useI18n()

  const currentLang = cookies.get('language')

  if (currentLang) {
    locale.value = currentLang
  }
</script>
