import { useCookies } from 'vue3-cookies'
import type { WSMessage, WSMessageReceived, MessageData } from '../types'

export class WebSocketService {
  private ws: WebSocket | null = null
  private baseUrl: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private heartbeatInterval: number | null = null
  private onMessageCallback: ((data: WSMessageReceived) => void) | null = null
  private onConnectedCallback: ((data: WSMessageReceived) => void) | null = null
  private onDisconnectedCallback: (() => void) | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const { cookies } = useCookies()
        const token = cookies.get('access_token')

        if (!token) {
          reject(new Error('No access token found'))
          return
        }

        const wsUrl = this.baseUrl + '/ws?token=' + token

        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.reconnectAttempts = 0
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data: WSMessageReceived = JSON.parse(event.data)
            this.handleMessage(data)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('WebSocket disconnected')
          this.stopHeartbeat()
          if (this.onDisconnectedCallback) {
            this.onDisconnectedCallback()
          }
          this.attemptReconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  disconnect(): void {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(message: WSMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  sendPrivateMessage(targetUserId: number, messageData: MessageData): void {
    const message: WSMessage = {
      event: 'private_message',
      target_user_id: targetUserId,
      data: messageData
    }
    this.send(message)
  }

  sendAck(timestamp: string): void {
    const message: WSMessage = {
      event: 'ack',
      data: timestamp
    }
    this.send(message)
  }

  private sendPing(): void {
    const message: WSMessage = {
      event: 'ping'
    }
    this.send(message)
  }

  private handleMessage(data: WSMessageReceived): void {
    switch (data.event) {
      case 'connected':
        console.log('Received connected event')
        if (this.onConnectedCallback) {
          this.onConnectedCallback(data)
        }
        break

      case 'ping':
        this.sendPing()
        break

      case 'new_message':
        if (this.onMessageCallback) {
          this.onMessageCallback(data)
        }
        if (data.data && data.data.target_user_id) {
          console.log(data.data.target_user_id)
          this.sendAck(data.data.target_user_id)
        }
        break

      case 'ack':
        if (this.onMessageCallback) {
          this.onMessageCallback(data)
        }
        break

      default:
        console.log('Unknown event:', data.event)
    }
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = window.setInterval(() => {
      this.sendPing()
    }, 3000)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  onMessage(callback: (data: WSMessageReceived) => void): void {
    this.onMessageCallback = callback
  }

  onConnected(callback: (data: WSMessageReceived) => void): void {
    this.onConnectedCallback = callback
  }

  onDisconnected(callback: () => void): void {
    this.onDisconnectedCallback = callback
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
