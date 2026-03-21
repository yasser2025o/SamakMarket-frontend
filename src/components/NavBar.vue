<template>
  <!-- NAVBAR ANIMÉE VAGUE SAMAKMARKET -->
  <nav class="sticky top-0 z-[60] 
            bg-gradient-to-r from-slate-900 via-blue-900 to-teal-800 
            text-white font-sans 
            px-1 py-2 sm:py-5 
            shadow-2xl border-b border-white/10 backdrop-blur-sm">
  
  <div class="flex items-center justify-between h-12 sm:h-14 md:h-16">
      
      <!-- LOGO SAMAK RESPONSIVE -->
     <!-- </div><div class="w-44 sm:w-64 md:w-80 lg:w-96 xl:w-[28rem] -mt-8 sm:-mt-12 md:-mt-16 lg:-mt-10 flex-shrink-0"> -->
      <!-- <div class="w-44 md:w-80 lg:w-[40rem] md:md:-mt-1 flex-shrink-0"> -->
        <div class="w-46 md:w-80 lg:w-[30rem] md:-mt-12 flex-shrink-0">
  <RouterLink to="/" 
    class="group block absolute -bottom-0 sm:-bottom-1  lg:-bottom-1 xl:-bottom-1 
           left-0 hover:scale-[1.12] active:scale-[0.98] z-50 cursor-pointer">
    <img src="/log.png" alt="🐟 Samak Market" 
         class="h-16 md:h-40 w-auto object-contain 
              drop-shadow-xl transition-all duration-500 
              group-hover:drop-shadow-2xl group-hover:-rotate-2">
  </RouterLink>
</div>

      <!-- MENU DESKTOP -->
      <div class="hidden lg:flex items-center gap-3">
        <!-- Badge vague du jour -->
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div class="w-2.5 h-2.5 bg-gradient-to-t from-emerald-400 to-teal-500 rounded-full animate-bounce"></div>
          <span class="font-semibold text-sm text-blue-100">Live 🐟</span>
        </div>
      </div>

      <!-- ACTIONS + HAMBURGER -->
      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center gap-2 sm:gap-3">
          
          <!-- Connecté -->
          <template v-if="auth.estConnecte">
            <!-- Avatar -->
            <div class="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-3 py-2 rounded-2xl border border-white/20">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span class="text-lg sm:text-xl font-black text-white leading-none">
                  {{ auth.user?.name?.[0]?.toUpperCase() || 'U' }}
                </span>
              </div>
              <span class="font-semibold text-sm sm:text-base text-blue-100 max-w-28 truncate hidden lg:inline">
                {{ auth.user?.name }}
              </span>
            </div>
            
            <!-- Dashboard -->
            <RouterLink v-if="auth.estVendeur || auth.estAdmin"
              to="/dashboard"
              class="group relative px-5 sm:px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 
                    backdrop-blur-sm font-semibold text-white shadow-xl hover:shadow-2xl 
                    hover:scale-[1.05] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
              <span class="flex items-center gap-2 relative z-10">
                📊
                <span class="hidden sm:inline">Dashboard</span>
              </span>
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-transparent 
                          -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </RouterLink>

            <!-- Déconnexion -->
            <button @click="seDeconnecter"
              class="px-5 sm:px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500/20 to-red-500/20 
                     hover:from-rose-500/40 hover:to-red-500/40 border-2 border-white/30 
                     backdrop-blur-sm font-semibold text-white shadow-xl hover:shadow-2xl 
                     hover:scale-105 transition-all duration-300 flex items-center gap-2">
              🚪 Déconnexion
            </button>
          </template>

          <!-- Non connecté -->
          <template v-else>
            <RouterLink to="/login"
              class="px-5 sm:px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/30 
                     backdrop-blur-sm font-semibold text-white shadow-lg hover:shadow-xl 
                     hover:scale-105 transition-all duration-300">
              🔐 Connexion
            </RouterLink>
            <RouterLink to="/register"
              class="px-6 sm:px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 
                     text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 
                     hover:-translate-y-1 transition-all duration-300 border border-transparent">
              ✨ Rejoignez-nous
            </RouterLink>
          </template>
        </div>

        <!-- Hamburger Mobile -->
        <button @click="toggleMenu"
          class="lg:hidden p-2 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 
                 backdrop-blur-sm border border-white/20 shadow-lg 
                 hover:shadow-xl hover:scale-110 transition-all duration-300 group">
          <svg class="w-6 h-6 sm:w-7 sm:h-7 transition-all duration-500 group-hover:rotate-12"
               :class="{ 'rotate-180 scale-110': menuOuvert }"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <!-- Hamburger -->
            <path v-if="!menuOuvert" d="M4 6h16M4 12h16M4 18h16"/>
            <!-- Croix -->
            <path v-else d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- MENU MOBILE PREMIUM -->
    <transition enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 -translate-y-4 scale-[0.95]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 -translate-y-4 scale-[0.95]">
      <div v-if="menuOuvert" class="lg:hidden overflow-hidden bg-gradient-to-b from-slate-900/95 to-blue-900/90 
                  backdrop-blur-2xl border-t-2 border-white/20 shadow-2xl">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Colonne utilisateur -->
            <div v-if="auth.estConnecte" class="space-y-4">
              <!-- Card profil -->
              <div class="bg-gradient-to-br from-white/10 to-blue-500/10 p-6 sm:p-8 rounded-3xl 
                          backdrop-blur-xl border border-white/20 shadow-2xl">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 
                              rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <span class="text-2xl sm:text-3xl font-black text-white z-10 relative">
                      {{ auth.user?.name?.[0]?.toUpperCase() || 'U' }}
                    </span>
                    <div class="absolute inset-0 bg-white/20 animate-spin-slow rounded-3xl"></div>
                  </div>
                  <div class="min-w-0">
                    <h3 class="text-xl sm:text-2xl font-bold text-white mb-1 leading-tight">
                      Bonjour {{ auth.user?.name?.slice(0, 15) }}!
                    </h3>
                    <p class="text-blue-200 text-sm sm:text-base">Prêt pour la vague 🐟</p>
                  </div>
                </div>
              </div>
              
              <!-- Boutons -->
              <RouterLink v-if="auth.estVendeur || auth.estAdmin" 
                to="/dashboard" @click="closeMenu"
                class="block w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 
                       hover:from-emerald-500/40 hover:to-teal-500/40 border border-white/20 
                       backdrop-blur-xl text-xl sm:text-2xl font-bold text-white shadow-xl 
                       hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-4">
                📊 Mon Dashboard
                <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse ml-auto"></div>
              </RouterLink>
              
              <button @click="seDeconnecter"
                class="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-rose-500/30 to-red-500/30 
                       hover:from-rose-600/50 hover:to-red-600/50 border border-white/20 
                       backdrop-blur-xl text-xl sm:text-2xl font-bold text-white shadow-xl 
                       hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 
                       flex items-center gap-4">
                🚪 Déconnexion
              </button>
            </div>

            <!-- Non connecté -->
            <div v-else class="space-y-6">
              <!-- Hero card -->
              <div class="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/5 to-blue-500/5 
                          backdrop-blur-xl border border-white/20 shadow-2xl text-center">
                <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-br 
                            from-cyan-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center 
                            justify-center shadow-2xl mx-auto relative overflow-hidden">
                  <span class="text-3xl sm:text-4xl relative z-10">🐟</span>
                  <div class="absolute inset-0 bg-white/30 animate-pulse rounded-3xl"></div>
                </div>
                <h3 class="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                  Rejoignez Samak Market
                </h3>
                <p class="text-xl text-blue-200 opacity-90">Poisson frais tous les jours 🌊</p>
              </div>
              
              <!-- Boutons -->
              <RouterLink to="/login" @click="closeMenu"
                class="block w-full p-6 sm:p-8 rounded-3xl bg-white/10 hover:bg-white/20 
                       border border-white/30 backdrop-blur-xl text-xl sm:text-2xl font-semibold 
                       text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] 
                       transition-all duration-300 flex items-center justify-center gap-3">
                🔐 Connexion rapide
              </RouterLink>
              
              <RouterLink to="/register" @click="closeMenu"
                class="block w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 
                       text-white font-black text-xl sm:text-2xl shadow-2xl hover:shadow-3xl 
                       hover:scale-105 hover:-translate-y-1 transition-all duration-300 
                       flex items-center justify-center gap-3">
                ✨ Rejoignez-nous GRATIS
                <span class="text-xs bg-white/20 px-3 py-1 rounded-full ml-4 animate-pulse whitespace-nowrap">
                  Nouveau 🆕
                </span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const menuOuvert = ref(false)

const seDeconnecter = () => {
  auth.seDeconnecter()
  router.push('/')
}

const toggleMenu = () => {
  menuOuvert.value = !menuOuvert.value
}

const closeMenu = () => {
  menuOuvert.value = false
}

let outsideClickHandler = null

onMounted(() => {
  outsideClickHandler = (e) => {
    if (menuOuvert.value && !e.target.closest('nav')) {
      closeMenu()
    }
  }
  document.addEventListener('click', outsideClickHandler)
})

onUnmounted(() => {
  if (outsideClickHandler) {
    document.removeEventListener('click', outsideClickHandler)
  }
})
</script>

<style scoped>
/* Logo dépasse + toujours actif */
.logo-container {
  position: relative;
  z-index: 50;
}

/* Animation hover permanente */
.logo-link:hover img {
  filter: drop-shadow(0 8px 25px rgba(0, 255, 255, 0.6));
}

/* Active state visible */
.logo-link:active img {
  transform: scale(0.95) !important;
}
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
</style>
