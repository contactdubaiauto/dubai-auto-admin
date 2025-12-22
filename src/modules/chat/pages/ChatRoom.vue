<template>
  <div class="w-full h-full flex flex-col">
    <div class="bg-white h-16 border-b border-gray-200 p-4 flex items-center gap-3">
      <Button @click="back" icon="pi pi-arrow-left" severity="secondary" />
      <div
        v-if="!loadingMessages"
        class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
      >
        <img v-if="chatRoom.avatar" :src="chatRoom.avatar" alt="Avatar" class="w-full h-full object-cover" />
        <span v-else class="text-gray-600 text-xs font-semibold">{{
          chatRoom.username.charAt(0).toUpperCase() || 'U'
        }}</span>
      </div>
      <div v-if="!loadingMessages" class="flex-1">
        <div class="font-semibold text-gray-800 truncate">{{ chatRoom.username }}</div>
      </div>
    </div>
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4">
      <div v-if="!loadingMessages" v-for="message in messages" :key="message.id" class="w-full mb-1">
        <div
          v-if="message.type === 1 && message.sender_id !== 0"
          class="max-w-[600px] w-fit bg-white border border-gray-200 rounded-xl p-4 relative"
        >
          <p class="text-gray-800 font-medium">
            {{ message.message }}
            <span class="text-xs text-gray-800 pl-1 opacity-0 user-select-none">{{ getDate(message.created_at) }}</span>
          </p>
          <div class="text-xs text-gray-800 absolute right-2 bottom-2 opacity-70">
            {{ getDate(message.created_at) }}
          </div>
        </div>
        <div
          v-if="message.type === 1 && message.sender_id === 0"
          class="max-w-[600px] ml-auto w-fit bg-primary-500 border border-primary-500 text-white rounded-xl p-4 relative"
        >
          <p class="text-white font-medium">
            {{ message.message }}
            <span class="text-xs text-white pl-1 opacity-0 user-select-none">{{ getDate(message.created_at) }}</span>
          </p>
          <div class="text-xs text-white absolute right-2 bottom-2 opacity-70">{{ getDate(message.created_at) }}</div>
        </div>
        <div v-if="message.type === 4 && message.sender_id !== 0" class="w-full mb-1">
          <div
            class="w-fit bg-white border border-gray-200 rounded-xl overflow-hidden relative hover:scale-105 transition-all duration-300 h-[300px]"
          >
            <img :src="message.message" alt="Image" class="max-w-full h-[300px] w-auto object-contain" />
            <div class="absolute bottom-2 right-2 bg-gray-100 border border-gray-200 rounded-md px-1">
              <span class="text-xs text-gray-800">{{ getDate(message.created_at) }}</span>
            </div>
          </div>
        </div>
        <div v-if="message.type === 4 && message.sender_id === 0" class="w-full mb-1">
          <div
            class="w-fit ml-auto bg-primary-500 border border-primary-500 rounded-xl overflow-hidden relative h-[300px]"
          >
            <img :src="message.message" alt="Image" class="max-w-full h-[300px] w-auto object-contain" />
            <div class="absolute bottom-2 right-2 bg-gray-100 border border-gray-200 rounded-md px-1">
              <span class="text-xs text-gray-800">{{ getDate(message.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white border-t border-gray-200 p-4">
      <div class="flex items-end gap-2">
        <Textarea
          v-model="message"
          placeholder="Введите сообщение..."
          :autoResize="true"
          rows="1"
          class="flex-1"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <Button
          icon="pi pi-image"
          severity="secondary"
          outlined
          @click="selectImage"
          aria-haspopup="true"
          aria-controls="attachment_menu"
        />
        <Button icon="pi pi-send" @click="sendMessage" :disabled="!message.trim()" />
      </div>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { Button, Textarea } from 'primevue'
  import { useChatStore } from '../stores'
  import { api } from '../api'

  const route = useRoute()
  const router = useRouter()
  const chatStore = useChatStore()

  const message = ref('')
  const messagesContainer = ref<HTMLElement | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)

  const roomID = computed(() => Number(route.params.id))

  const loadingMessages = ref(false)
  const uploadingImage = ref(false)

  function scrollToBottom(): void {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  onMounted(() => {
    chatStore.setCurrentRoomId(roomID.value)

    watch(
      roomID,
      (newVal) => {
        chatStore.setCurrentRoomId(newVal)
        getConversationMessages(newVal)
      },
      { immediate: true }
    )

    // Автоматический скролл при изменении сообщений
    watch(
      messages,
      () => {
        scrollToBottom()
      },
      { deep: true }
    )
  })

  onUnmounted(() => {
    chatStore.setCurrentRoomId(null)
  })

  const chatRoom = computed(() => {
    return (
      chatStore.rooms.find((room) => room.id === Number(route.params.id)) || {
        id: 0,
        username: '',
        avatar: '',
        messages: []
      }
    )
  })

  const messages = computed(() => {
    const room = chatStore.rooms.find((room) => room.id === Number(route.params.id))
    if (room) {
      room.messages.forEach((message: any) => {
        message.status = 1
      })
      return room.messages
    }
    return []
  })

  function back() {
    router.push('/chat')
  }

  function selectImage() {
    fileInput.value?.click()
  }

  async function handleImageSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) {
      return
    }

    // Сброс input для возможности повторного выбора того же файла
    if (target) {
      target.value = ''
    }

    try {
      uploadingImage.value = true
      const response = await api.uploadFile(file)
      const imageUrl = response.message
      sendImageMessage(imageUrl)
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error)
    } finally {
      uploadingImage.value = false
    }
  }

  function sendImageMessage(imageUrl: string) {
    chatStore.sendMessage({
      event: 'private_message',
      target_user_id: chatRoom.value.user_id,
      data: {
        admin: true,
        message: imageUrl,
        target_user_id: chatRoom.value.user_id,
        time: new Date().toISOString(),
        type: 4
      }
    })
    chatRoom.value.messages.push({
      id: 0,
      message: imageUrl,
      created_at: new Date().toISOString(),
      type: 4,
      sender_id: 0,
      status: 0
    })
    scrollToBottom()
  }

  async function getConversationMessages(id: number) {
    try {
      loadingMessages.value = true
      const params = {
        limit: 1000
      }
      const data: any = await api.getConversationMessages(id, params)
      chatStore.setMessagesToRoom(data, chatRoom.value)
    } catch (error) {
      console.error(error)
    } finally {
      loadingMessages.value = false
      scrollToBottom()
    }
  }

  function sendMessage() {
    if (!message.value.trim()) return

    chatStore.sendMessage({
      event: 'private_message',
      target_user_id: chatRoom.value.user_id,
      data: {
        admin: true,
        message: message.value.trim(),
        target_user_id: chatRoom.value.user_id,
        time: new Date().toISOString(),
        type: 1
      }
    })
    chatRoom.value.messages.push({
      id: 0,
      message: message.value.trim(),
      created_at: new Date().toISOString(),
      type: 1,
      sender_id: 0,
      status: 0
    })
    message.value = ''
    scrollToBottom()
  }

  function getDate(date: string): string {
    const dateObj = new Date(date)
    return dateObj.toLocaleTimeString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour12: false
    })
  }
</script>

<style scoped></style>
