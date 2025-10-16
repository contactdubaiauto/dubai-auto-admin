<template>
  <div class="p-3 h-full w-full scrollbar-hide overflow-y-auto border-r border-gray-200">
    <div class="w-full flex items-center justify-between mb-4">
      <div class="text-2xl font-bold text-center text-blue-800">Dubai Auto</div>
      <Button @click="logOut" icon="pi pi-sign-out" severity="secondary" />
    </div>
    <PanelMenu :model="items" class="w-full" multiple>
      <template #item="{ item }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a
            class="flex items-center cursor-pointer text-gray-700 dark:text-gray-0 px-4 py-2 rounded-md"
            :href="href"
            @click="navigate"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          class="flex items-center cursor-pointer text-gray-700 dark:text-gray-0 px-4 py-2 rounded-md"
          :href="item.url"
          :target="item.target"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="item.items" class="pi pi-angle-down text-gray-500 ml-auto" />
        </a>
      </template>
    </PanelMenu>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import PanelMenu from 'primevue/panelmenu'
  import { Button } from 'primevue'
  import { useCookies } from 'vue3-cookies'

  const { cookies } = useCookies()
  const router = useRouter()

  const items = ref([
    {
      label: 'Users',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Clients',
          icon: 'pi pi-user',
          route: '/users/client'
        },
        {
          label: 'Dealers',
          icon: 'pi pi-user',
          route: '/users/dealer'
        },
        {
          label: 'Logistics',
          icon: 'pi pi-user',
          route: '/users/logistician'
        },
        {
          label: 'Workshops',
          icon: 'pi pi-user',
          route: '/users/workshop'
        }
      ]
    },
    {
      label: 'Car settings',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Brands',
          icon: 'pi pi-database',
          route: '/car-settings/brands'
        },
        {
          label: 'Body types',
          icon: 'pi pi-database',
          route: '/car-settings/body-types'
        },
        {
          label: 'Drivetrains',
          icon: 'pi pi-database',
          route: '/car-settings/drivetrains'
        },
        {
          label: 'Engines',
          icon: 'pi pi-database',
          route: '/car-settings/engines'
        },
        {
          label: 'Fuel types',
          icon: 'pi pi-database',
          route: '/car-settings/fuel-types'
        },
        {
          label: 'Transmissions',
          icon: 'pi pi-database',
          route: '/car-settings/transmissions'
        }
      ]
    },
    {
      label: 'Motorcycle settings',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Categories',
          icon: 'pi pi-database',
          route: '/motorcycle-settings/categories'
        },
        {
          label: 'Parameters',
          icon: 'pi pi-database',
          route: '/motorcycle-settings/parameters'
        }
      ]
    },
    {
      label: 'Truck settings',
      icon: 'pi pi-truck',
      items: [
        {
          label: 'Categories',
          icon: 'pi pi-database',
          route: '/truck-settings/categories'
        },
        {
          label: 'Parameters',
          icon: 'pi pi-database',
          route: '/truck-settings/parameters'
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Cities',
          icon: 'pi pi-database',
          route: '/settings/cities'
        },
        {
          label: 'Colors',
          icon: 'pi pi-database',
          route: '/settings/colors'
        },
        {
          label: 'Admin users',
          icon: 'pi pi-database',
          route: '/settings/admin-users'
        }
      ]
    }
  ])

  function logOut() {
    cookies.remove('access_token')
    cookies.remove('refresh_token')
    router.push('/login')
  }
</script>

<style scoped lang="scss"></style>
