export enum MessageType {
  TEXT = 1,
  ITEM = 2,
  VIDEO = 3,
  IMAGE = 4,
  FILE = 5
}

export enum MessageStatus {
  UNREAD = 1,
  READ = 2
}

export interface WSMessage {
  event: 'private_message' | 'ack' | 'ping'
  target_user_id?: number
  data?: MessageData | string
}

export interface WSMessageReceived {
  event: 'connected' | 'ping' | 'new_message' | 'ack'
  data?: any
}

export interface MessageData {
  message: string
  type: MessageType
  time: string
}

export interface Message {
  id?: number
  sender_id: number
  receiver_id: number
  message: string
  type: MessageType
  status: MessageStatus
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
