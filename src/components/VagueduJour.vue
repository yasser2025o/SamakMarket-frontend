<!-- =============================================================
  components/VagueduJour.vue
  Vitrine 2x2 — cadres en verre avec auto-scroll
============================================================= -->
<template>
  <section class="vague-section" v-if="produits.length > 0">

    <!-- Bg décoratif -->
    <div class="vague-bg">
      <div v-for="i in 8" :key="i" class="bulle" :style="bulleStyle(i)"></div>
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
          <p class="vague-sous">
            {{ produits.length }} arrivage{{ produits.length > 1 ? 's' : '' }} · {{ heureActuelle }}
          </p>
        </div>
        <div class="vague-compteur">
          <div class="compteur-val">{{ produits.length }}</div>
          <div class="compteur-lbl">produits<br>frais</div>
        </div>
      </div>

      <!-- Vitrine 2x2 -->
      <div class="vitrine-wrap">

        <!-- Bouton gauche -->
        <button class="nav-btn nav-prev" @click="prev">‹</button>

        <!-- 4 cadres en verre -->
        <div class="vitrine-grille">
          <div
            v-for="(slot, si) in 4"
            :key="si"
            class="cadre-verre"
            :class="{ 'cadre-vide': !produitVisible(si) }"
            @click="produitVisible(si) && allerAuProduit(produitVisible(si))"
          >
            <!-- Reflets verre -->
            <div class="verre-reflet-h"></div>
            <div class="verre-reflet-v"></div>

            <template v-if="produitVisible(si)">
              <!-- Badge FRAIS -->
              <div class="card-badge">
                <span class="live-pulse"></span>FRAIS
              </div>

              <!-- Transition entrée/sortie -->
              <!-- <Transition :name="si % 2 === 0 ? 'slide-top' : 'slide-bot'">
  <div :key="offset + si" class="card-inner"> -->
                        <!-- ton contenu -->
                     

                  <!-- Visuel -->
                  <div class="card-visuel">
                    <img
                    :src="imageUrl(produitVisible(si))"
                    :alt="produitVisible(si).name"
                    class="card-img"
                    @error="onImgError($event, produitVisible(si))"
                    />
                    <div class="card-emoji" style="display:none">
                    {{ emojiProduit(produitVisible(si).category) }}
                    </div>
                    <div class="card-overlay"></div>
                  </div>

                  <!-- Infos -->
                  <div class="card-info">
                    <div class="card-nom">{{ produitVisible(si).name }}</div>
                    <div class="card-ville">📍 {{ produitVisible(si).city || 'Maroc' }}</div>
                    <div class="card-prix-row">
                      <span class="card-prix">
                        {{ Number(produitVisible(si).price).toLocaleString('fr-FR') }}
                      </span>
                      <span class="card-mad">MAD/{{ produitVisible(si).unit }}</span>
                    </div>
                  </div>

                  <!-- WhatsApp -->
                  <a
                    :href="lienWhatsApp(produitVisible(si))"
                    target="_blank"
                    class="card-wa"
                    @click.stop
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Commander
                  </a>

                <!-- </div>
              </Transition> -->
            </template>

            <!-- Cadre vide -->
            <div v-else class="cadre-vide-inner">
              <div class="vide-ico">🌊</div>
              <div class="vide-txt">Bientôt</div>
            </div>

          </div>
        </div>

        <!-- Bouton droite -->
        <button class="nav-btn nav-next" @click="next">›</button>

      </div>

      <!-- Progress bar auto-scroll -->
      <div class="progress-wrap">
        <div class="progress-bar" :style="{ width: progressPct + '%' }"></div>
      </div>

      <!-- Dots -->
      <div class="dots">
        <div
          v-for="(_, i) in Math.ceil(produits.length / 4)"
          :key="i"
          class="dot"
          :class="{ 'dot-on': Math.floor(offset / 4) === i }"
          @click="goToPage(i)"
        ></div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router   = useRouter()
const produits = ref([])
const offset   = ref(0)
const si = ref(0)
const progressPct = ref(0)
let autoTimer  = null
let progressTimer = null
// par images
// Génère l'URL image
const imageUrl = (p) => {
  const nom = p.name.toLowerCase().replace(/\s+/g, '-')
  return `/images/poissons/${p.category}/jours/jour_1.jpg`
}

// Si image introuvable → emoji fallback
const onImgError = (e, p) => {
  e.target.style.display = 'none'
  e.target.parentElement.querySelector('.card-emoji')?.style.setProperty('display', 'flex')
}
// Produit dans chaque slot (0-3)
const produitVisible = (slot) => produits.value[offset.value + slot] || null

// Navigation
const next = () => {
  if (offset.value + 4 < produits.value.length) {
    offset.value += 4
  } else {
    offset.value = 0 // loop
  }
  resetProgress()
}

const prev = () => {
  if (offset.value - 4 >= 0) {
    offset.value -= 4
  } else {
    offset.value = Math.floor((produits.value.length - 1) / 4) * 4
  }
  resetProgress()
}

const goToPage = (i) => {
  offset.value = i * 4
  resetProgress()
}

// Progress bar + auto-scroll
const DUREE = 5000 // 5s par page

const resetProgress = () => {
  clearInterval(progressTimer)
  progressPct.value = 0
  let elapsed = 0
  progressTimer = setInterval(() => {
    elapsed += 50
    progressPct.value = (elapsed / DUREE) * 100
    if (elapsed >= DUREE) {
      clearInterval(progressTimer)
      next()
    }
  }, 50)
}

// Helpers
const heureActuelle = computed(() =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
)

const emojiProduit = (cat) => {
  const map = {
    'Sardine': '🐟', 'Thon': '🐠', 'Crevette': '🦐',
    'Homard': '🦞', 'Mérou': '🐡', 'Dorade': '🐠',
    'Calamar': '🦑', 'Poulpe': '🐙',
  }
  return map[cat] || '🐟'
}

const SAMAK_WA = '212647689006'
const lienWhatsApp = (p) => {
  const msg = encodeURIComponent(
    `سلام SamakMarket 🐟\nكنبغي: *${p.name}*\n💰 ${p.price} MAD/${p.unit}\n🌊 Vague du Jour\n🆔 ref:${p.id}`
  )
  return `https://wa.me/${SAMAK_WA}?text=${msg}`
}

const allerAuProduit = (p) => router.push(`/products/${p.id}`)

const bulleStyle = (i) => ({
  left: `${(i * 12.5) % 100}%`,
  width: `${4 + (i % 4) * 3}px`,
  height: `${4 + (i % 4) * 3}px`,
  animationDelay: `${i * 0.5}s`,
  animationDuration: `${3 + (i % 4)}s`,
})

//Hooks de transition
const onBeforeEnter = (el) => {
  console.log('Avant entrée', el)
}

const onAfterEnter = (el) => {
  console.log('Après entrée', el)
  // ex : focus, scroll, analytics, etc.
}

const onBeforeLeave = (el) => {
  console.log('Avant sortie', el)
}

const onAfterLeave = (el) => {
  console.log('Après sortie', el)
  // ex : nettoyage, mise à jour d'état
}
onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: { limit: 20, is_available: true }
    })
    produits.value = data.produits || data
    resetProgress()
  } catch (e) {
    console.warn('VagueduJour:', e.message)
  }
})

onUnmounted(() => {
  clearInterval(autoTimer)
  clearInterval(progressTimer)
})
</script>

<style scoped>
/* ── Section ─────────────────────────────────────────────── */
.vague-section {
  position: relative;
  background: linear-gradient(180deg, #3a82ff, #1150a1 50%, #05358a);
  overflow: hidden;
  padding: 30px 0 36px;
}

/* Bg */
.vague-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.bulle {
  position: absolute; bottom: -10px; border-radius: 50%;
  background: radial-gradient(circle, rgba(13,202,240,.25), transparent);
  animation: rise linear infinite;
}
@keyframes rise { 0% { transform:translateY(0); opacity:.2; } 100% { transform:translateY(-100vh); opacity:0; } }
.poisson { position: absolute; font-size: 1.4rem; opacity: .05; animation: swim linear infinite; }
.p1 { bottom: 30%; animation-duration: 22s; }
.p2 { bottom: 60%; font-size: .9rem; animation-duration: 30s; animation-delay: -12s; }
@keyframes swim { 0% { left: -5%; } 100% { left: 105%; } }

/* Contenu */
.vague-content { position: relative; z-index: 2; }

/* Header */
.vague-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  padding: 0 20px 20px;
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
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.3;transform:scale(1.4);} }
.vague-titre { color: white; font-size: 1.3rem; font-weight: 900; margin: 0 0 4px; }
.vague-sous  { color: rgba(255,255,255,.3); font-size: .73rem; margin: 0; }
.vague-compteur {
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  border-radius: 12px; padding: 10px 14px; text-align: center; flex-shrink: 0;
}
.compteur-val { color: #0dcaf0; font-size: 1.8rem; font-weight: 900; line-height: 1; }
.compteur-lbl { color: rgba(255,255,255,.25); font-size: .6rem; text-transform: uppercase; letter-spacing: .08em; margin-top: 4px; }

/* ── Vitrine ─────────────────────────────────────────────── */
.vitrine-wrap {
  display: flex; align-items: center; gap: 8px;
  padding: 0 8px;
}

/* Navigation */
.nav-btn {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  color: #0dcaf0; font-size: 1.4rem; font-weight: 300;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .2s; line-height: 1;
}
.nav-btn:hover { background: rgba(13,202,240,.18); transform: scale(1.1); }

/* Grille 2x2 */
.vitrine-grille {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 10px;
}

/* ── Cadre en verre ───────────────────────────────────────── */
.cadre-verre {
  position: relative; overflow: hidden;
  border-radius: 16px; cursor: pointer;
  /* Verre glassmorphism */
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 4px 24px rgba(0,0,0,.3),
    inset 0 1px 0 rgba(255,255,255,.08),
    inset 0 -1px 0 rgba(0,0,0,.2);
  transition: transform .2s, box-shadow .2s;
  min-height: 200px;
}
.cadre-verre:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,.4), 0 0 20px rgba(13,202,240,.1);
}

/* Reflets verre */
.verre-reflet-h {
  position: absolute; top: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,.06), transparent);
  pointer-events: none; z-index: 1; border-radius: 16px 16px 0 0;
}
.verre-reflet-v {
  position: absolute; top: 0; left: 0; bottom: 0; width: 30%;
  background: linear-gradient(90deg, rgba(255,255,255,.04), transparent);
  pointer-events: none; z-index: 1;
}

/* Badge */
.card-badge {
  position: absolute; top: 8px; left: 8px; z-index: 10;
  display: flex; align-items: center; gap: 4px;
  background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
  color: #0dcaf0; font-size: .58rem; font-weight: 900;
  letter-spacing: .1em; padding: 3px 7px; border-radius: 99px;
  border: 1px solid rgba(13,202,240,.3);
}

/* Card inner */
.card-inner {
  display: flex; flex-direction: column; height: 100%;
}

/* Visuel */
.card-visuel {
  height: 110px; position: relative; overflow: hidden;
  background: linear-gradient(135deg, #061428, #0d2040);
  border-radius: 14px 14px 0 0;
}
.card-img   { width: 100%; height: 100%; object-fit: cover; }
.card-emoji { font-size: 3rem; display: flex; align-items: center; justify-content: center; height: 100%; }
.card-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(transparent, rgba(6,20,40,.8));
}

/* Infos */
.card-info  { padding: 8px 10px 4px; flex: 1; }
.card-nom   { color: white; font-size: .78rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-ville { color: rgba(255,255,255,.3); font-size: .65rem; margin: 2px 0 5px; }
.card-prix-row { display: flex; align-items: baseline; gap: 3px; }
.card-prix  { color: #0dcaf0; font-size: .95rem; font-weight: 900; }
.card-mad   { color: rgba(255,255,255,.25); font-size: .6rem; }

/* WhatsApp */
.card-wa {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  background: linear-gradient(135deg, #075e54, #25d366);
  color: white; text-decoration: none; font-size: .7rem; font-weight: 700;
  padding: 7px 10px; margin: 4px 8px 8px; border-radius: 10px;
  transition: filter .2s;
}
.card-wa:hover { filter: brightness(1.15); }

/* Cadre vide */
.cadre-vide { cursor: default; }
.cadre-vide:hover { transform: none; }
.cadre-vide-inner {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 200px; gap: 8px;
}
.vide-ico { font-size: 2rem; opacity: .2; animation: float 3s ease-in-out infinite; }
.vide-txt { color: rgba(255,255,255,.1); font-size: .72rem; letter-spacing: .08em; }
@keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }

/* Progress bar */
.progress-wrap {
  height: 2px; background: rgba(255,255,255,.05);
  margin: 14px 20px 0; border-radius: 99px; overflow: hidden;
}
.progress-bar {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, #0dcaf0, rgba(13,202,240,.4));
  transition: width .05s linear;
}

/* Dots */
.dots { display: flex; justify-content: center; gap: 6px; padding: 10px 0 0; }
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(255,255,255,.12); border: none; cursor: pointer;
  transition: all .3s;
}
.dot-on { width: 20px; border-radius: 3px; background: #0dcaf0; box-shadow: 0 0 8px rgba(13,202,240,.5); }

/* slide-top : slide de gauche vers la droite + flash */
.slide-top-enter-active {
  transition:
    transform 0.25s ease-out,
    opacity 0.25s ease-out;
}
.slide-top-enter-from {
  transform: translateX(-30px);
  opacity: 0;
}
.slide-top-enter-to {
  transform: translateX(0);
  opacity: 1;
}

/* slide-bot : slide de droite vers la gauche + flash */
.slide-bot-enter-active {
  transition:
    transform 0.05s ease-out,
    opacity 0.05s ease-out;
}
.slide-bot-enter-from {
  transform: translateX(30px);
  opacity: 0;
}
.slide-bot-enter-to {
  transform: translateX(0);
  opacity: 1;
}

/* Effet de "flash" léger au moment d’apparition */
.slide-top-enter-to,
.slide-bot-enter-to {
  box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.4);
}
.slide-top-enter-from,
.slide-bot-enter-from {
  box-shadow: none;
}
/* Transitions entrée cards */
/* .slide-top-enter-active, .slide-top-leave-active,
.slide-bot-enter-active, .slide-bot-leave-active {
  transition: all .4s cubic-bezier(.25,.46,.45,.94);
}
.slide-top-enter-from { opacity: 0; transform: translateY(-16px); }
.slide-top-leave-to   { opacity: 0; transform: translateY(16px); }
.slide-bot-enter-from { opacity: 0; transform: translateY(16px); }
.slide-bot-leave-to   { opacity: 0; transform: translateY(-16px); } */

/* Mobile */
/* @media (max-width: 480px) {
  .vitrine-grille { gap: 8px; }
  .cadre-verre    { min-height: 175px; border-radius: 13px; }
  .card-visuel    { height: 90px; }
  .vague-titre    { font-size: 1.1rem; }
  .nav-btn        { width: 30px; height: 30px; font-size: 1.2rem; }
} */

</style>
