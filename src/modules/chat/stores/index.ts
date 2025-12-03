import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { WebSocketService } from '../services/websocket.service'
import { api } from '../api'
import type { Message, ChatRoom, WSMessageReceived, MessageData } from '../types'
import { useAuth } from '@/modules/auth/stores'

interface IChatStore {
  isConnected: Ref<boolean>
  chatRooms: Ref<Map<number, ChatRoom>>
  messages: Ref<Map<number, Message[]>>
  currentChatUserId: Ref<number | null>
  unreadCount: ComputedRef<number>
  currentChatMessages: ComputedRef<Message[]>
  initializeWebSocket: () => Promise<void>
  disconnect: () => void
  sendTextMessage: (userId: number, text: string) => Promise<void>
  sendFileMessage: (userId: number, file: File, type: number) => Promise<void>
  setCurrentChat: (userId: number) => void
  markAsRead: (userId: number) => void
}

const NAMESPACE = 'chat'

export const useChatStore = defineStore(NAMESPACE, (): IChatStore => {
  const authStore = useAuth()
  const wsService = ref<WebSocketService | null>(null)
  const isConnected = ref(false)
  const chatRooms = ref<Map<number, ChatRoom>>(new Map())
  const messages = ref<Map<number, Message[]>>(new Map())
  const currentChatUserId = ref<number | null>(null)
  const pendingMessages = ref<Map<string, Message>>(new Map())

  const unreadCount = computed(() => {
    let count = 0
    chatRooms.value.forEach((room) => {
      count += room.unread_count
    })
    return count
  })

  const currentChatMessages = computed(() => {
    if (currentChatUserId.value === null) {
      return []
    }
    return messages.value.get(currentChatUserId.value) || []
  })

  async function initializeWebSocket(): Promise<void> {
    try {
      wsService.value = new WebSocketService(import.meta.env.VITE_APP_WS_URL)

      wsService.value.onConnected((data: WSMessageReceived) => {
        isConnected.value = true
        console.log('Chat WebSocket connected')
        console.log('Connected event data:', data)
        // TODO: There show rooms list
        // handleIncomingMessage(data)
      })

      wsService.value.onDisconnected(() => {
        isConnected.value = false
        console.log('Chat WebSocket disconnected')
      })

      wsService.value.onMessage((data: WSMessageReceived) => {
        handleIncomingMessage(data)
      })

      await wsService.value.connect()
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      throw error
    }
  }

  function disconnect(): void {
    if (wsService.value) {
      wsService.value.disconnect()
      wsService.value = null
    }
    isConnected.value = false
  }

  function handleIncomingMessage(data: WSMessageReceived): void {
    switch (data.event) {
      case 'new_message':
        if (data.data) {
          addIncomingMessages(data.data)
        }
        break

      case 'ack':
        if (data.data) {
          handleMessageAck(data.data)
        }
        break

      case 'connected':
        if (data.data && Array.isArray(data.data)) {
          initializeChatRooms(data.data)
        }
        break
    }
  }

  function initializeChatRooms(chatData: any[]): void {
    console.log('Initializing chat rooms:', chatData)

    chatData.forEach((chat: any) => {
      const userId = chat.id

      if (chat.messages && Array.isArray(chat.messages) && chat.messages.length > 0) {
        const userMessages: Message[] = chat.messages.map((msg: any) => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          message: msg.message,
          type: msg.type,
          status: msg.status || 2,
          created_at: msg.created_at
        }))

        messages.value.set(userId, userMessages)

        const lastMessage = userMessages[userMessages.length - 1]
        const room: ChatRoom = {
          user_id: userId,
          username: chat.username,
          email: chat.email,
          avatar: chat.avatar,
          online: false,
          unread_count: 0,
          last_message: lastMessage,
          last_active_date: chat.last_active_date
        }

        chatRooms.value.set(userId, room)
      } else {
        const room: ChatRoom = {
          user_id: userId,
          username: chat.username,
          email: chat.email,
          avatar: chat.avatar,
          online: false,
          unread_count: 0,
          last_active_date: chat.last_active_date
        }

        chatRooms.value.set(userId, room)
        messages.value.set(userId, [])
      }
    })
  }

  function addIncomingMessages(messageDataList: any[]): void {
    console.log(messageDataList)

    for (const messageData of messageDataList) {
      for (const messageItem of messageData.messages) {
        const message: Message = {
          id: messageItem.id,
          sender_id: messageItem.sender_id,
          receiver_id: messageItem.receiver_id,
          message: messageItem.message,
          type: messageItem.type,
          status: 1,
          created_at: messageItem.created_at
        }
        console.log(message)

        const otherUserId = messageItem.sender_id

        if (!messages.value.has(otherUserId)) {
          messages.value.set(otherUserId, [])
        }
        messages.value.get(otherUserId)!.push(message)

        updateChatRoom(otherUserId, message, true)
      }
    }
  }

  function handleMessageAck(timestamp: string): void {
    pendingMessages.value.delete(timestamp)

    messages.value.forEach((msgList) => {
      const msg = msgList.find((m: Message) => m.created_at === timestamp)
      if (msg) {
        msg.sending = false
      }
    })
  }

  async function sendTextMessage(userId: number, text: string): Promise<void> {
    const timestamp = new Date().toISOString()

    const messageData: MessageData = {
      message: text,
      type: 1,
      time: timestamp
    }

    const localMessage: Message = {
      sender_id: authStore.user?.id || 0,
      receiver_id: userId,
      message: text,
      type: 1,
      status: 2,
      created_at: timestamp,
      sending: true
    }

    if (!messages.value.has(userId)) {
      messages.value.set(userId, [])
    }
    messages.value.get(userId)!.push(localMessage)

    pendingMessages.value.set(timestamp, localMessage)

    if (wsService.value && wsService.value.isConnected()) {
      wsService.value.sendPrivateMessage(userId, messageData)

      updateChatRoom(userId, localMessage, false)
    } else {
      console.error('WebSocket is not connected')
      localMessage.sending = false
      localMessage.error = true
    }
  }

  async function sendFileMessage(userId: number, file: File, type: number): Promise<void> {
    try {
      const response = await api.uploadFile(file)
      const filePath = response.message

      const timestamp = new Date().toISOString()

      const messageData: MessageData = {
        message: filePath,
        type: type,
        time: timestamp
      }

      const localMessage: Message = {
        sender_id: authStore.user?.id || 0,
        receiver_id: userId,
        message: filePath,
        type: type,
        status: 2,
        created_at: timestamp,
        sending: true
      }

      if (!messages.value.has(userId)) {
        messages.value.set(userId, [])
      }
      messages.value.get(userId)!.push(localMessage)

      if (wsService.value && wsService.value.isConnected()) {
        wsService.value.sendPrivateMessage(userId, messageData)
        updateChatRoom(userId, localMessage, false)
      } else {
        console.error('WebSocket is not connected')
        localMessage.sending = false
        localMessage.error = true
      }
    } catch (error) {
      console.error('Failed to send file:', error)
      throw error
    }
  }

  function setCurrentChat(userId: number): void {
    currentChatUserId.value = userId
    markAsRead(userId)
  }

  function markAsRead(userId: number): void {
    const room = chatRooms.value.get(userId)
    if (room) {
      room.unread_count = 0
    }
  }

  function updateChatRoom(userId: number, lastMessage: any, isIncoming: boolean): void {
    let room = chatRooms.value.get(userId)

    if (!room) {
      room = {
        user_id: userId,
        username: lastMessage.username,
        online: false,
        unread_count: 0,
        last_message: lastMessage
      }
      chatRooms.value.set(userId, room)
    } else {
      room.last_message = lastMessage
    }

    if (isIncoming && currentChatUserId.value !== userId) {
      room.unread_count++
    }
  }

  return {
    isConnected,
    chatRooms,
    messages,
    currentChatUserId,
    unreadCount,
    currentChatMessages,
    initializeWebSocket,
    disconnect,
    sendTextMessage,
    sendFileMessage,
    setCurrentChat,
    markAsRead
  }
})
