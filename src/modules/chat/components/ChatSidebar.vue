<template>
  <div class="w-full h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Chat</h2>
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full"
          :class="{
            'bg-green-500': isConnected,
            'bg-yellow-500 animate-pulse': !isConnected
          }"
        ></span>
        <span class="text-sm text-gray-600">
          {{ isConnected ? 'Connected' : 'Reconnecting...' }}
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="chatRoomsList.length === 0" class="p-4 text-center text-gray-500">No chats yet</div>
      <div
        v-for="room in chatRoomsList"
        :key="room.user_id"
        class="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
        @click="selectChat(room.user_id)"
      >
        <div class="flex items-start gap-3">
          <div class="relative">
            <div v-if="room.avatar" class="w-12 h-12 rounded-full overflow-hidden">
              <img :src="room.avatar" :alt="room.username" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold"
            >
              {{ getInitials(room.username) }}
            </div>
            <span
              v-if="room.online"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
            ></span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 truncate">{{ room.username }}</h3>
              <span v-if="room.last_message" class="text-xs text-gray-500">
                {{ formatTime(room.last_message.created_at) }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600 truncate">
                {{ getLastMessagePreview(room.last_message) }}
              </p>
              <span
                v-if="room.unread_count > 0"
                class="ml-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[1.5rem] text-center"
              >
                {{ room.unread_count > 99 ? '99+' : room.unread_count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useChatStore } from '../stores'
  import type { Message } from '../types'

  const router = useRouter()
  const chatStore = useChatStore()

  const isConnected = computed(() => chatStore.isConnected)
  const chatRoomsList = computed(() => {
    return Array.from(chatStore.chatRooms.values()).sort((a, b) => {
      const aTime = a.last_message?.created_at || ''
      const bTime = b.last_message?.created_at || ''
      return bTime.localeCompare(aTime)
    })
  })

  function selectChat(userId: number) {
    chatStore.setCurrentChat(userId)
    router.push(`/chat/${userId}`)
  }

  function getInitials(username: string): string {
    return username
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  function getLastMessagePreview(message?: Message): string {
    if (!message) return 'No messages yet'

    switch (message.type) {
      case 1:
        return message.message
      case 2:
        return '📦 Item'
      case 3:
        return '🎥 Video'
      case 4:
        return '🖼️ Image'
      case 5:
        return '📎 File'
      default:
        return 'Message'
    }
  }
</script>

<style scoped></style>
