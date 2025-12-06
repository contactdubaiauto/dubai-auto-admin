import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'

interface IChatStore {
  isConnected: Ref<boolean>
}

const NAMESPACE = 'chat'

export const useChatStore = defineStore(NAMESPACE, (): IChatStore => {
  const isConnected = ref(false)

  return {
    isConnected
  }
})
