import { useCookies } from 'vue3-cookies'
import type { WSMessageReceived } from '../types'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export class WebSocketService {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectDelay = 30000
  private reconnectDelay = 1000
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private shouldReconnect = true
  private connectionStatus: ConnectionStatus = 'disconnected'
  private messageHandlers: Array<(message: WSMessageReceived) => void> = []
  private statusChangeHandlers: Array<(status: ConnectionStatus) => void> = []

  constructor() {}

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

  send(message: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify(message)
      this.ws.send(payload)
      // console.log('[WebSocket] Sent:', message)
    } else {
      console.error('[WebSocket] Cannot send message, not connected')
    }
  }

  onMessage(handler: (message: WSMessageReceived) => void): () => void {
    this.messageHandlers.push(handler)
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
    }
  }

  onStatusChange(handler: (status: ConnectionStatus) => void): () => void {
    this.statusChangeHandlers.push(handler)
    handler(this.connectionStatus)
    return () => {
      this.statusChangeHandlers = this.statusChangeHandlers.filter((h) => h !== handler)
    }
  }

  getStatus(): ConnectionStatus {
    return this.connectionStatus
  }

  private getWebSocketUrl(token: string): string {
    const wsUrl = (import.meta.env.VITE_APP_WS_URL as string) || 'ws://localhost:8080'
    const cleanUrl = wsUrl.replace(/\/$/, '')
    return `${cleanUrl}/ws?token=${token}`
  }

  private handleOpen(): void {
    console.log('[WebSocket] Connected')
    this.setStatus('connected')
    this.reconnectAttempts = 0
    this.reconnectDelay = 1000
  }

  private handleClose(event: CloseEvent): void {
    console.log('[WebSocket] Disconnected:', event.code, event.reason)
    this.setStatus('disconnected')

    if (this.shouldReconnect) {
      this.scheduleReconnect()
    }
  }

  private handleError(event: Event): void {
    console.error('[WebSocket] Error:', event)
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessageReceived = JSON.parse(event.data)
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

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) {
      return
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
    }

    this.reconnectAttempts++
    this.setStatus('reconnecting')

    const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, this.maxReconnectDelay)

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`)

    this.reconnectTimeout = setTimeout(() => {
      console.log('[WebSocket] Attempting to reconnect...')
      this.connect()
    }, delay)
  }

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

let wsServiceInstance: WebSocketService | null = null

export function getWebSocketService(): WebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService()
  }
  return wsServiceInstance
}
