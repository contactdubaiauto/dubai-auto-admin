import { ref } from 'vue'

export function usePopUp() {
  const showPopUp = ref(false)
  const loading = ref(false)

  function openPopUp() {
    showPopUp.value = true
  }

  function closePopUp() {
    showPopUp.value = false
  }

  return {
    showPopUp,
    loading,
    openPopUp,
    closePopUp
  }
}
