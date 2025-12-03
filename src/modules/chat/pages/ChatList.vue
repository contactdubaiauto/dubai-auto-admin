<template>
  <div class="flex h-full">
    <div class="w-80 h-full border-r border-gray-200">
      <ChatSidebar />
    </div>
    <div class="flex-1 h-full bg-gray-100">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChatSidebar from '../components/ChatSidebar.vue'
</script>

<style scoped></style>
