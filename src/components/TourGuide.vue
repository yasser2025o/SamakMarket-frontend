<!-- =============================================================
  components/TourGuide.vue — Fix curseur sombre
  Le problème : pointer-events bloquait les clics sur la page
  Fix : overlay seulement autour du spotlight, pas partout
============================================================= -->
<template>
  <Teleport to="body">
    <Transition name="tour-fade">
      <div v-if="actif && etapeActuelle" class="tour-root">

        <!-- Overlay SEULEMENT si spotlight actif — ne bloque pas les clics ailleurs -->
        <div
          v-if="rectElement"
          class="tour-overlay-top"
          :style="{ height: rectElement.top - 8 + 'px' }"
          @click="skip"
        ></div>
        <div
          v-if="rectElement"
          class="tour-overlay-bottom"
          :style="{ top: rectElement.top + rectElement.height + 24 + 'px' }"
          @click="skip"
        ></div>
        <div
          v-if="rectElement"
          class="tour-overlay-left"
          :style="{
            top:    rectElement.top - 8 + 'px',
            height: rectElement.height + 16 + 'px',
            width:  Math.max(0, rectElement.left - 8) + 'px',
          }"
          @click="skip"
        ></div>
        <div
          v-if="rectElement"
          class="tour-overlay-right"
          :style="{
            top:    rectElement.top - 8 + 'px',
            height: rectElement.height + 16 + 'px',
            left:   rectElement.left + rectElement.width + 8 + 'px',
          }"
          @click="skip"
        ></div>

        <!-- Overlay plein écran si pas de spotlight (étape center) -->
        <div
          v-if="!rectElement"
          class="tour-overlay-full"
          @click="skip"
        ></div>

        <!-- Spotlight sur l'élément ciblé -->
        <div
          v-if="rectElement"
          class="tour-spotlight"
          :style="{
            top:    rectElement.top    - 8 + 'px',
            left:   rectElement.left   - 8 + 'px',
            width:  rectElement.width  + 16 + 'px',
            height: rectElement.height + 16 + 'px',
          }"
        ></div>

        <!-- Tooltip bulle -->
        <div class="tour-tooltip" :style="tooltipStyle">
          <!-- Flèche -->
          <div class="tour-arrow" :class="`arrow-${etapeActuelle.position || 'bottom'}`"></div>

          <!-- Header -->
          <div class="tour-header">
            <div class="tour-ico">{{ etapeActuelle.ico }}</div>
            <span class="tour-step-num">{{ indexActuel + 1 }}/{{ etapes.length }}</span>
            <button class="tour-skip-btn" @click="skip" aria-label="Fermer la visite">✕</button>
          </div>

          <!-- Contenu -->
          <div class="tour-body">
            <div class="tour-titre">{{ texte(etapeActuelle.titre) }}</div>
            <div class="tour-desc">{{ texte(etapeActuelle.desc) }}</div>
          </div>

          <!-- Progress -->
          <div class="tour-progress">
            <div class="tour-progress-fill" :style="{ width: progressPct + '%' }"></div>
          </div>

          <!-- Footer -->
          <div class="tour-footer">
            <button class="tour-btn-skip" @click="skip">
              {{ lang === 'ar' ? 'تخطي' : 'Passer' }}
            </button>
            <div class="tour-dots" aria-hidden="true">
              <div v-for="(_, i) in etapes" :key="i" class="tour-dot" :class="{ 'tour-dot-on': i === indexActuel }"></div>
            </div>
            <button class="tour-btn-next" @click="suivant">
              {{ indexActuel === etapes.length - 1
                ? (lang === 'ar' ? 'ابدأ 🎉' : 'Commencer 🎉')
                : (lang === 'ar' ? 'التالي ←' : 'Suivant →')
              }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const lang = navigator.language?.startsWith('ar') ? 'ar' : 'fr'
const texte = (obj) => typeof obj === 'object' ? (lang === 'ar' ? obj.ar : obj.fr) : obj

const etapes = [
  {
    selecteur: '#hero-searchbar',
    position:  'bottom',
    ico:       '🔍',
    titre: { fr: 'Cherche ton poisson', ar: 'ابحث عن سمكتك' },
    desc:  { fr: 'Tape "sardine", "thon" ou choisis ta ville pour trouver les meilleurs pêcheurs.', ar: 'اكتب "سردين" أو اختر مدينتك للعثور على أقرب الصيادين.' },
  },
  {
    selecteur: '.vague-section',
    position:  'top',
    ico:       '🌊',
    titre: { fr: 'Vague du Jour', ar: 'موجة اليوم' },
    desc:  { fr: 'Découvre les arrivages frais du matin, directement du port !', ar: 'اكتشف أحدث الصيد الصباحي مباشرة من الميناء!' },
  },
  {
    selecteur: '.chip',
    position:  'bottom',
    ico:       '🐟',
    titre: { fr: 'Filtre par catégorie', ar: 'فلتر حسب النوع' },
    desc:  { fr: 'Sardine, thon, crevettes... clique pour filtrer les produits.', ar: 'سردين، تونة، جمبري... انقر للتصفية.' },
  },
  {
    selecteur: '[href*="wa.me"], .btn-wa, .card-wa',
    position:  'top',
    ico:       '📱',
    titre: { fr: 'Commander sur WhatsApp', ar: 'اطلب عبر واتساب' },
    desc:  { fr: 'Un clic pour envoyer ta commande au pêcheur. Zéro commission !', ar: 'نقرة واحدة لإرسال طلبك للصياد. بدون عمولة!' },
  },
  {
    selecteur: null,
    position:  'center',
    ico:       '🎉',
    titre: { fr: 'Tu es prêt !', ar: 'أنت جاهز!' },
    desc:  { fr: 'Bonne pêche sur SamakMarket 🐟 Poisson frais · Pêcheurs locaux · Zéro intermédiaire.', ar: 'صيد موفق على سمك ماركت 🐟 سمك طازج · صيادون محليون · بدون وسطاء.' },
  },
]

const actif        = ref(false)
const indexActuel  = ref(0)
const rectElement  = ref(null)
const tooltipPos   = ref({ top: 100, left: 100 })

const etapeActuelle = computed(() => etapes[indexActuel.value])
const progressPct   = computed(() => ((indexActuel.value + 1) / etapes.length) * 100)

const TOOLTIP_W = 280
const TOOLTIP_H = 210
const GAP       = 16

const calculerPosition = async () => {
  await nextTick()
  const etape = etapeActuelle.value
  if (!etape?.selecteur) {
    rectElement.value = null
    tooltipPos.value  = {
      top:  window.innerHeight / 2 - TOOLTIP_H / 2 + window.scrollY,
      left: window.innerWidth  / 2 - TOOLTIP_W / 2,
    }
    return
  }

  const el = document.querySelector(etape.selecteur)
  if (!el) {
    rectElement.value = null
    tooltipPos.value  = { top: 200 + window.scrollY, left: window.innerWidth / 2 - TOOLTIP_W / 2 }
    return
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await new Promise(r => setTimeout(r, 500))

  const rect = el.getBoundingClientRect()
  rectElement.value = {
    top:    rect.top    + window.scrollY,
    left:   rect.left   + window.scrollX,
    width:  rect.width,
    height: rect.height,
  }

  const pos = etape.position || 'bottom'
  let top, left

  if (pos === 'bottom') {
    top  = rect.bottom + window.scrollY + GAP
    left = rect.left + window.scrollX + rect.width / 2 - TOOLTIP_W / 2
  } else {
    top  = rect.top + window.scrollY - TOOLTIP_H - GAP
    left = rect.left + window.scrollX + rect.width / 2 - TOOLTIP_W / 2
  }

  left = Math.max(12, Math.min(left, window.innerWidth - TOOLTIP_W - 12))
  top  = Math.max(window.scrollY + 12, top)

  tooltipPos.value = { top, left }
}

const tooltipStyle = computed(() => ({
  top:   tooltipPos.value.top  + 'px',
  left:  tooltipPos.value.left + 'px',
  width: TOOLTIP_W + 'px',
}))

const suivant = async () => {
  if (indexActuel.value < etapes.length - 1) {
    indexActuel.value++
    await calculerPosition()
  } else {
    terminer()
  }
}

const skip    = () => terminer()
const terminer = () => {
  actif.value = false
  localStorage.setItem('samak_tour_done', '1')
}

onMounted(async () => {
  if (localStorage.getItem('samak_tour_done')) return
  await new Promise(r => setTimeout(r, 1800))
  actif.value = true
  await calculerPosition()
})

const onResize = () => calculerPosition()
window.addEventListener('resize', onResize)
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
.tour-root { position: fixed; inset: 0; z-index: 99999; pointer-events: none; }

/* 4 overlays autour du spotlight — pointer-events: all seulement sur eux */
.tour-overlay-top,
.tour-overlay-bottom,
.tour-overlay-left,
.tour-overlay-right {
  position: fixed; background: rgba(2,14,35,0.72);
  pointer-events: all; cursor: pointer;
}
.tour-overlay-top    { top: 0; left: 0; right: 0; }
.tour-overlay-bottom { bottom: 0; left: 0; right: 0; }
.tour-overlay-left   { }
.tour-overlay-right  { right: 0; }
.tour-overlay-full {
  position: fixed; inset: 0;
  background: rgba(2,14,35,0.72);
  backdrop-filter: blur(2px);
  pointer-events: all; cursor: pointer;
}

/* Spotlight */
.tour-spotlight {
  position: absolute; z-index: 2;
  border-radius: 14px;
  border: 2px solid rgba(13,202,240,0.6);
  box-shadow: 0 0 0 4px rgba(13,202,240,0.1);
  animation: spotlight-pulse 2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes spotlight-pulse {
  0%,100% { border-color: rgba(13,202,240,0.4); }
  50%     { border-color: rgba(13,202,240,0.9); box-shadow: 0 0 0 6px rgba(13,202,240,0.15); }
}

/* Tooltip */
.tour-tooltip {
  position: absolute; z-index: 10;
  pointer-events: all;
  background: rgba(4,15,32,0.95);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(13,202,240,0.2);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07);
  animation: tooltip-in 0.35s cubic-bezier(0.34,1.56,0.64,1);
  overflow: hidden;
}
.tour-tooltip::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), transparent);
  pointer-events: none;
}
@keyframes tooltip-in {
  from { opacity:0; transform: scale(0.88) translateY(8px); }
  to   { opacity:1; transform: scale(1) translateY(0); }
}

/* Flèche */
.tour-arrow {
  position: absolute; width: 12px; height: 12px;
  background: rgba(4,15,32,0.95); border: 1px solid rgba(13,202,240,0.2);
}
.arrow-bottom { top: -7px; left: 50%; transform: translateX(-50%) rotate(45deg); border-bottom: none; border-right: none; }
.arrow-top    { bottom: -7px; left: 50%; transform: translateX(-50%) rotate(45deg); border-top: none; border-left: none; }

/* Header */
.tour-header { display: flex; align-items: center; gap: 10px; padding: 14px 14px 0; }
.tour-ico { font-size: 1.5rem; filter: drop-shadow(0 0 8px rgba(13,202,240,0.4)); }
.tour-step-num { flex: 1; color: rgba(13,202,240,0.7); font-size: .65rem; font-weight: 700; letter-spacing: .1em; }
.tour-skip-btn {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.4); font-size: .7rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.tour-skip-btn:hover { background: rgba(255,255,255,0.12); color: white; }

/* Body */
.tour-body { padding: 10px 14px 12px; }
.tour-titre { color: white; font-size: .9rem; font-weight: 800; margin-bottom: 6px; }
.tour-desc  { color: rgba(255,255,255,0.55); font-size: .78rem; line-height: 1.6; }

/* Progress */
.tour-progress { height: 2px; background: rgba(255,255,255,0.06); margin: 0 14px; }
.tour-progress-fill { height: 100%; background: linear-gradient(90deg, #0dcaf0, rgba(13,202,240,0.4)); transition: width .4s ease; }

/* Footer */
.tour-footer { display: flex; align-items: center; gap: 8px; padding: 10px 14px 14px; }
.tour-btn-skip {
  color: rgba(255,255,255,0.25); font-size: .72rem;
  background: none; border: none; cursor: pointer;
  padding: 4px 8px; border-radius: 6px; transition: all .2s; white-space: nowrap;
}
.tour-btn-skip:hover { color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
.tour-dots { display: flex; gap: 4px; flex: 1; justify-content: center; }
.tour-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: all .3s; }
.tour-dot-on { width: 16px; border-radius: 3px; background: #0dcaf0; }
.tour-btn-next {
  background: linear-gradient(135deg, #0891b2, #0dcaf0);
  color: white; border: none; border-radius: 10px;
  font-size: .78rem; font-weight: 800; padding: 7px 14px;
  cursor: pointer; box-shadow: 0 4px 14px rgba(13,202,240,0.3);
  transition: all .2s; white-space: nowrap;
}
.tour-btn-next:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* Transitions */
.tour-fade-enter-active { transition: opacity .4s ease; }
.tour-fade-leave-active { transition: opacity .3s ease; }
.tour-fade-enter-from,
.tour-fade-leave-to     { opacity: 0; }
</style>
