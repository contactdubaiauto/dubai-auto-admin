<template>
  <div class="p-3 h-full w-full border-r border-gray-200 flex flex-col">
    <div class="w-full flex items-center gap-3 mb-4">
      <img class="w-8 h-8 object-contain object-center" src="/logo.png" />
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
    <div class="pt-2 w-full">
      <SelectButton
        v-model="selectedLanguage"
        @change="selectLanguage"
        option-label="title"
        option-value="code"
        :options="languages"
        fluid
      />
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
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import PanelMenu from 'primevue/panelmenu'
  import { Button, SelectButton } from 'primevue'
  import { useCookies } from 'vue3-cookies'

  import { useAuth } from '@/modules/auth/stores'

  const { cookies } = useCookies()
  const router = useRouter()
  const authStore = useAuth()
  const { locale, t } = useI18n()

  const { user } = authStore

  interface ILanguage {
    code: string
    title: string
  }

  const languages = [
    { code: 'ru', title: 'Русский' },
    { code: 'en', title: 'English' }
  ] as ILanguage[]

  const selectedLanguage = ref<string>(languages[0].code)
  function selectLanguage(lang: any) {
    selectedLanguage.value = lang.value
    locale.value = lang.value
    cookies.set('language', lang.value, 100000000)
  }

  if (locale.value) {
    const findLanguage = languages.find((language) => language.code === locale.value)
    if (findLanguage) {
      selectedLanguage.value = findLanguage.code
    }
  }

  const items = computed(() => [
    {
      label: t('sidebar.applications'),
      icon: 'pi pi-users',
      items: [
        {
          label: t('sidebar.dealers'),
          icon: 'pi pi-user',
          route: '/application/dealers'
        },
        {
          label: t('sidebar.logistics'),
          icon: 'pi pi-user',
          route: '/application/logistics'
        },
        {
          label: t('sidebar.carServices'),
          icon: 'pi pi-user',
          route: '/application/car-services'
        },
        {
          label: t('sidebar.brokers'),
          icon: 'pi pi-user',
          route: '/application/brokers'
        }
      ]
    },
    {
      label: t('sidebar.users'),
      icon: 'pi pi-users',
      items: [
        {
          label: t('sidebar.clients'),
          icon: 'pi pi-user',
          route: '/user/clients'
        },
        {
          label: t('sidebar.dealers'),
          icon: 'pi pi-user',
          route: '/user/dealers'
        },
        {
          label: t('sidebar.logistics'),
          icon: 'pi pi-user',
          route: '/user/logistics'
        },
        {
          label: t('sidebar.carServices'),
          icon: 'pi pi-user',
          route: '/user/car-services'
        },
        {
          label: t('sidebar.brokers'),
          icon: 'pi pi-user',
          route: '/user/brokers'
        }
      ]
    },
    {
      label: t('sidebar.carSettings'),
      icon: 'pi pi-car',
      items: [
        {
          label: t('sidebar.brands'),
          icon: 'pi pi-database',
          route: '/car-settings/brands'
        },
        {
          label: t('sidebar.bodyTypes'),
          icon: 'pi pi-database',
          route: '/car-settings/body-types'
        },
        {
          label: t('sidebar.drivetrains'),
          icon: 'pi pi-database',
          route: '/car-settings/drivetrains'
        },
        {
          label: t('sidebar.engines'),
          icon: 'pi pi-database',
          route: '/car-settings/engines'
        },
        {
          label: t('sidebar.fuelTypes'),
          icon: 'pi pi-database',
          route: '/car-settings/fuel-types'
        },
        {
          label: t('sidebar.transmissions'),
          icon: 'pi pi-database',
          route: '/car-settings/transmissions'
        }
      ]
    },
    {
      label: t('sidebar.motorcycleSettings'),
      icon: 'pi pi-car',
      items: [
        {
          label: t('sidebar.categories'),
          icon: 'pi pi-database',
          route: '/motorcycle-settings/categories'
        },
        {
          label: t('sidebar.parameters'),
          icon: 'pi pi-database',
          route: '/motorcycle-settings/parameters'
        }
      ]
    },
    {
      label: t('sidebar.truckSettings'),
      icon: 'pi pi-truck',
      items: [
        {
          label: t('sidebar.categories'),
          icon: 'pi pi-database',
          route: '/truck-settings/categories'
        },
        {
          label: t('sidebar.parameters'),
          icon: 'pi pi-database',
          route: '/truck-settings/parameters'
        }
      ]
    },
    {
      label: t('sidebar.general'),
      icon: 'pi pi-cog',
      items: [
        {
          label: t('sidebar.cities'),
          icon: 'pi pi-database',
          route: '/general/cities'
        },
        {
          label: t('sidebar.colors'),
          icon: 'pi pi-database',
          route: '/general/colors'
        },
        {
          label: t('sidebar.activityFields'),
          icon: 'pi pi-database',
          route: '/general/activity-fields'
        },
        {
          label: t('sidebar.companyTypes'),
          icon: 'pi pi-database',
          route: '/general/company-types'
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
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
