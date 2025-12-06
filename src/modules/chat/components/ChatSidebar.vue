<template>
  <div class="w-full h-full flex flex-col bg-white">
    <div class="p-4 border-b border-gray-200 flex items-center justify-between h-16">
      <h2 class="text-xl font-semibold text-gray-800">Chat</h2>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
          {{ isConnected ? 'Connected' : 'Reconnecting...' }}
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
        v-for="i in 100"
        :key="i"
        @click="openChat(i)"
        class="px-4 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div class="flex items-start gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <img src="/logo.png" alt="Avatar" class="w-full h-full object-cover" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-semibold text-gray-900 truncate">John Doe</h3>
              <span class="text-xs text-gray-500"> 12:00</span>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-600 truncate">Last message preview Lorem ipsum dolor sit amet</p>
              <span
                class="ml-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full min-w-[1.5rem] text-center"
              >
                1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoadingState from '@/components/LoadingState.vue'
  import { useChatStore } from '../stores'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const chatStore = useChatStore()

  const { isConnected } = storeToRefs(chatStore)

  function openChat(id: number) {
    router.push(`/chat/${id}`)
  }
</script>

<style scoped></style>
