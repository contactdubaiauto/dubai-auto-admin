<template>
  <div class="flex h-screen">
    <div class="w-64 h-full">
      <Sidebar />
    </div>
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped lang="scss"></style>
