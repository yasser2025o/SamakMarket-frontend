<template>
  <article class="vendeur-complete">
    
    <!-- Header User DB -->
    <header class="vendeur-header">
      <div class="avatar" :style="avatarStyle">
        {{ vendeur.name.charAt(0).toUpperCase() }}
      </div>
      <div class="info">
        <h3>{{ vendeur.name }}</h3>
        <div class="status">
          <span :class="`dot ${vendeur.is_active ? 'online' : 'offline'}`"></span>
          {{ vendeur.role === 'seller' ? 'Vendeur Pro' : 'Vendeur' }}
        </div>
        <p class="location">📍 {{ vendeur.city }} • 🕒 {{ formatDate(vendeur.updated_at) }}</p>
      </div>
      <div v-if="vendeur.nb_promos" class="badges">
        <span class="badge promo">🔥 {{ vendeur.nb_promos }} promos</span>
      </div>
    </header>

    <!-- ✅ PRODUITS DB avec TOUS les champs Product -->
    <div class="produits-grid">
      <div v-for="produit in produits.slice(0, isTop ? 6 : 4)" 
           :key="produit.id" 
           class="produit-card">
        
        <!-- Image/Emoji + Stock -->
        <div class="prod-image">
          <img v-if="produit.images?.[0]" 
               :src="produit.images[0]" 
               :alt="produit.name"
               class="img" />
          <span v-else class="emoji">{{ emojiCat(produit.category) }}</span>
          <div v-if="produit.quantity > 0" class="stock">
            📦 {{ produit.quantity }} {{ produit.unit }}
          </div>
        </div>

        <!-- Détails Product DB -->
        <div class="prod-details">
          <h4 class="nom">{{ produit.name }}</h4>
          <p v-if="produit.description" class="desc line-clamp-2">
            {{ produit.description }}
          </p>
          
          <!-- ✅ PRIX + PROMO/FLASH DB -->
          <div class="prix-section">
            <div v-if="produit.is_flash && produit.flash_price" class="flash">
              <span class="old">{{ formatPrix(produit.price) }}</span>
              <span class="new">{{ formatPrix(produit.flash_price) }}</span>
              <span class="timer">⏰ Flash</span>
            </div>
            <div v-else-if="produit.is_promo" class="promo-prix">
              <span class="promo-label">Promo</span>
              {{ formatPrix(produit.price) }}
            </div>
            <div v-else class="normal-prix">
              {{ formatPrix(produit.price) }}
            </div>
            <span class="unit">/ {{ produit.unit }}</span>
          </div>

          <!-- Stats produit -->
          <div class="prod-stats">
            <span>👁️ {{ produit.views_count.toLocaleString() }} vues</span>
            <span>{{ produit.is_featured ? '⭐ Featured' : '🐟' }}</span>
          </div>
        </div>

        <!-- ✅ ACTIONS : ATP_BTN + WhatsApp -->
        <div class="actions">
          <ATPBtn 
            :produit="produit"
            class="btn-atp"
            @click="$emit('addToCart', produit)"
          />
          <a :href="waLien(vendeur, produit)" target="_blank" class="btn-wa">
            📱
          </a>
        </div>
      </div>

      <!-- Plus de produits -->
      <div v-if="produits.length > (isTop ? 6 : 4)" class="more-prods">
        +{{ produits.length - (isTop ? 6 : 4) }} autres produits frais
      </div>
    </div>

    <!-- WhatsApp vendeur principal -->
    <footer class="vendeur-footer">
      <a :href="waLien(vendeur)" target="_blank" class="wa-main">
        💬 Contacter {{ vendeur.name }} ({{ produits.length }} produits)
      </a>
    </footer>
  </article>
</template>

<script setup>
defineProps({
  vendeur: Object,
  produits: Array,
  isTop: { type: Boolean, default: false }
})
defineEmits(['addToCart'])

const formatPrix = (prix) => Number(prix).toLocaleString('fr-FR')
const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR')
const avatarStyle = computed(() => ({
  background: `linear-gradient(135deg, hsl(${Math.random()*360}, 70%, 60%), hsl(${Math.random()*360}, 70%, 50%))`
}))
const emojiCat = (cat) => ({
  'Sardine': '🐟', 'Thon': '🐠', 'Crevette': '🦐', /* etc */
})[cat] || '🐟'
const waLien = (vendeur, produit) => {/* logique WhatsApp */}
</script>

<style scoped>
.vendeur-complete {
  @apply bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 
         rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all overflow-hidden;
}
.vendeur-header { @apply flex items-center gap-4 mb-6 pb-6 border-b border-slate-700/50; }
.avatar {
  @apply w-16 h-16 rounded-3xl flex-center font-black text-2xl shadow-2xl flex-shrink-0;
}
.info h3 { @apply text-xl font-bold text-white mb-1; }
.status { @apply flex items-center gap-2 text-sm text-slate-400 mb-1; }
.dot { @apply w-3 h-3 rounded-full; }
.dot.online { @apply bg-emerald-400 animate-pulse; }
.dot.offline { @apply bg-slate-500; }
.location { @apply text-xs text-slate-500; }
.badges { @apply flex gap-2 ml-auto; }
.badge { 
  @apply px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-400/20 
         border border-amber-400/40 text-amber-300 font-bold text-xs rounded-xl;
}
.produits-grid { @apply space-y-4 mb-6; }
.produit-card {
  @apply grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 items-center 
         p-4 bg-slate-700/30 rounded-2xl hover:bg-slate-700/50 transition-all;
}
.prod-image {
  @apply relative w-full h-24 md:h-20 rounded-xl overflow-hidden 
         bg-gradient-to-br from-blue-500/20 to-cyan-500/20;
}
.img { @apply w-full h-full object-cover; }
.emoji { @apply absolute inset-0 flex-center text-3xl; }
.stock {
  @apply absolute top-1 right-1 bg-emerald-500/90 text-emerald-900 
         font-bold text-xs px-2 py-0.5 rounded-full shadow-lg;
}
.prod-details { @apply space-y-1; }
.nom { @apply font-semibold text-white text-base; }
.desc { @apply text-slate-400 text-sm; }
.prix-section { @apply flex items-baseline gap-2 flex-wrap; }
.flash {
  @apply flex items-baseline gap-2 bg-red-500/20 border border-red-500/40 
         px-3 py-1 rounded-xl;
}
.old { @apply text-slate-500 line-through text-sm; }
.new { @apply text-2xl font-black text-red-400; }
.promo-prix {
  @apply relative text-2xl font-black text-amber-400;
}
.promo-label {
  @apply absolute -top-2 -right-2 bg-amber-500 text-amber-900 
         font-bold text-xs px-2 py-0.5 rounded-full;
}
.normal-prix { @apply text-2xl font-black text-emerald-400; }
.unit { @apply text-sm text-slate-400; }
.prod-stats { @apply flex justify-between text-xs text-slate-500; }
.actions { @apply flex gap-2; }
.btn-atp, .btn-wa {
  @apply w-12 h-12 rounded-2xl flex-center font-bold shadow-lg transition-all;
}
.btn-wa { @apply bg-green-500 hover:bg-green-600 text-white; }
.more-prods {
  @apply text-center py-4 text-slate-500 font-medium italic border-t 
         border-slate-700/50;
}
.vendeur-footer { @apply mt-6 pt-6 border-t border-slate-700/50; }
.wa-main {
  @apply w-full flex items-center justify-center gap-3 py-4 px-6 
         bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 
         hover:to-emerald-700 text-white font-bold rounded-2xl shadow-2xl 
         transition-all text-lg;
}
</style>