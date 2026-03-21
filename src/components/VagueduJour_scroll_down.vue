<!-- =============================================================
  components/VagueduJour.vue
  Section "Vague du Jour" — produits frais animés
  
  USAGE dans MarketplaceView.vue :
    import VagueduJour from '../components/VagueduJour.vue'
    <VagueduJour />  (juste après </section> du hero)
============================================================= -->
<template>
  <section class="vague-section" v-if="produits.length > 0">

    <!-- Vagues SVG animées en haut -->
    <div class="vague-top">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="wave-svg wave-1">
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="wave-svg wave-2">
        <path d="M0,20 C180,50 360,0 540,25 C720,50 900,5 1080,30 C1260,55 1350,10 1440,20 L1440,60 L0,60 Z" />
      </svg>
    </div>

    <!-- Fond océan avec bulles -->
    <div class="vague-bg">
      <div v-for="i in 12" :key="i" class="bulle" :style="bulleStyle(i)"></div>
      <!-- Poissons décoratifs -->
      <div class="poisson p1">🐟</div>
      <div class="poisson p2">🐠</div>
      <div class="poisson p3">🦐</div>
    </div>

    <!-- Contenu -->
    <div class="vague-content">

      <!-- Header -->
      <div class="vague-header">
        <div class="vague-titre-wrap">
          <div class="vague-badge-live">
            <span class="live-pulse"></span>
            FRAIS DU JOUR
          </div>
          <h2 class="vague-titre">
            🌊 Vague du Jour
          </h2>
          <p class="vague-sous">
            {{ produits.length }} arrivage{{ produits.length > 1 ? 's' : '' }} 
            ce matin · {{ heureActuelle }}
          </p>
        </div>
        <div class="vague-compteur">
          <div class="compteur-val">{{ produits.length }}</div>
          <div class="compteur-lbl">produits<br>frais</div>
        </div>
      </div>

      <!-- Slider horizontal -->
      <div class="vague-slider" ref="sliderRef" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
        <div class="vague-track" :style="{ transform: `translateX(${translateX}px)` }">

          <div
            v-for="(p, i) in produits"
            :key="p.id"
            class="vague-card"
            :style="{ animationDelay: `${i * 0.08}s` }"
            @click="allerAuProduit(p)"
          >
            <!-- Badge FRAIS -->
            <div class="card-badge-frais">
              <span class="badge-dot"></span>
              FRAIS
            </div>

            <!-- Image ou emoji -->
            <div class="card-visuel">
              <img
                v-if="p.images && p.images[0]"
                :src="p.images[0]"
                :alt="p.name"
                class="card-img"
              />
              <div v-else class="card-emoji">{{ emojiProduit(p.category) }}</div>
              <!-- Overlay shimmer -->
              <div class="card-shimmer"></div>
            </div>

            <!-- Infos -->
            <div class="card-info">
              <div class="card-nom">{{ p.name }}</div>
              <div class="card-ville">📍 {{ p.city || p.seller?.city || 'Maroc' }}</div>
              <div class="card-prix-row">
                <span class="card-prix">{{ Number(p.price).toLocaleString('fr-FR') }} MAD</span>
                <span class="card-unit">/ {{ p.unit }}</span>
              </div>
            </div>

            <!-- Bouton WhatsApp -->
            <a
              :href="lienWhatsApp(p)"
              target="_blank"
              class="card-wa"
              @click.stop
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contacter nous
            </a>
            <!-- Bouton YouTube (même structure que WhatsApp) -->
<a
  :href="lienYouTube(p)"
  target="_blank"
  class="card-yt"
  @click.stop
>
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
  Recettes / شهيوات
</a>


          </div>

        </div>
      </div>

      <!-- Indicateur scroll -->
      <div class="scroll-hint-bar">
        <div class="scroll-track">
          <div class="scroll-thumb" :style="{ width: thumbWidth + '%', left: thumbLeft + '%' }"></div>
        </div>
        <span class="scroll-texte">← Glisser pour voir plus →</span>
      </div>

    </div>

    <!-- Vagues SVG en bas -->
    <div class="vague-bottom">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" class="wave-svg wave-3">
        <path d="M0,30 C240,0 480,60 720,30 C960,0 1200,60 1440,30 L1440,0 L0,0 Z" />
      </svg>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
//import { router } from '@/router'  // Import router

const allerAuProduit = (p) => { router.push(`/products/${p.id}`)}
const router     = useRouter()
const produits   = ref([])
const sliderRef  = ref(null)
const translateX = ref(0)

// Drag scroll
let isDragging = false
let startX     = 0
let startTX    = 0

const startDrag = (e) => {
  isDragging = true
  startX     = e.clientX
  startTX    = translateX.value
}
const onDrag = (e) => {
  if (!isDragging) return
  const dx = e.clientX - startX
  translateX.value = Math.min(0, Math.max(startTX + dx, maxTranslate.value))
}
const stopDrag = () => { isDragging = false }

const maxTranslate = computed(() => {
  if (!sliderRef.value) return 0
  const cardW   = 200
  const total   = produits.value.length * (cardW + 16)
  const visible = sliderRef.value.offsetWidth || 400
  return Math.min(0, -(total - visible))
})

// Scrollbar thumb
const thumbWidth = computed(() => {
  if (!sliderRef.value) return 20
  const cardW   = 200
  const total   = produits.value.length * (cardW + 16)
  const visible = sliderRef.value.offsetWidth || 400
  return Math.min(100, (visible / total) * 100)
})
const thumbLeft = computed(() => {
  if (maxTranslate.value === 0) return 0
  return (translateX.value / maxTranslate.value) * (100 - thumbWidth.value)
})

// Heure actuelle formatée
const heureActuelle = computed(() =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
)

// Emoji par catégorie
const emojiProduit = (cat) => {
  const map = {
    'Sardine':  '🐟', 'Thon': '🐠', 'Crevette': '🦐',
    'Homard':   '🦞', 'Mérou': '🐡', 'Dorade': '🐠',
    'Calamar':  '🦑', 'Poulpe': '🐙', 'Sole': '🐟',
  }
  return map[cat] || '🐟'
}

// WhatsApp
const SAMAK_WA = '212647689006'
const lienWhatsApp = (p) => {
  const msg = encodeURIComponent(
    `سلام SamakMarket 🐟\nكنبغي: *${p.name}*\n💰 ${p.price} MAD/${p.unit}\n🌊 Vague du Jour\n🆔 ref:${p.id}`
  )
  return `https://wa.me/${SAMAK_WA}?text=${msg}`
}
// youtube 
const lienYouTube = (p) => {
  // Si user n'existe PAS, lien générique
  if (!p.user) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(p.name || 'marocain recettes et méditerranéennes')}`;
  }
  
  const recherche = encodeURIComponent(
    `${p.name || 'Produit'} ${p.user.ville || 'Maroc'} ${p.user.nom || ''}`
  );
  return `https://www.youtube.com/results?search_query=${recherche}`;
}

// Style bulles aléatoires
const bulleStyle = (i) => ({
  left:             `${(i * 8.3) % 100}%`,
  width:            `${4 + (i % 5) * 3}px`,
  height:           `${4 + (i % 5) * 3}px`,
  animationDelay:   `${i * 0.4}s`,
  animationDuration:`${3 + (i % 4)}s`,
  opacity:          0.15 + (i % 3) * 0.05,
})

// Charger produits frais du jour
onMounted(async () => {
  try {
    const debut = new Date()
    debut.setHours(0, 0, 0, 0)
    const { data } = await api.get('/products', {
      params: {
        today: true,
        limit: 20,
        is_available: true,
      }
    })
    produits.value = data.produits || data
  } catch (e) {
    console.warn('VagueduJour:', e.message)
  }
})
</script>

<style scoped>
.vague-section {
  position: relative;
  background: linear-gradient(180deg, #020e23 0%, #061a35 50%, #020e23 100%);
  overflow: hidden;
  padding: 0 0 20px;
  margin: -2px 0;
}

/* ── Vagues SVG ────────────────────────────────────────────── */
.vague-top, .vague-bottom { position: relative; z-index: 2; line-height: 0; }
.wave-svg { width: 100%; display: block; }
.wave-1 { fill: rgba(13, 202, 240, 0.06); position: absolute; top: 0; animation: wave-move 8s ease-in-out infinite; }
.wave-2 { fill: rgba(13, 202, 240, 0.04); animation: wave-move 12s ease-in-out infinite reverse; }
.wave-3 { fill: rgba(2, 14, 35, 1); }
@keyframes wave-move {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(-30px); }
}

/* ── Fond bulles ───────────────────────────────────────────── */
.vague-bg {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.bulle {
  position: absolute; bottom: -10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(13,202,240,.4), transparent);
  animation: rise linear infinite;
}
@keyframes rise {
  0%   { transform: translateY(0) scale(1); opacity: .2; }
  100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
}

/* Poissons flottants */
.poisson {
  position: absolute; font-size: 1.5rem; opacity: .07;
  animation: swim linear infinite;
}
.p1 { bottom: 30%; animation-duration: 18s; animation-delay: 0s; }
.p2 { bottom: 50%; font-size: 1.2rem; animation-duration: 24s; animation-delay: -8s; }
.p3 { bottom: 20%; font-size: 1rem; animation-duration: 20s; animation-delay: -4s; }
@keyframes swim {
  0%   { left: -5%; }
  100% { left: 105%; }
}

/* ── Contenu ───────────────────────────────────────────────── */
.vague-content { position: relative; z-index: 3; padding: 20px 0 10px; }

/* Header */
.vague-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0 24px 16px; gap: 16px;
}
.vague-badge-live {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(13,202,240,.1); border: 1px solid rgba(13,202,240,.2);
  color: #0dcaf0; font-size: .65rem; font-weight: 900;
  letter-spacing: .12em; padding: 4px 10px; border-radius: 99px;
  margin-bottom: 8px;
}
.live-pulse {
  width: 6px; height: 6px; border-radius: 50%; background: #0dcaf0;
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .4; transform: scale(1.4); }
}
.vague-titre {
  color: white; font-size: 1.5rem; font-weight: 900;
  margin: 0 0 4px; letter-spacing: -.02em;
}
.vague-sous { color: rgba(255,255,255,.3); font-size: .78rem; margin: 0; }

.vague-compteur {
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  border-radius: 14px; padding: 12px 16px; text-align: center; flex-shrink: 0;
}
.compteur-val { color: #0dcaf0; font-size: 2rem; font-weight: 900; line-height: 1; }
.compteur-lbl { color: rgba(255,255,255,.3); font-size: .65rem; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }

/* ── Slider ────────────────────────────────────────────────── */
.vague-slider {
  overflow: hidden; cursor: grab; padding: 8px 24px 12px;
  user-select: none;
}
.vague-slider:active { cursor: grabbing; }
.vague-track {
  display: flex; gap: 16px; transition: transform .1s ease;
  width: max-content;
}

/* ── Card ──────────────────────────────────────────────────── */
.vague-card {
  width: 180px; flex-shrink: 0;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(13,202,240,.12);
  border-radius: 16px; overflow: hidden;
  cursor: pointer; position: relative;
  animation: card-in .5s ease both;
  transition: transform .2s, border-color .2s;
}
.vague-card:hover {
  transform: translateY(-4px);
  border-color: rgba(13,202,240,.3);
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Badge FRAIS */
.card-badge-frais {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  display: flex; align-items: center; gap: 4px;
  background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
  color: #0dcaf0; font-size: .6rem; font-weight: 900;
  letter-spacing: .1em; padding: 3px 8px; border-radius: 99px;
  border: 1px solid rgba(13,202,240,.3);
}
.badge-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #0dcaf0;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

/* Visuel */
.card-visuel {
  height: 110px; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #061428, #0d2040);
}
.card-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .3s;
}
.vague-card:hover .card-img { transform: scale(1.05); }
.card-emoji {
  font-size: 3rem; display: flex; align-items: center;
  justify-content: center; height: 100%;
}
.card-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(13,202,240,.05) 50%, transparent 60%);
  animation: shimmer-move 3s ease-in-out infinite;
}
@keyframes shimmer-move {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

/* Infos */
.card-info { padding: 10px 12px 6px; }
.card-nom  { color: white; font-size: .82rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-ville { color: rgba(255,255,255,.3); font-size: .7rem; margin: 3px 0 6px; }
.card-prix-row { display: flex; align-items: baseline; gap: 4px; }
.card-prix  { color: #0dcaf0; font-size: .95rem; font-weight: 900; }
.card-unit  { color: rgba(255,255,255,.3); font-size: .68rem; }

/* Bouton WhatsApp */
.card-wa {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  background: linear-gradient(135deg, #075e54, #25d366);
  color: white; text-decoration: none;
  font-size: .72rem; font-weight: 700;
  padding: 8px; margin: 0 10px 10px;
  border-radius: 10px; transition: filter .2s;
}
.card-wa:hover { filter: brightness(1.15); }

/* Bouton YouTube */
.card-yt {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  background: linear-gradient(135deg, #FF0000, #CC0000);
  color: white; text-decoration: none;
  font-size: .72rem; font-weight: 700;
  padding: 8px; margin: 0 10px 10px;
  border-radius: 10px; transition: filter .2s;
}
.card-yt:hover { 
  filter: brightness(1.15); 
}

/* Scrollbar custom */
.scroll-hint-bar {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; padding: 0 24px;
}
.scroll-track {
  width: 100%; height: 2px;
  background: rgba(255,255,255,.06); border-radius: 99px;
  position: relative; overflow: hidden;
}
.scroll-thumb {
  position: absolute; height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #0dcaf0, rgba(13,202,240,.4));
  transition: left .1s ease;
}
.scroll-texte { color: rgba(255,255,255,.15); font-size: .65rem; }

/* Mobile */
@media (max-width: 640px) {
  .vague-header { padding: 0 16px 12px; }
  .vague-slider { padding: 8px 16px 12px; }
  .vague-titre  { font-size: 1.2rem; }
  .vague-card   { width: 155px; }
  .card-visuel  { height: 90px; }
}
</style>
