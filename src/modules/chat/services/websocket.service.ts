import { useCookies } from 'vue3-cookies'
import type { WSMessage, WSMessageReceived } from '../types'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectDelay = 30000 // 30 seconds
  private reconnectDelay = 1000 // Start with 1 second
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private shouldReconnect = true
  private connectionStatus: ConnectionStatus = 'disconnected'
  private messageHandlers: Array<(message: WSMessageReceived) => void> = []
  private statusChangeHandlers: Array<(status: ConnectionStatus) => void> = []

  constructor() {}

  /**
   * Подключение к WebSocket серверу
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      console.log('[WebSocket] Already connected or connecting')
      return
    }

    const { cookies } = useCookies()
    const token = cookies.get('access_token')

    if (!token) {
      console.error('[WebSocket] No access token found')
      this.setStatus('disconnected')
      return
    }

    const wsUrl = this.getWebSocketUrl(token)
    console.log('[WebSocket] Connecting to:', wsUrl.replace(token, '***'))

    try {
      this.setStatus('connecting')
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
    } catch (error) {
      console.error('[WebSocket] Connection error:', error)
      this.setStatus('disconnected')
      this.scheduleReconnect()
    }
  }

  /**
   * Отключение от WebSocket
   */
  disconnect(): void {
    console.log('[WebSocket] Disconnecting...')
    this.shouldReconnect = false

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.setStatus('disconnected')
  }

  /**
   * Отправка сообщения через WebSocket
   */
  send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify(message)
      this.ws.send(payload)
      console.log('[WebSocket] Sent:', message)
    } else {
      console.error('[WebSocket] Cannot send message, not connected')
    }
  }

  /**
   * Подписка на получение сообщений
   */
  onMessage(handler: (message: WSMessageReceived) => void): () => void {
    this.messageHandlers.push(handler)
    // Возвращаем функцию для отписки
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
    }
  }

  /**
   * Подписка на изменение статуса подключения
   */
  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusChangeHandlers.push(handler)
    // Сразу вызываем с текущим статусом
    handler(this.connectionStatus)
    // Возвращаем функцию для отписки
    return () => {
      this.statusChangeHandlers = this.statusChangeHandlers.filter((h) => h !== handler)
    }
  }

  /**
   * Получить текущий статус подключения
   */
  getStatus(): ConnectionStatus {
    return this.connectionStatus
  }

  /**
   * Формирование WebSocket URL
   */
  private getWebSocketUrl(token: string): string {
    const wsUrl = (import.meta.env.VITE_APP_WS_URL as string) || 'ws://localhost:8080'
    const cleanUrl = wsUrl.replace(/\/$/, '')
    return `${cleanUrl}/ws?token=${token}`
  }

  /**
   * Обработка открытия соединения
   */
  private handleOpen(): void {
    console.log('[WebSocket] Connected')
    this.setStatus('connected')
    this.reconnectAttempts = 0
    this.reconnectDelay = 1000
  }

  /**
   * Обработка закрытия соединения
   */
  private handleClose(event: CloseEvent): void {
    console.log('[WebSocket] Disconnected:', event.code, event.reason)
    this.setStatus('disconnected')

    if (this.shouldReconnect) {
      this.scheduleReconnect()
    }
  }

  /**
   * Обработка ошибки
   */
  private handleError(event: Event): void {
    console.error('[WebSocket] Error:', event)
  }

  /**
   * Обработка входящих сообщений
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessageReceived = JSON.parse(event.data)
      console.log('[WebSocket] Received:', message)

      // Обработка события ping - отвечаем pong
      if (message.event === 'ping') {
        this.send({ event: 'ping' })
      }

      // Уведомляем всех подписчиков
      this.messageHandlers.forEach((handler) => {
        try {
          handler(message)
        } catch (error) {
          console.error('[WebSocket] Error in message handler:', error)
        }
      })
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error)
    }
  }

  /**
   * Планирование переподключения
   */
  private scheduleReconnect(): void {
    if (!this.shouldReconnect) {
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectAttempts++
    this.setStatus('reconnecting')

    // Экспоненциальная задержка с максимумом
    const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, this.maxReconnectDelay)

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimeout = setTimeout(() => {
      console.log('[WebSocket] Attempting to reconnect...')
      this.connect()
    }, delay)
  }

  /**
   * Установка статуса и уведомление подписчиков
   */
  private setStatus(status: ConnectionStatus): void {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status
      console.log('[WebSocket] Status changed to:', status)

      this.statusChangeHandlers.forEach((handler) => {
        try {
          handler(status)
        } catch (error) {
          console.error('[WebSocket] Error in status change handler:', error)
        }
      })
    }
  }
}

// Singleton instance
let wsServiceInstance: WebSocketService | null = null

export function getWebSocketService(): WebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService()
  }
  return wsServiceInstance
}
