import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ComputedRef, Ref } from 'vue'
import { useCookies } from 'vue3-cookies'

import { api } from '../api'

interface IAuthStore {
  isAuth: ComputedRef<boolean>
  user: Ref<any>
  getProfile: () => Promise<void>
  logout: () => void
}

const NAMESPACE = 'auth'

export const useAuth = defineStore(NAMESPACE, (): IAuthStore => {
  const { cookies } = useCookies()
  const router = useRouter()

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

  function logout() {
    cookies.remove('Authorization')
    router.push('/login')
    user.value = null
  }

  return {
    isAuth,
    user,
    getProfile,
    logout
  }
})
