<template>
  <div class="w-full h-full flex flex-col">
    <div class="bg-white h-16 border-b border-gray-200 p-4 flex items-center gap-3">
      <Button @click="back" icon="pi pi-arrow-left" severity="secondary" />
      <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
        <img src="/logo.png" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      <div class="flex-1">
        <div class="font-semibold text-gray-800 truncate">John Doe</div>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <div class="w-full mb-1">
        <div class="max-w-[600px] w-fit bg-white border border-gray-200 rounded-xl p-4 relative">
          <p class="text-gray-800 font-medium">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit se
            <span class="text-xs text-gray-800 pl-1 opacity-0 user-select-none">12.12.25 12:00</span>
          </p>
          <div class="text-xs text-gray-800 absolute right-2 bottom-2 opacity-70">12.12.25 12:00</div>
        </div>
      </div>
      <div class="w-full mb-1">
        <div
          class="max-w-[600px] ml-auto w-fit bg-primary-500 border border-primary-500 text-white rounded-xl p-4 relative"
        >
          <p class="text-white font-medium">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Reprehenderit se
            <span class="text-xs text-white pl-1 opacity-0 user-select-none">12.12.25 12:00</span>
          </p>
          <div class="text-xs text-white absolute right-2 bottom-2 opacity-70">12.12.25 12:00</div>
        </div>
      </div>
      <div class="w-full mb-1">
        <div class="w-[300px] h-[300px] bg-white border border-gray-200 rounded-xl p-4 relative">
          <img src="/logo.png" alt="Image" class="w-full h-full object-cover" />
          <div class="absolute bottom-2 right-2 bg-gray-100 border border-gray-200 rounded-md px-1">
            <span class="text-xs text-gray-800">12.12.25 12:00</span>
          </div>
        </div>
      </div>
      <div class="w-full mb-1">
        <div class="w-[300px] h-[300px] ml-auto bg-primary-500 border border-primary-500 rounded-xl p-4 relative">
          <img src="/logo.png" alt="Image" class="w-full h-full object-cover" />
          <div class="absolute bottom-2 right-2 bg-gray-100 border border-gray-200 rounded-md px-1">
            <span class="text-xs text-gray-800">12.12.25 12:00</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white border-t border-gray-200 p-4">
      <div class="flex items-end gap-2">
        <Textarea
          v-model="message"
          placeholder="Введите сообщение..."
          :autoResize="true"
          rows="1"
          class="flex-1"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <Button
          icon="pi pi-paperclip"
          severity="secondary"
          outlined
          @click="toggleMenu"
          aria-haspopup="true"
          aria-controls="attachment_menu"
        />
        <Menu ref="menuRef" id="attachment_menu" :model="menuItems" :popup="true" />
        <Button icon="pi pi-send" @click="sendMessage" :disabled="!message.trim()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Button, Textarea, Menu } from 'primevue'
  import type { MenuItem } from 'primevue/menuitem'

  const router = useRouter()

  const message = ref('')
  const menuRef = ref()

  const menuItems = ref<MenuItem[]>([
    {
      label: 'Изображение',
      icon: 'pi pi-image',
      command: () => {
        console.log('Изображение')
      }
    },
    {
      label: 'Видео',
      icon: 'pi pi-video',
      command: () => {
        console.log('Видео')
      }
    }
  ])

  function back() {
    router.push('/chat')
  }

  function toggleMenu(event: Event) {
    menuRef.value?.toggle(event)
  }

  function sendMessage() {
    if (!message.value.trim()) return

    message.value = ''
  }
</script>

<style scoped></style>
