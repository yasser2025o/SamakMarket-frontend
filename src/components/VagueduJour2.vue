<!-- =============================================================
  components/VagueduJour.vue — Carousel 3D Vague du Jour
============================================================= -->
<template>
  <section class="vague-section" v-if="produits.length > 0">

    <!-- Vagues + bulles bg -->
    <div class="vague-bg">
      <div v-for="i in 10" :key="i" class="bulle" :style="bulleStyle(i)"></div>
      <div class="poisson p1">🐟</div>
      <div class="poisson p2">🐠</div>
    </div>

    <div class="vague-content">

      <!-- Header -->
      <div class="vague-header">
        <div>
          <div class="vague-badge-live">
            <span class="live-pulse"></span>FRAIS DU JOUR
          </div>
          <h2 class="vague-titre">🌊 Vague du Jour</h2>
          <p class="vague-sous">{{ produits.length }} arrivage{{ produits.length > 1 ? 's' : '' }} · {{ heureActuelle }}</p>
        </div>
        <div class="vague-compteur">
          <div class="compteur-val">{{ produits.length }}</div>
          <div class="compteur-lbl">produits<br>frais</div>
        </div>
      </div>

      <!-- Carousel 3D -->
      <div class="carousel-wrap">

        <!-- Bouton gauche -->
        <button class="nav-btn nav-prev" @click="prev" :disabled="actif === 0">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <!-- Scene 3D -->
        <div class="carousel-scene" @touchstart="touchStart" @touchend="touchEnd">
          <div class="carousel-3d" :style="carouselStyle">
            <div
              v-for="(p, i) in produits"
              :key="p.id"
              class="card-3d"
              :class="{
                'card-actif':   i === actif,
                'card-gauche':  i === actif - 1,
                'card-droite':  i === actif + 1,
                'card-loin-g':  i < actif - 1,
                'card-loin-d':  i > actif + 1,
              }"
              @click="i !== actif ? setActif(i) : allerAuProduit(p)"
            >
              <!-- Badge FRAIS -->
              <div class="card-badge-frais">
                <span class="live-pulse"></span>FRAIS
              </div>

              <!-- Visuel -->
              <div class="card-visuel">
                <img v-if="p.images && p.images[0]" :src="p.images[0]" :alt="p.name" class="card-img"/>
                <div v-else class="card-emoji">{{ emojiProduit(p.category) }}</div>
                <div class="card-shimmer"></div>
              </div>

              <!-- Infos -->
              <div class="card-info">
                <div class="card-nom">{{ p.name }}</div>
                <div class="card-ville">📍 {{ p.city || p.seller?.city || 'Maroc' }}</div>
                <div class="card-prix-row">
                  <span class="card-prix">{{ Number(p.price).toLocaleString('fr-FR') }}</span>
                  <span class="card-mad">MAD / {{ p.unit }}</span>
                </div>
              </div>

              <!-- WhatsApp — visible seulement sur card active -->
              <a v-if="i === actif" :href="lienWhatsApp(p)" target="_blank" class="card-wa" @click.stop>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Commander
              </a>

            </div>
          </div>
        </div>

        <!-- Bouton droite -->
        <button class="nav-btn nav-next" @click="next" :disabled="actif === produits.length - 1">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>

      <!-- Dots indicateurs -->
      <div class="dots">
        <button
          v-for="(p, i) in produits"
          :key="i"
          class="dot"
          :class="{ 'dot-on': i === actif }"
          @click="setActif(i)"
        ></button>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router  = useRouter()
const produits = ref([])
const actif    = ref(0)
let autoPlay   = null
let touchStartX = 0

// Navigation
const prev = () => { if (actif.value > 0) actif.value-- }
const next = () => { if (actif.value < produits.value.length - 1) actif.value++ }
const setActif = (i) => { actif.value = i }

// Touch swipe
const touchStart = (e) => { touchStartX = e.touches[0].clientX }
const touchEnd   = (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (dx < -50) next()
  if (dx >  50) prev()
}

// Auto-play toutes les 4s
const startAuto = () => {
  autoPlay = setInterval(() => {
    if (actif.value < produits.value.length - 1) actif.value++
    else actif.value = 0
  }, 4000)
}

// Style 3D calculé
const carouselStyle = computed(() => ({
  transform: `translateX(calc(50% - ${actif.value * 210 + 105}px))`,
}))

const heureActuelle = computed(() =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
)

const emojiProduit = (cat) => {
  const map = { 'Sardine': '🐟', 'Thon': '🐠', 'Crevette': '🦐', 'Homard': '🦞', 'Mérou': '🐡', 'Dorade': '🐠', 'Calamar': '🦑' }
  return map[cat] || '🐟'
}

const SAMAK_WA = '212647689006'
const lienWhatsApp = (p) => {
  const msg = encodeURIComponent(`سلام SamakMarket 🐟\nكنبغي: *${p.name}*\n💰 ${p.price} MAD/${p.unit}\n🌊 Vague du Jour\n🆔 ref:${p.id}`)
  return `https://wa.me/${SAMAK_WA}?text=${msg}`
}
const allerAuProduit = (p) => router.push(`/products/${p.id}`)

const bulleStyle = (i) => ({
  left: `${(i * 10) % 100}%`,
  width: `${4 + (i % 5) * 3}px`,
  height: `${4 + (i % 5) * 3}px`,
  animationDelay: `${i * 0.4}s`,
  animationDuration: `${3 + (i % 4)}s`,
})

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: { limit: 20, is_available: true }
    })
    produits.value = data.produits || data
    startAuto()
  } catch (e) {
    console.warn('VagueduJour:', e.message)
  }
})
onUnmounted(() => clearInterval(autoPlay))
</script>

<style scoped>
.vague-section {
  position: relative;
  background: linear-gradient(180deg, #020e23, #061a35 50%, #020e23);
  overflow: hidden;
  padding: 30px 0 40px;
}

/* Bg bulles */
.vague-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.bulle {
  position: absolute; bottom: -10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(13,202,240,.3), transparent);
  animation: rise linear infinite;
}
@keyframes rise {
  0%   { transform: translateY(0); opacity: .2; }
  100% { transform: translateY(-100vh); opacity: 0; }
}
.poisson { position: absolute; font-size: 1.5rem; opacity: .06; animation: swim linear infinite; }
.p1 { bottom: 30%; animation-duration: 20s; }
.p2 { bottom: 55%; font-size: 1rem; animation-duration: 28s; animation-delay: -10s; }
@keyframes swim { 0% { left: -5%; } 100% { left: 105%; } }

/* Contenu */
.vague-content { position: relative; z-index: 2; }

/* Header */
.vague-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0 24px 20px;
}
.vague-badge-live {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(13,202,240,.1); border: 1px solid rgba(13,202,240,.2);
  color: #0dcaf0; font-size: .62rem; font-weight: 900;
  letter-spacing: .12em; padding: 4px 10px; border-radius: 99px; margin-bottom: 8px;
}
.live-pulse {
  width: 6px; height: 6px; border-radius: 50%; background: #0dcaf0;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.3; transform:scale(1.4); } }
.vague-titre { color: white; font-size: 1.4rem; font-weight: 900; margin: 0 0 4px; }
.vague-sous  { color: rgba(255,255,255,.3); font-size: .75rem; margin: 0; }
.vague-compteur {
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  border-radius: 14px; padding: 12px 16px; text-align: center; flex-shrink: 0;
}
.compteur-val { color: #0dcaf0; font-size: 2rem; font-weight: 900; line-height: 1; }
.compteur-lbl { color: rgba(255,255,255,.25); font-size: .62rem; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }

/* ── Carousel 3D ─────────────────────────────────── */
.carousel-wrap {
  display: flex; align-items: center; gap: 8px;
  padding: 20px 0; position: relative;
}
.carousel-scene {
  flex: 1; overflow: hidden;
  perspective: 1000px;
  height: 340px; position: relative;
}
.carousel-3d {
  display: flex; gap: 16px;
  position: absolute; top: 50%; left: 0;
  transform-style: preserve-3d;
  transition: transform .5s cubic-bezier(.25,.46,.45,.94);
  translate: 0 -50%;
}

/* Nav boutons */
.nav-btn {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  background: rgba(13,202,240,.1); border: 1px solid rgba(13,202,240,.2);
  color: #0dcaf0; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .2s; z-index: 10;
}
.nav-btn:hover:not(:disabled) { background: rgba(13,202,240,.2); transform: scale(1.1); }
.nav-btn:disabled { opacity: .2; cursor: not-allowed; }
.nav-prev { margin-left: 12px; }
.nav-next { margin-right: 12px; }

/* Cards 3D */
.card-3d {
  width: 194px; flex-shrink: 0;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px; overflow: hidden;
  cursor: pointer; position: relative;
  transition: all .5s cubic-bezier(.25,.46,.45,.94);
  transform-origin: center center;
}

/* Card active — au centre */
.card-actif {
  transform: scale(1.08) translateZ(60px);
  border-color: rgba(13,202,240,.4);
  box-shadow: 0 20px 60px rgba(0,0,0,.5), 0 0 30px rgba(13,202,240,.15);
  z-index: 10;
}
/* Cards adjacentes */
.card-gauche {
  transform: scale(0.88) translateZ(20px) rotateY(12deg);
  opacity: .7; filter: brightness(.8);
}
.card-droite {
  transform: scale(0.88) translateZ(20px) rotateY(-12deg);
  opacity: .7; filter: brightness(.8);
}
/* Cards loin */
.card-loin-g {
  transform: scale(0.72) translateZ(0) rotateY(20deg);
  opacity: .35; filter: brightness(.5);
}
.card-loin-d {
  transform: scale(0.72) translateZ(0) rotateY(-20deg);
  opacity: .35; filter: brightness(.5);
}

/* Badge */
.card-badge-frais {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  display: flex; align-items: center; gap: 4px;
  background: rgba(0,0,0,.7); backdrop-filter: blur(8px);
  color: #0dcaf0; font-size: .6rem; font-weight: 900;
  letter-spacing: .1em; padding: 3px 8px; border-radius: 99px;
  border: 1px solid rgba(13,202,240,.3);
}

/* Visuel */
.card-visuel {
  height: 140px; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #061428, #0d2040);
}
.card-img   { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.card-actif .card-img { transform: scale(1.05); }
.card-emoji { font-size: 3.5rem; display: flex; align-items: center; justify-content: center; height: 100%; }
.card-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(13,202,240,.06) 50%, transparent 60%);
  animation: shimmer 3s ease-in-out infinite;
}
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }

/* Infos */
.card-info  { padding: 12px 14px 8px; }
.card-nom   { color: white; font-size: .85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-ville { color: rgba(255,255,255,.3); font-size: .7rem; margin: 3px 0 8px; }
.card-prix-row { display: flex; align-items: baseline; gap: 4px; }
.card-prix  { color: #0dcaf0; font-size: 1.1rem; font-weight: 900; }
.card-mad   { color: rgba(255,255,255,.3); font-size: .68rem; }

/* WhatsApp */
.card-wa {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  background: linear-gradient(135deg, #075e54, #25d366);
  color: white; text-decoration: none; font-size: .75rem; font-weight: 700;
  padding: 9px 14px; margin: 0 12px 12px; border-radius: 12px;
  transition: filter .2s; animation: fadeIn .3s ease;
}
.card-wa:hover { filter: brightness(1.15); }
@keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }

/* Dots */
.dots {
  display: flex; justify-content: center; gap: 6px; padding: 8px 0;
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.15); border: none; cursor: pointer;
  transition: all .3s;
}
.dot-on {
  width: 22px; border-radius: 3px;
  background: #0dcaf0;
  box-shadow: 0 0 8px rgba(13,202,240,.5);
}

/* Mobile */
@media (max-width: 640px) {
  .carousel-scene { height: 300px; }
  .card-3d        { width: 170px; }
  .card-visuel    { height: 115px; }
  .nav-prev       { margin-left: 6px; }
  .nav-next       { margin-right: 6px; }
}
</style>
