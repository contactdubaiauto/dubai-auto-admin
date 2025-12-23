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
    console.log('[NotificationService] showNotification called', { from, message: message.substring(0, 50), roomId })

    if (!this.isSupported()) {
      console.warn('[NotificationService] Notifications are not supported in this browser')
      return
    }

    // Динамически проверяем актуальное разрешение
    const currentPermission = typeof window !== 'undefined' ? Notification.permission : 'denied'
    this.permission = currentPermission

    console.log('[NotificationService] Current permission:', currentPermission)

    // Если разрешение 'default', пытаемся запросить его
    if (currentPermission === 'default') {
      console.log('[NotificationService] Permission is default, requesting permission...')
      const requestedPermission = await this.requestPermission()
      console.log('[NotificationService] Permission requested, result:', requestedPermission)

      if (requestedPermission !== 'granted') {
        console.warn(
          '[NotificationService] Permission not granted, cannot show notification. Status:',
          requestedPermission
        )
        return
      }
    }

    // Проверяем разрешение еще раз перед показом
    if (this.permission !== 'granted') {
      console.warn('[NotificationService] Permission denied, cannot show notification')
      return
    }

    const messagePreview = message.length > 100 ? message.substring(0, 100) + '...' : message
    const displayMessage = messagePreview || 'Новое сообщение'

    try {
      console.log('[NotificationService] Creating notification...')
      const notification = new Notification(from, {
        body: displayMessage,
        icon: avatar || '/icon.png',
        badge: '/icon.png',
        tag: `chat-${roomId || 'new'}`,
        requireInteraction: false
      })
      console.log('[NotificationService] Notification created successfully')

      // Обработка клика по уведомлению
      notification.onclick = () => {
        window.focus()
        if (roomId) {
          window.location.href = `/chat/${roomId}`
        } else {
          window.location.href = '/chat'
        }
        notification.close()
      }

      // Автоматически закрываем уведомление через 5 секунд
      setTimeout(() => {
        notification.close()
      }, 5000)

      // Воспроизводим звук
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
      // Создаем AudioContext если его еще нет
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Настройки звука (beep)
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
    // Возвращаем актуальное значение разрешения
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
