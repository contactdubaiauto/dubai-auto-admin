import { defineStore } from 'pinia'
import { ref, computed, onUnmounted } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { getWebSocketService } from '../services/websocket.service'
import type { WSMessageReceived } from '../types'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

interface IChatStore {
  connectionStatus: Ref<ConnectionStatus>
  isConnected: ComputedRef<boolean>
  initWebSocket: () => void
  disconnectWebSocket: () => void
  sendMessage: (message: any) => void
  onMessage: (handler: (message: WSMessageReceived) => void) => () => void
}

const NAMESPACE = 'chat'

export const useChatStore = defineStore(NAMESPACE, (): IChatStore => {
  const connectionStatus = ref<ConnectionStatus>('disconnected')
  const wsService = getWebSocketService()
  let unsubscribeStatus: (() => void) | null = null

  const isConnected = computed(() => connectionStatus.value === 'connected')

  /**
   * Инициализация WebSocket подключения
   */
  function initWebSocket(): void {
    console.log('[ChatStore] Initializing WebSocket...')

    // Подписываемся на изменения статуса
    unsubscribeStatus = wsService.onStatusChange((status) => {
      connectionStatus.value = status
    })

    // Устанавливаем соединение
    wsService.connect()
  }

  /**
   * Отключение от WebSocket
   */
  function disconnectWebSocket(): void {
    console.log('[ChatStore] Disconnecting WebSocket...')

    if (unsubscribeStatus) {
      unsubscribeStatus()
      unsubscribeStatus = null
    }

    wsService.disconnect()
    connectionStatus.value = 'disconnected'
  }

  /**
   * Отправка сообщения
   */
  function sendMessage(message: any): void {
    wsService.send(message)
  }

  /**
   * Подписка на входящие сообщения
   */
  function onMessage(handler: (message: WSMessageReceived) => void): () => void {
    return wsService.onMessage(handler)
  }

  return {
    connectionStatus,
    isConnected,
    initWebSocket,
    disconnectWebSocket,
    sendMessage,
    onMessage
  }
})
