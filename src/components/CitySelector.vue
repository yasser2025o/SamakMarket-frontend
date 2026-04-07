<template>
  <div class="city-selector-container py-6 px-4 bg-slate-50/50">
    <div class="px-2 mb-3 flex justify-between items-end">
      <h2 class="text-[13px] font-semibold text-slate-400 uppercase tracking-tight">
        {{ i18n.t('common.select_city') || 'Choisir une ville' }}
      </h2>
      <span class="text-[11px] text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded-md">
        Maroc 🇲🇦
      </span>
    </div>

    <div class="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory">
      
      <button @click="geoLocaliser" 
        :class="['ios-chip snap-start', gpsActif ? 'bg-blue-500 text-white shadow-blue-200' : 'bg-blue-50 text-blue-600 border-blue-50']"
        :disabled="chargementGPS">
        <span v-if="chargementGPS" class="animate-spin text-lg">⟳</span>
        <span v-else class="text-xl">📍</span>
        <span class="font-bold text-[15px]">{{ chargementGPS ? '...' : (villeGPS || 'Proche') }}</span>
      </button>

      <button @click="choisir('')" 
        :class="['ios-chip snap-start', modelValue === '' && !gpsActif ? 'active' : 'inactive']">
        <span class="text-xl">🌍</span>
        <span class="font-bold text-[15px]">{{ i18n.t('common.all') || 'Toutes' }}</span>
      </button>

      <button v-for="v in villes" :key="v.nom"
        @click="choisir(v.nom)"
        :class="['ios-chip snap-start', modelValue === v.nom && !gpsActif ? 'active' : 'inactive']">
        <span class="text-2xl">{{ v.emoji }}</span>
        <span class="font-bold text-[15px]">{{ v.nom }}</span>
        
        <span v-if="countsByCity[v.nom]" class="ios-badge">
          {{ countsByCity[v.nom] }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: String,
  countsByCity: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:modelValue', 'change'])

// Liste des villes du Maroc
const villes = [
  { nom: 'Tanger', emoji: '🌊' },
  { nom: 'Casablanca', emoji: '🏙️' },
  { nom: 'Agadir', emoji: '🏖️' },
  { nom: 'Rabat', emoji: '🏛️' },
  { nom: 'Dakhla', emoji: '🏜️' },
  { nom: 'Safi', emoji: '⚓' }
]

const villeGPS = ref('')
const gpsActif = ref(false)
const chargementGPS = ref(false)

const choisir = (v) => {
  gpsActif.value = (v === villeGPS.value && v !== '')
  emit('update:modelValue', v)
  emit('change') 
}

const geoLocaliser = () => {
  if (chargementGPS.value) return
  chargementGPS.value = true
  
  navigator.geolocation.getCurrentPosition((pos) => {
    chargementGPS.value = false
    gpsActif.value = true
    choisir('Casablanca') // Exemple, à lier à ton service de reverse geocoding
  }, () => {
    chargementGPS.value = false
  })
}
</script>

<style scoped>
/* Suppression de la scrollbar pour garder le look épuré */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Bouton de base style Apple */
.ios-chip {
  @apply flex items-center gap-3 px-5 py-3.5 rounded-[1.25rem] border-none 
         transition-all duration-200 whitespace-nowrap outline-none flex-shrink-0;
  -webkit-tap-highlight-color: transparent;
}

/* État Inactif : Fond gris très clair / Blanc */
.ios-chip.inactive {
  @apply bg-white text-slate-600 shadow-sm ring-1 ring-slate-100;
}

/* État Actif : Noir profond (Style iOS Dark Mode / Buttons) */
.ios-chip.active {
  @apply bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02];
}

/* Badge de notification (Compteur) */
.ios-badge {
  @apply text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black ml-1;
}

.active .ios-badge {
  @apply bg-white/20 text-white;
}

/* Animation "Haptic Feedack" visuel au clic */
.ios-chip:active {
  @apply scale-95 opacity-80;
  transition: transform 0.1s;
}
</style>