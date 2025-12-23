class NotificationService {
  private soundEnabled: boolean = true
  private audioContext: AudioContext | null = null
  private permission: NotificationPermission = 'default'

  constructor() {
    if (typeof window !== 'undefined') {
      this.permission = Notification.permission
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied'
    }

    if (this.permission === 'default') {
      try {
        this.permission = await Notification.requestPermission()
      } catch (error) {
        console.error('[NotificationService] Error requesting permission:', error)
        this.permission = 'denied'
      }
    }

    return this.permission
  }

  async showNotification(from: string, message: string, avatar?: string, roomId?: number): Promise<void> {
    if (!this.isSupported()) {
      return
    }

    const currentPermission = typeof window !== 'undefined' ? Notification.permission : 'denied'
    this.permission = currentPermission

    if (currentPermission === 'default') {
      const requestedPermission = await this.requestPermission()
      if (requestedPermission !== 'granted') {
        return
      }
    }

    if (this.permission !== 'granted') {
      return
    }

    const messagePreview = message.length > 100 ? message.substring(0, 100) + '...' : message
    const displayMessage = messagePreview || 'Новое сообщение'

    try {
      const notification = new Notification(from, {
        body: displayMessage,
        icon: avatar || '/icon.png',
        badge: '/icon.png',
        tag: `chat-${roomId || 'new'}`,
        requireInteraction: false
      })

      notification.onclick = () => {
        window.focus()
        if (roomId) {
          window.location.href = `/chat/${roomId}`
        } else {
          window.location.href = '/chat'
        }
        notification.close()
      }

      setTimeout(() => {
        notification.close()
      }, 5000)

      if (this.soundEnabled) {
        this.playSound()
      }
    } catch (error) {
      console.error('[NotificationService] Error showing notification:', error)
    }
  }

  playSound(): void {
    if (!this.soundEnabled) {
      return
    }

    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.error('[NotificationService] Error playing sound:', error)
    }
  }

  enableSound(): void {
    this.soundEnabled = true
  }

  disableSound(): void {
    this.soundEnabled = false
  }

  getPermission(): NotificationPermission {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission
    }
    return this.permission
  }
}

let notificationServiceInstance: NotificationService | null = null

export function getNotificationService(): NotificationService {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService()
  }
  return notificationServiceInstance
}
