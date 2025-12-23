<template>
  <div class="flex h-screen">
    <div class="w-64 h-full">
      <Sidebar />
    </div>
    <div class="flex-1">
      <router-view />
    </div>
    <Toast />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { Toast } from 'primevue'
  import Sidebar from '@/components/Sidebar.vue'
  import { useAuth } from '@/modules/auth/stores'
  import { useChatStore } from '@/modules/chat/stores'
  import { getNotificationService } from '@/modules/chat/services/notification.service'
  import { api } from '@/modules/chat/api'

  const auth = useAuth()
  const chatStore = useChatStore()
  const notificationService = getNotificationService()

  async function getConversations() {
    try {
      const data = await api.getConversations()
      chatStore.setConversations(data)
    } catch (error) {
      console.error('[Default] Error loading conversations:', error)
    }
  }

  onMounted(async () => {
    if (auth.hasPermission('chat')) {
      await getConversations()
      chatStore.initWebSocket()

      if (notificationService.isSupported()) {
        await notificationService.requestPermission()
      }
    }
  })

  onUnmounted(() => {
    if (auth.hasPermission('chat')) {
      chatStore.disconnectWebSocket()
    }
  })
</script>

<style scoped lang="scss"></style>
