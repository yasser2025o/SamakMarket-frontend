<!-- components/ATPBtn.vue — Bouton "Ajouter au panier" flexible -->
<template>
  <button 
    class="atp-btn flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all duration-200"
    :class="[
      size === 'sm' ? 'text-xs px-2 py-1 rounded-lg' : 'text-sm px-4 py-2 rounded-xl',
      couleur || 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
    ]"
    @click="$emit('click', produit)"
  >
    <slot>🛒 {{ label || 'Ajouter au panier' }}</slot>
  </button>
</template>

<script setup>
defineProps({
  produit: Object,
  size: { type: String, default: 'md' },
  couleur: String,
  label: String
})
defineEmits(['click'])
</script>