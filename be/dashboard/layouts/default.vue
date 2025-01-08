<template>
  <div class="w-screen h-screen gap-4 p-2 bg-gradient-to-br from-zinc-50 to-stone-300">
    <!-- Navbar -->
    <div class="flex flex-row items-center justify-between w-full gap-2 px-4 py-2">
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
    <div class="flex flex-row w-full gap-2">

      <!-- menu -->
      <div class="flex flex-col gap-2 p-4 w-52">
        <NuxtLink class="py-1" to="/">Dashboard</NuxtLink>
        <NCollapse arrow-placement="right" >
          <NCollapseItem name="organizzazione" >
            <template #header>
              <div :class="isOrganizzazioneActive ? 'border-b-2 border-b-rose-400 px-2 -mx-2': ''">
                Organizzazione
              </div>
            </template>
            <div class="flex flex-col gap-2">
              <NuxtLink class="py-1" to="/organizzazione/divisione">Divisioni</NuxtLink>
              <NuxtLink class="py-1" to="/organizzazione/ufficio">Uffici</NuxtLink>
              <NuxtLink class="py-1 border-b border-stone-500" to="/organizzazione/servizio">Servizi</NuxtLink>
            </div>
          </NCollapseItem>
        </NCollapse>
        <NuxtLink class="py-1" to="/dipendenti">Contatti</NuxtLink>
        <NuxtLink class="py-1" to="/news">News</NuxtLink>
        <NuxtLink class="py-1" to="/eventi">Eventi</NuxtLink>
        <NCollapse arrow-placement="right" >
          <NCollapseItem name="contenuti">
            <template #header>
              <div :class="isContenutiActive ? 'border-b-2 border-b-rose-400 px-2 -mx-2': ''">
                Contenuti
              </div>
            </template>
            <div class="flex flex-col gap-2">
              <NuxtLink class="py-1" to="/contenuti/link">Link</NuxtLink>
              <NuxtLink class="py-1" to="/contenuti/download">Download</NuxtLink>
              <NuxtLink class="py-1 border-b border-stone-500" to="/contenuti/avvocatura">Avvocatura</NuxtLink>
              <NDivider />
            </div>
          </NCollapseItem>
        </NCollapse>
      </div>
      <div class="w-full h-full p-4 bg-white bg-opacity-50 shadow rounded-2xl backdrop-blur-lg">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCollapse, NCollapseItem, NImage, NInput, NIcon, NDivider } from 'naive-ui'
import { LOGO_PATH } from '#build/imports';
import { Search } from '@vicons/ionicons5'

import { ref, watch } from 'vue'

const route = useRoute()

const isOrganizzazioneActive = ref(false)
const isContenutiActive = ref(false)

watch(
  () => route.path,
  (newValue, oldValue) => {
    isOrganizzazioneActive.value = newValue.includes("organizzazione")
    isContenutiActive.value = newValue.includes("contenuti")
  },
  { deep: true }
)
</script>

<style>
.router-link-active {
  @apply bg-rose-400 rounded-full px-2 -mx-2 shadow font-semibold text-white
}
</style>