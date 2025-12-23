import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { getWebSocketService } from '../services/websocket.service'
import { getNotificationService } from '../services/notification.service'
import type { WSMessageReceived } from '../types'
import { useAuth } from '@/modules/auth/stores'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

interface IChatStore {
  connectionStatus: Ref<ConnectionStatus>
  isConnected: ComputedRef<boolean>
  rooms: Ref<any[]>
  messages: Ref<WSMessageReceived[]>
  currentRoomId: Ref<number | null>
  totalUnreadCount: ComputedRef<number>
  initWebSocket: () => void
  disconnectWebSocket: () => void
  sendMessage: (message: any) => void
  onMessage: (handler: (message: WSMessageReceived) => void) => () => void
  setConversations: (conversations: any[]) => void
  setMessagesToRoom: (messages: any[], room: any) => void
  prependMessagesToRoom: (messages: any[], room: any) => void
  setCurrentRoomId: (id: number | null) => void
  sendAck: (message: any) => void
}

const NAMESPACE = 'chat'

export const useChatStore = defineStore(NAMESPACE, (): IChatStore => {
  const auth = useAuth()

  const connectionStatus = ref<ConnectionStatus>('disconnected')
  const messages = ref<WSMessageReceived[]>([])
  const rooms = ref<any[]>([])
  const currentRoomId = ref<number | null>(null)
  const wsService = getWebSocketService()
  const notificationService = getNotificationService()
  let unsubscribeStatus: (() => void) | null = null
  let unsubscribeMessage: (() => void) | null = null

  const isConnected = computed(() => connectionStatus.value === 'connected')
  const totalUnreadCount = computed(() => {
    return rooms.value.reduce((total, room) => total + (room.unread_count || 0), 0)
  })
  function addMessageToRoom(data: any): void {
    const findIndex = rooms.value.findIndex((room) => room.id === data.conversation_id)
    let foundRoom: any
    let lastAddedMessage: any = null

    if (findIndex !== -1) {
      foundRoom = rooms.value.splice(findIndex, 1)[0]
      rooms.value.unshift(foundRoom)
      lastAddedMessage = addMessagesToRoom(data.messages, foundRoom)
    } else {
      rooms.value.unshift({
        id: data.id,
        user_id: data.user_id,
        username: data.username,
        avatar: data.avatar,
        unread_count: data.unread_count,
        messages: []
      })
      foundRoom = rooms.value[0]
      lastAddedMessage = addMessagesToRoom(data.messages, foundRoom)
    }

    const roomId = data.conversation_id || data.id
    const isCurrentRoom = currentRoomId.value !== null && currentRoomId.value === roomId

    if (isCurrentRoom && lastAddedMessage && lastAddedMessage.sender_id !== 0) {
      sendAck({
        target_user_id: foundRoom.user_id,
        created_at: lastAddedMessage.created_at
      })
    }

    if (!isCurrentRoom && lastAddedMessage && lastAddedMessage.sender_id !== 0) {
      const messageText =
        lastAddedMessage.type === 4 ? 'Отправил изображение' : lastAddedMessage.message || 'Новое сообщение'

      notificationService
        .showNotification(foundRoom.username || 'Неизвестный', messageText, foundRoom.avatar, roomId)
        .catch((error) => {
          console.error('[ChatStore] Error showing notification:', error)
        })
    }
  }
  function addMessagesToRoom(messages: any[], room: any): any {
    let lastAddedMessage: any = null
    const isCurrentRoom = currentRoomId.value !== null && currentRoomId.value === room.id

    messages.forEach((message) => {
      const findMessage = room.messages.find(
        (msg: any) => msg.id === message.id || msg.created_at === message.created_at
      )
      if (findMessage) {
        return
      }
      if (!isCurrentRoom && message.sender_id !== 0) {
        room.unread_count = room.unread_count + 1
      }
      const newMessage = {
        id: message.id,
        message: message.message,
        created_at: message.created_at,
        type: message.type,
        sender_id: message.sender_id
      }
      room.messages.push(newMessage)
      lastAddedMessage = newMessage
    })
    return lastAddedMessage
  }

  function handleMessage(message: WSMessageReceived): void {
    if (message.event === 'new_message') {
      message.data?.forEach((messageItem: any) => {
        addMessageToRoom(messageItem)
      })
    }

    if (message.event === 'ack') {
      const messageTime = message.data as string
      rooms.value.forEach((room) => {
        const foundMessage = room.messages.find((msg: any) => {
          return msg.created_at === messageTime || new Date(msg.created_at).toISOString() === messageTime
        })
        if (foundMessage) {
          foundMessage.status = 1
        }
      })
    }

    messages.value.push(message)

    if (message.event === 'ping') {
      wsService.send({ event: 'ping' })
    }
  }
  function sendAck(message: any): void {
    wsService.send({
      event: 'ack',
      data: {
        target_user_id: message.target_user_id,
        time: message.created_at
      }
    })
  }

  function initWebSocket(): void {
    if (unsubscribeStatus) {
      unsubscribeStatus()
    }
    if (unsubscribeMessage) {
      unsubscribeMessage()
    }

    unsubscribeStatus = wsService.onStatusChange((status) => {
      connectionStatus.value = status
    })

    unsubscribeMessage = wsService.onMessage(handleMessage)

    wsService.connect()
  }

  function disconnectWebSocket(): void {
    if (unsubscribeStatus) {
      unsubscribeStatus()
      unsubscribeStatus = null
    }

    if (unsubscribeMessage) {
      unsubscribeMessage()
      unsubscribeMessage = null
    }

    wsService.disconnect()
    connectionStatus.value = 'disconnected'
  }

  function sendMessage(message: any): void {
    wsService.send(message)
  }

  function onMessage(handler: (message: WSMessageReceived) => void): () => void {
    return wsService.onMessage(handler)
  }

  function setConversations(conversations: any[]): void {
    conversations.forEach((conversation) => {
      const sender_id = conversation.user_id === auth.user.id ? 0 : conversation.user_id
      rooms.value.push({
        id: conversation.id,
        user_id: conversation.user_id,
        username: conversation.username,
        avatar: conversation.avatar,
        unread_count: conversation.unread_messages,
        messages: [
          {
            id: 0,
            message: conversation.last_message,
            created_at: conversation.last_active_date,
            type: conversation.last_message_type,
            sender_id: sender_id
          }
        ]
      })
    })
  }

  function setMessagesToRoom(messages: any[], room: any): void {
    room.messages = []
    room.unread_count = 0
    messages.reverse().forEach((message) => {
      const sender_id = message.sender_id === auth.user.id ? 0 : message.sender_id
      room.messages.push({
        id: message.id,
        message: message.message,
        created_at: message.created_at,
        type: message.type,
        sender_id: sender_id
      })
    })
  }

  function prependMessagesToRoom(messages: any[], room: any): void {
    const existingIds = new Set(room.messages.map((msg: any) => msg.id))
    const messagesToAdd = [...messages].reverse().filter((message) => {
      if (existingIds.has(message.id)) {
        return false
      }
      return true
    })

    messagesToAdd.forEach((message) => {
      const sender_id = message.sender_id === auth.user.id ? 0 : message.sender_id
      room.messages.unshift({
        id: message.id,
        message: message.message,
        created_at: message.created_at,
        type: message.type,
        sender_id: sender_id
      })
    })
  }

  function setCurrentRoomId(id: number | null): void {
    if (id !== null) {
      const room = rooms.value.find((room) => room.id === id)
      if (room) {
        room.unread_count = 0
      }
    }
    currentRoomId.value = id
  }

  return {
    connectionStatus,
    isConnected,
    messages,
    rooms,
    currentRoomId,
    totalUnreadCount,
    initWebSocket,
    disconnectWebSocket,
    sendMessage,
    onMessage,
    setConversations,
    setMessagesToRoom,
    prependMessagesToRoom,
    setCurrentRoomId,
    sendAck
  }
})
