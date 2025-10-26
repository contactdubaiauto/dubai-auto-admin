<template>
  <div class="p-3 h-full w-full border-r border-gray-200 flex flex-col">
    <div class="w-full flex items-center justify-between mb-4">
      <div class="text-2xl font-bold text-center text-blue-800">Masynbazar</div>
    </div>
    <div class="flex-1 scrollbar-hide overflow-y-auto">
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
    <div class="pt-2">
      <div class="flex gap-3 w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-200">
        <div class="flex-1">
          <div class="font-semibold text-gray-800">{{ user.username }}</div>
          <div class="mt-1 font-semibold text-gray-400">{{ user.email }}</div>
        </div>
        <Button @click="logOut" icon="pi pi-sign-out" severity="secondary" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import PanelMenu from 'primevue/panelmenu'
  import { Button } from 'primevue'
  import { useCookies } from 'vue3-cookies'

  import { useAuth } from '@/modules/auth/stores'

  const { cookies } = useCookies()
  const router = useRouter()
  const authStore = useAuth()

  const { user } = authStore

  const items = ref([
    {
      label: 'Applications',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Dealers',
          icon: 'pi pi-user',
          route: '/application/dealers'
        },
        {
          label: 'Logistics',
          icon: 'pi pi-user',
          route: '/application/logistics'
        },
        {
          label: 'Car services',
          icon: 'pi pi-user',
          route: '/application/car-services'
        },
        {
          label: 'Brokers',
          icon: 'pi pi-user',
          route: '/application/brokers'
        }
      ]
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      items: [
        {
          label: 'Clients',
          icon: 'pi pi-user',
          route: '/user/clients'
        },
        {
          label: 'Dealers',
          icon: 'pi pi-user',
          route: '/user/dealers'
        },
        {
          label: 'Logistics',
          icon: 'pi pi-user',
          route: '/user/logistics'
        },
        {
          label: 'Car services',
          icon: 'pi pi-user',
          route: '/user/car-services'
        },
        {
          label: 'Brokers',
          icon: 'pi pi-user',
          route: '/user/brokers'
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

<style scoped lang="scss">
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none; /* IE и Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
