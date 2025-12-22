export interface WSMessage {
  event: 'private_message' | 'ack' | 'ping'
  target_user_id?: number
  data?: MessageData | MessageReceived | string
}

export interface WSMessageReceived {
  event: 'connected' | 'ping' | 'new_message' | 'ack'
  data?: any
}

export interface MessageData {
  message: string
  type: number
  time: string
}

export interface MessageReceived {
  time: string
  admin: boolean
  message: string
  target_user_id: number
  type: number
}

export interface Message {
  id?: number
  sender_id: number
  receiver_id: number
  message: string
  type: number
  status: number
  created_at: string
  sending?: boolean
  error?: boolean
}

export interface UserMessage {
  sender_id: number
  sender_username: string
  sender_avatar?: string
  messages: Message[]
}

export interface ChatRoom {
  user_id: number
  username: string
  email?: string
  avatar?: string
  online: boolean
  last_message?: Message
  unread_count: number
  last_active_date?: string
}

export interface FileUploadResponse {
  message: string
}
