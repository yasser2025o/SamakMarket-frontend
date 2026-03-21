<!-- =============================================================
  components/NavBar.vue
  Barre de navigation principale
  ============================================================= -->



<template>
  <nav class="bg-blue-900 text-white px-6 py-4 sticky top-0 z-50 shadow-lg">
    <div class="flex items-center justify-between">
      
      <!-- Logo gauche -->
      <div class="w-64">
        <RouterLink to="/" class="hover:opacity-90">
          <img src="/log.png" alt="Logo" class="h-12 w-48">
        </RouterLink>
      </div>

      <!-- Boutons desktop / Hamburger mobile -->
      <div class="flex items-center gap-3">
        
        <!-- Desktop: boutons visibles -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="auth.estConnecte">
            <span class="text-blue-200 text-sm hidden lg:block">
              👋 {{ auth.user?.name }}
            </span>
            <RouterLink v-if="auth.estVendeur || auth.estAdmin" to="/dashboard"
              class="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
              Dashboard
            </RouterLink>
            <button @click="seDeconnecter" 
              class="text-sm border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" 
              class="text-sm border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition">
              Connexion
            </RouterLink>
            <RouterLink to="/register" 
              class="text-sm bg-amber-400 font-semibold px-4 py-2 rounded-lg hover:bg-amber-300 transition">
              Rejoignez-nous
            </RouterLink>
          </template>
        </div>

        <!-- Hamburger mobile UNIQUEMENT -->
        <button @click="toggleMenu" 
          class="md:hidden p-1 rounded-lg hover:bg-white/10 transition-all">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- Hamburger fermé -->
            <path v-if="!menuOuvert" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            <!-- Croix ouverte -->
            <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- MENU MOBILE DÉROULANT -->
    <div v-if="menuOuvert" 
      class="md:hidden bg-blue-900/95 backdrop-blur-md border-t border-white/20 animate-slideDown">
      <div class="flex flex-col p-6 space-y-3">
        <template v-if="auth.estConnecte">
          <div class="px-4 py-3 bg-white/5 rounded-xl">
            <span class="text-blue-200 text-lg font-medium">👋 {{ auth.user?.name }}</span>
          </div>
          <RouterLink v-if="auth.estVendeur || auth.estAdmin" 
            to="/dashboard" @click="closeMenu"
            class="text-lg bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl transition-all">
            📊 Dashboard
          </RouterLink>
          <button @click="seDeconnecter" 
            class="text-lg border border-white/30 hover:bg-white/10 px-6 py-4 rounded-xl transition-all">
            🚪 Déconnexion
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" @click="closeMenu"
            class="text-lg border border-white/30 hover:bg-white/10 px-6 py-4 rounded-xl transition-all">
            🔐 Connexion
          </RouterLink>
          <RouterLink to="/register" @click="closeMenu"
            class="text-lg bg-amber-400 font-semibold hover:bg-amber-300 px-6 py-4 rounded-xl transition-all">
            ✨ Rejoignez-nous
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const menuOuvert = ref(false)

// Votre fonction existante ✅
const seDeconnecter = () => {
  auth.seDeconnecter()
  router.push('/')
}

// Fermer menu
const toggleMenu = () => {
  menuOuvert.value = !menuOuvert.value
}

const closeMenu = () => {
  menuOuvert.value = false
}

// Fermer menu au clic extérieur (mobile)
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (menuOuvert.value && !e.target.closest('nav')) {
      closeMenu()
    }
  })
})
</script>

<style scoped>
.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
svg {
  transition: transform 0.3s ease;
}
/*
  Logo vidéo dans la navbar.
  La vidéo originale fait 640x128px (ratio 5:1).
  On la redimensionne à 160px de large → 32px de haut
  parfait pour une navbar sans prendre trop de place.
*/
.logo-video {
  height: 44px;       /* Hauteur fixe dans la navbar */
  width: auto;        /* Largeur calculée automatiquement (ratio conservé) */
  object-fit: contain;
  display: block;

  /* Fond transparent si la vidéo a un fond noir */
  mix-blend-mode: screen; /* Rend le fond noir transparent sur fond sombre */
}

/* Sur mobile : légèrement plus petit */
@media (max-width: 640px) {
  .logo-video {
    height: 34px;
  }
}
</style>
