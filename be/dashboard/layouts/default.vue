<template>
  <div class="flex flex-col w-full h-full min-h-screen px-4 py-2 text-white min-w-max bg-primary-400">
    <!-- Navbar -->
    <div class="fixed z-50 flex flex-row items-center justify-between w-full gap-2 px-4 py-2 bg-primary-400">
      <div class="flex flex-row items-center gap-4">
        <NImage :src="LOGO_PATH" width="48" />
        <span class="text-lg">Città di Rivoli - Intranet</span>
      </div>
      <div class="w-80">
        <NInput round placeholder="Cerca...">
          <template #suffix>
            <NIcon :component="Search" />
          </template>
        </NInput>
      </div>
      <div class="flex flex-row gap-2">
        <div>User</div>
        <div>Add Element</div>
      </div>
    </div>
    <div class="flex flex-row w-full h-full gap-2 mt-20 grow">
      <!-- menu -->
      <div class="sticky left-0 z-40 flex flex-col gap-2 p-4 bg-opacity-50 bg-primary-400 backdrop-blur-md w-52">
        <MenuItem 
          v-for="(item, index) in menu" 
          :key="item.slug"
          :menuItem="item"
          :hasChildren="Boolean(item?.children?.length) || false"
        >
          <template #menuIcon>
            <NIcon :component="item.icon" size="20" />
          </template>
        </MenuItem>
      </div>
      <div class="flex w-full mt-6 grow">
        <div class="z-20 flex w-full p-4 bg-white shadow-lg grow rounded-2xl backdrop-blur-xl">
          <div class="w-full h-full">
            <NuxtPage />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage, NInput, NIcon } from 'naive-ui'
import { LOGO_PATH } from '#build/imports';
import { Search, People, Apps, Podium, Newspaper, Calendar, FolderOpen } from '@vicons/ionicons5'
import MenuItem from '~/components/MenuItem.vue';

import { ref } from 'vue'

const menu = ref([
  {
    label: 'Dashboard',
    to: '/',
    slug: 'dashboard',
    icon: Apps
  },
  {
    label: 'Organizzazione',
    slug: 'organizzazione',
    icon: Podium,
    children: [
      {
        label: 'Direzioni',
        to: '/organizzazione/direzione',
        slug: 'organizzazione-direzione'
      },
      {
        label: 'Servizi',
        to: '/organizzazione/servizio',
        slug: 'organizzazione-servizio'
      },
      {
        label: 'Uffici',
        to: '/organizzazione/ufficio',
        slug: 'organizzazione-ufficio'
      },
    ]
  },
  {
    label: 'Contatti',
    to: '/dipendenti',
    slug: 'dipendenti',
    icon: People
  },
  {
    label: 'News',
    to: '/news',
    slug: 'news',
    icon: Newspaper
  },
  {
    label: 'Eventi',
    to: '/eventi',
    slug: 'eventi',
    icon: Calendar
  },
  {
    label: 'Contenuti',
    slug: 'contenuti',
    icon: FolderOpen,
    children: [
      {
        label: 'Link',
        to: '/contenuti/link',
        slug: 'contenuti-link'
      },
      {
        label: 'Uffici',
        to: '/contenuti/download',
        slug: 'contenuti-download'
      },
      {
        label: 'Servizi',
        to: '/contenuti/avvocatura',
        slug: 'contenuti-avvocatura'
      },
    ]
  },
])
</script>