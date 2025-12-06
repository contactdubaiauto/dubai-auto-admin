import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ComputedRef, Ref } from 'vue'
import { useCookies } from 'vue3-cookies'
import { useChatStore } from '@/modules/chat/stores'

import { api } from '../api'

interface IAuthStore {
  isAuth: ComputedRef<boolean>
  user: Ref<any>
  getProfile: () => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const NAMESPACE = 'auth'

export const useAuth = defineStore(NAMESPACE, (): IAuthStore => {
  const { cookies } = useCookies()
  const router = useRouter()

  const chatStore = useChatStore()

  const user = ref<any>()

  const isAuth = computed((): boolean => !!user.value)

  async function getProfile(): Promise<void> {
    try {
      const data = await api.getProfile()

      user.value = data
    } catch (error) {
      console.error(error)
    }
  }

  async function logout() {
    try {
      chatStore.disconnect()
    } catch (error) {
      console.error('Failed to disconnect chat:', error)
    }

    cookies.remove('access_token')
    router.push('/login')
    user.value = null
  }

  function hasPermission(permission: string): boolean {
    if (!user.value || !user.value.permissions) {
      return false
    }
    return user.value.permissions.includes(permission)
  }

  return {
    isAuth,
    user,
    getProfile,
    logout,
    hasPermission
  }
})
