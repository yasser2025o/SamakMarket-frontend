<template>
  <nav class="sticky top-0 z-[60] w-full bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 px-4 shadow-2xl border-b border-white/10 backdrop-blur-sm">
    
    <div class="max-w-7xl mx-auto flex items-center justify-between h-20 md:h-24">
      
      <div class="flex-shrink-0 flex items-center h-full max-h-16 md:max-h-24 py-1 gap-4">
        <RouterLink to="/" 
          class="group relative flex items-center hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          
          <img src="/log.png" alt="🐟 Icône Samak Market" 
               class="h-12 md:h-16 w-auto object-contain drop-shadow-xl transition-all duration-500 group-hover:-rotate-2">

          <div class="ml-2 flex flex-col font-sans uppercase min-w-0">
            <div class="flex items-baseline leading-none">
              <span class="text-lg md:text-3xl font-extrabold text-teal-300 tracking-tighter drop-shadow-lg">
                Samak
              </span>
              <span class="ml-1 text-base md:text-2xl font-bold text-slate-100 opacity-90">
                Market
              </span>
            </div>
            <span class="mt-0.5 text-[8px] xs:text-[9px] md:text-xs font-medium text-slate-400 normal-case tracking-tight opacity-90 truncate">
              من البحر لدارك مباشرة 🐟
            </span>
          </div>
          <div class="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-to-r from-teal-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
        </RouterLink>

        <div class="flex items-center">
          <LanguageSelector />
        </div>
      </div>

      <div class="hidden md:flex items-center gap-4 text-white">
        <template v-if="auth?.estConnecte">
          <RouterLink v-if="auth.estVendeur || auth.estAdmin" to="/dashboard" 
                      class="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-colors">
            📊 Dashboard
          </RouterLink>
          <button @click="seDeconnecter" class="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-xl font-bold transition-colors">
            Déconnexion
          </button>
        </template>
        
        <template v-else>
          <RouterLink to="/login" class="font-semibold text-blue-100 hover:text-white transition-colors">Connexion</RouterLink>
          <RouterLink to="/register" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all">
            Rejoignez-nous
          </RouterLink>
        </template>
      </div>

      <button @click="menuOuvert = !menuOuvert" class="md:hidden p-3 bg-white/10 rounded-2xl border border-white/20 shadow-lg text-white">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path v-if="!menuOuvert" d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/>
          <path v-else d="M6 18L18 6M6 6l12 12" stroke-linecap="round"/>
        </svg>
      </button>

    </div>

    <div v-if="menuOuvert" class="md:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-4 shadow-2xl text-white">
      
        <template v-if="auth?.estConnecte">
          <RouterLink v-if="auth.estVendeur || auth.estAdmin" 
                      to="/dashboard" 
                      @click="menuOuvert = false" 
                      class="p-4 bg-white/10 rounded-xl text-center font-bold">
            📊 Tableau de Bord
          </RouterLink>
          
          <button @click="seDeconnecter" 
                  class="p-4 bg-red-600/80 hover:bg-red-600 rounded-xl text-center font-bold transition-all">
            🚪 Se déconnecter
          </button>
        </template>

        <template v-else>
          <RouterLink to="/login" @click="menuOuvert = false" class="p-4 bg-white/5 rounded-xl text-center font-bold italic">
            Connexion
          </RouterLink>
          <RouterLink to="/register" @click="menuOuvert = false" class="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-center font-bold shadow-lg">
            S'inscrire / Rejoignez-nous
          </RouterLink>
        </template>
         
    </div>

  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// IMPORTATION CRITIQUE : Assure-toi que le chemin est correct
import { useAuthStore } from '@/stores/auth' 
import { useI18nStore } from '../stores/i18n'
import LanguageSelector from './LanguageSelector.vue'
const i18n = useI18nStore()
const langs = [
  { code: 'fr',      label: 'FR',         flag: '🇫🇷' },
  { code: 'darija',  label: 'درجة',       flag: '🇲🇦' },
  { code: 'ar',      label: 'عربي',       flag: '🕌'  },
  { code: 'amazigh', label: 'ⵜⵎⵣⵉⵖⵜ',   flag: '🏔️' },
]
const router = useRouter()
const auth = useAuthStore() // L'objet 'auth' est maintenant défini
const menuOuvert = ref(false)

const seDeconnecter = async () => {
  try {
    // Corrected: use the function name defined in src/stores/auth.js
    await auth.seDeconnecter() 
    
    menuOuvert.value = false
    router.push('/login')
  } catch (error) {
    console.error("Erreur déconnexion:", error)
  }
}

const toggleMenu = () => {
  menuOuvert.value = !menuOuvert.value
}

const closeMenu = () => {
  menuOuvert.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>