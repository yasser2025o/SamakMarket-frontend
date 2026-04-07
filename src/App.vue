<template>
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

  <template v-else>
    <FlashBanner />
    <RouterView />
  </template>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useI18nStore } from '@/stores/i18n'
import SplashScreen from './components/SplashScreen.vue'
import FlashBanner from './components/FlashBanner.vue'

const i18n = useI18nStore()

// 1. Gestion du Splash (SessionStorage)
const deja = sessionStorage.getItem('splashVu')
const showSplash = ref(!deja)

if (!deja) {
  sessionStorage.setItem('splashVu', '1')
}

// 2. Initialisation de la langue et de la direction
onBeforeMount(() => {
  const saved = localStorage.getItem('samak_lang')
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')

  // On ne change la langue que si l'URL le demande explicitement
  // Sinon on garde ce qui est sauvé, sinon Français
  let targetLang = saved || 'fr' 
  
  if (urlLang && ['fr', 'ar', 'darija', 'amazigh'].includes(urlLang)) {
    targetLang = urlLang
  }

  i18n.setLang(targetLang)
})

function detectLang() {
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  const saved = localStorage.getItem('samak_lang')
  const nav = navigator.language.split('-')[0]

  // Ordre de priorité : URL > LocalStorage > Navigateur > Défaut (fr)
  if (urlLang && ['fr', 'ar', 'darija', 'amazigh'].includes(urlLang)) return urlLang
  if (saved && ['fr', 'ar', 'darija', 'amazigh'].includes(saved)) return saved
  if (nav === 'ar') return 'darija'
  return ['fr', 'amazigh'].includes(nav) ? nav : 'fr'
}
</script>