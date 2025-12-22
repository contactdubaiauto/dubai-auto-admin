<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200 flex items-center justify-between h-16">
      <h2 class="text-xl font-semibold text-gray-800">{{ t('chat.title') }}</h2>
      <div class="flex items-center gap-2">
        <div
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-green-500': connectionStatus === 'connected',
            'bg-yellow-500': connectionStatus === 'connecting' || connectionStatus === 'reconnecting',
            'bg-red-500': connectionStatus === 'disconnected'
          }"
        ></div>
        <span class="text-sm" :class="statusColor">
          {{ statusText }}
        </span>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div v-if="false" class="p-4 h-full flex flex-col items-center justify-center gap-4">
        <span class="pi pi-comments text-4xl text-gray-500" />
        <div class="text-gray-500 text-center">No chats yet</div>
      </div>
      <div v-if="false" class="p-4 h-full flex flex-col items-center justify-center gap-4">
        <LoadingState />
      </div>
      <div
        v-for="chatRoom in chatRooms"
        :key="chatRoom.id"
        @click="openChat(chatRoom.id)"
        class="px-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div class="flex items-start gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              <img v-if="chatRoom.avatar" :src="chatRoom.avatar" alt="Avatar" class="w-full h-full object-cover" />
              <span v-else class="text-gray-600 text-xs font-semibold">{{
                chatRoom.username.charAt(0).toUpperCase() || 'U'
              }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 truncate">{{ chatRoom.username }}</h3>
              <span class="text-xs text-gray-500"> {{ getLastMessage(chatRoom.messages).created_at }}</span>
            </div>
            <div class="flex items-center justify-between">
              <p v-if="getLastMessage(chatRoom.messages).type === 1" class="text-sm text-gray-600 truncate">
                {{ getLastMessage(chatRoom.messages).message }}
              </p>
              <div v-if="getLastMessage(chatRoom.messages).type === 4" class="flex items-center gap-2">
                <img
                  :src="getLastMessage(chatRoom.messages).message"
                  alt="Image"
                  class="w-full h-full object-cover w-4 h-4 overflow-hidden bg-gray-200"
                />
                <p>{{ t('chat.image') }}</p>
              </div>
              <span
                v-if="chatRoom.unread_count > 0"
                class="ml-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[1.5rem] text-center"
              >
                {{ chatRoom.unread_count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'

  import LoadingState from '@/components/LoadingState.vue'
  import { useChatStore } from '../stores'
  import { api } from '../api'
  import { useI18n } from 'vue-i18n'

  const router = useRouter()
  const chatStore = useChatStore()
  const { t } = useI18n()

  const { connectionStatus, rooms: chatRooms } = storeToRefs(chatStore)

  const statusText = computed(() => {
    switch (connectionStatus.value) {
      case 'connected':
        return t('chat.connected')
      case 'connecting':
        return t('chat.connecting')
      case 'reconnecting':
        return t('chat.reconnecting')
      case 'disconnected':
        return t('chat.disconnected')
      default:
        return t('chat.unknown')
    }
  })

  const statusColor = computed(() => {
    switch (connectionStatus.value) {
      case 'connected':
        return 'text-green-600'
      case 'connecting':
      case 'reconnecting':
        return 'text-yellow-600'
      case 'disconnected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  })

  function openChat(id: number) {
    router.push(`/chat/${id}`)
  }

  function getLastMessage(messages: any[]): any {
    if (messages.length > 0) {
      return {
        id: messages[messages.length - 1].id,
        message: messages[messages.length - 1].message,
        created_at: getDate(messages[messages.length - 1].created_at),
        type: messages[messages.length - 1].type,
        status: messages[messages.length - 1].status
      }
    }
    return {
      id: 0,
      message: '',
      created_at: '',
      type: 0,
      status: 0
    }
  }
  function getDate(date: string): string {
    const dateObj = new Date(date)
    return dateObj.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour12: false
    })
  }

  onMounted(async () => {
    console.log('[ChatSidebar] Mounting - initializing WebSocket')
    await getConversations()
    chatStore.initWebSocket()
  })

  onUnmounted(() => {
    console.log('[ChatSidebar] Unmounting - disconnecting WebSocket')
    chatStore.disconnectWebSocket()
  })

  async function getConversations() {
    try {
      const data = await api.getConversations()
      chatStore.setConversations(data)
    } catch (error) {
      console.error(error)
    }
  }
</script>

<style scoped></style>
