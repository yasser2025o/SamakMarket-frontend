<!-- =============================================================
  components/HeroSection.vue — SamakMarket
  SEO: H1, meta structurées, aria-labels, schema.org ready
  Props: heroPhoto, totalProduits, onSearch, onVilleSelect
============================================================= -->
<template>
  <section class="hero" aria-label="SamakMarket — Marché de poisson frais au Maroc">
    <div class="hero-bg" aria-hidden="true">
      <img :src="heroPhoto" class="hero-photo" loading="eager" fetchpriority="high" />
      <div class="hero-overlay"></div>
    </div>

    <div class="hero-body">
      <div class="mascot-wrapper" v-if="showMascot">
         </div>

      <div class="hero-title-wrap">
        <h1 class="hero-h1">
          La Tradition de la <span class="hero-accent">Pêche Marocaine</span>
        </h1>
        <p class="hero-tagline">L'élégance de l'océan, direct de nos pêcheurs</p>
        
        <div class="live-badge" role="status">
          <span class="live-dot"></span>
          <span>ARRIVAGE EN DIRECT · {{ villeLabel }}</span>
        </div>
      </div>

      <div class="searchbar" id="hero-searchbar">
        <div class="sb-input-wrap">
          <span class="sb-icon">🔍</span>
          <input v-model="searchLocal" @input="onSearchInput" placeholder="Sardine, thon, crevettes..." class="sb-input" type="search" />
          <div class="sb-divider"></div>
          <select v-model="villeLocal" @change="onVilleChange" class="sb-select">
            <option value="ALL">📍 Toutes les Villes</option>
            <option value="Tanger">🌊 Tanger</option>
            <option value="Casablanca">🏙️ Casablanca</option>
            </select>
        </div>
        <button @click="$emit('search')" class="sb-btn">Chercher</button>
      </div>

      <div class="usp-grid">
        <div class="usp-card glass-effect">
          <div class="usp-ico-wrap ico-gold">🕒</div>
          <div>
            <p class="usp-title">100% Frais</p>
            <p class="usp-sub">Pêche du jour</p>
          </div>
        </div>
        <div class="usp-card glass-effect">
          <div class="usp-ico-wrap ico-gold">🐟</div>
          <div>
            <p class="usp-title">Port Direct</p>
            <p class="usp-sub">Sans intermédiaire</p>
          </div>
        </div>
        <div class="usp-card glass-effect">
          <div class="usp-ico-wrap ico-gold">⚓</div>
          <div>
            <p class="usp-title">Tradition</p>
            <p class="usp-sub">Pêcheurs Locaux</p>
          </div>
        </div>
        <div class="usp-card glass-effect">
          <div class="usp-ico-wrap ico-gold">🚀</div>
          <div>
            <p class="usp-title">Express</p>
            <p class="usp-sub">Livraison < 2h</p>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-metrics" aria-label="Statistiques SamakMarket">
  <div class="metric glass-metric">
    <span class="metric-val gold-glow" aria-label="100% frais du jour">100%</span>
    <span class="metric-lbl">Frais du Jour</span>
  </div>
  
  <div class="metric-sep" aria-hidden="true"></div>
  
  <div class="metric glass-metric">
    <span class="metric-val gold-glow" aria-label="Zéro commission">Zéro</span>
    <span class="metric-lbl">Commission</span>
  </div>
  
  <div class="metric-sep" aria-hidden="true"></div>
  
  <div class="metric glass-metric">
    <span class="metric-val white-glow" aria-label="Nombre de produits">+{{ totalProduits || '—' }}</span>
    <span class="metric-lbl">Poissons</span>
  </div>
  
  <div class="metric-sep" aria-hidden="true"></div>
  
  <div class="metric glass-metric">
    <span class="metric-val gold-glow" aria-label="Commande directe WhatsApp">Direct</span>
    <span class="metric-lbl">WhatsApp</span>
  </div>
</div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  heroPhoto:     { type: String, default: '/images/villes/Default.jpg' },
  totalProduits: { type: [Number, String], default: 0 },
  modelSearch:   { type: String, default: '' },
  modelVille:    { type: String, default: 'ALL' },
})

const emit = defineEmits(['search', 'update:modelSearch', 'update:modelVille', 'villeSelect'])

const searchLocal = ref(props.modelSearch)
const villeLocal  = ref(props.modelVille)

const villeLabel = computed(() => villeLocal.value === 'ALL' ? 'au Maroc' : `à ${villeLocal.value}`)

let timer = null
const onSearchInput = () => {
  clearTimeout(timer)
  emit('update:modelSearch', searchLocal.value)
  timer = setTimeout(() => emit('search'), 450)
}

const onVilleChange = () => {
  emit('update:modelVille', villeLocal.value)
  emit('villeSelect', villeLocal.value)
}
</script>

<style scoped>
/* ── Hero ───────────────────────────────────────────────────── */
.hero-h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-style: italic; /* Adds that "Traditional" classy touch */
  color: #ffffff;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
}
.hero-bg        { position: absolute; inset: 0; z-index: 0; }
.hero-photo     { width: 100%; height: 100%; object-fit: cover; min-height: 580px; }
.hero-overlay {
  background: linear-gradient(135deg, rgba(6,44,170,0.15) 10%, rgba(24, 81, 236, 0.534) 30%, rgba(31,128,173,0.7) 60%, rgba(5, 68, 177, 0.9) 100%);
   backdrop-filter: saturate(1.2); 
}

 .text-poisson { color: rgba(255,182,193,0.8); } 
  

.hero-shimmer {
  position: absolute; bottom: 0; left: 0; right: 0; height: 180px;
  background: linear-gradient(to top, rgba(0,180,216,0.2) 0%, rgba(144,224,239,0.05) 50%, transparent 100%);
  pointer-events: none;
}
.waves { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.w {
  position: absolute; left: -100%; width: 300%; height: 1.5px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, rgba(0,180,216,.2), rgba(144,224,239,.25), rgba(0,180,216,.2), transparent);
  animation: wdrift 10s ease-in-out infinite;
}
.w1 { top: 35%; opacity:.12; animation-duration:10s; }
.w2 { top: 55%; opacity:.07; animation-duration:13s; animation-delay:3s; height:1px; }
.w3 { top: 72%; opacity:.05; animation-duration:16s; animation-delay:6s; }
@keyframes wdrift {
  0%,100% { transform:translateX(0) scaleY(1); }
  40%     { transform:translateX(9%) scaleY(3); }
  70%     { transform:translateX(4%) scaleY(1.5); }
}

/* ── Body ───────────────────────────────────────────────────── */
.hero-body {
  position: relative; z-index: 2; flex: 1;
  max-width: 860px; margin: 0 auto; width: 100%;
  padding: 60px 24px 36px;
  display: flex; flex-direction: column; align-items: center; gap: 28px;
}

/* ── Titre ──────────────────────────────────────────────────── */
.hero-title-wrap { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.hero-h1 {
  font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900;
  color: white; line-height: 1.1; margin: 0;
  text-shadow: 0 2px 40px rgba(0,0,0,.5);
 
}
.hero-accent {
  background: linear-gradient(90deg, #ffcc33, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}
/* 3. Glassmorphism (Frosted Glass) for USP Cards */
.glass-effect {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(15px) !important;
  -webkit-backdrop-filter: blur(15px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2) !important;
}

.usp-title {
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.ico-gold {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #f59e0b;
}
/* 4. Subtle Zellige Background Pattern Overlay */
.hero-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); /* Simple texture */
  background-size: 30px 30px;
  background-color: rgba(9, 93, 150, 0.6); /* Deep Ocean Blue */
}
@keyframes goldShift { to { background-position: 200% center; } }
.hero-tagline {
  color: rgba(3,247,15,0.38); font-size: .70rem; font-style: italic; margin: 0;
}
.live-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,180,216,.08); border: 1px solid rgba(0,180,216,.2);
  color: #7dd3f0; font-size: .75rem; font-weight: 600; letter-spacing: .06em;
  padding: 6px 18px; border-radius: 99px; margin-top: 4px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: livepulse 1.8s ease-in-out infinite;
}
@keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }

/* ── Searchbar ──────────────────────────────────────────────── */
.searchbar {
  width: 100%;
  display: flex; align-items: center; flex-wrap: wrap; gap: 2px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.15);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-radius: 18px; padding: 6px;
  box-shadow: 0 12px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
}
.sb-input-wrap { flex: 1; min-width: 160px; position: relative; display: flex; align-items: center; }
.sb-icon   { position: absolute; left: 13px; font-size: .9rem; pointer-events: none; }
.sb-input  { width: 100%; background: transparent; border: none; outline: none; color: white; font-size: .9rem; padding: 11px 14px 11px 38px; }
.sb-input::placeholder { color: rgba(147,197,253,.45); }
.sb-divider { width:1px; height:26px; background:rgba(255,255,255,.1); flex-shrink:0; }
.sb-select { background: transparent; border: none; outline: none; color: rgba(255,255,255,.75); font-size: .85rem; padding: 11px 16px; cursor: pointer; min-width: 100px; }
.sb-select option { background: #1e3a5f; color: white; }
.sb-btn {
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #f59e0b;
}
.sb-btn:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(245,158,11,.55); }

/* ── USP Grid ───────────────────────────────────────────────── */
.usp-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 10px; width: 100%;
}
.usp-card {
  display: flex; align-items: center; gap: 10px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; padding: 12px;
  transition: transform .3s, box-shadow .3s;
  cursor: default;
}
.usp-card:hover { transform: scale(1.03); }
.usp-ico-wrap {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}

.usp-sub   { font-size: .68rem; font-weight: 500; margin: 2px 0 0; }

/* Colors USP */
.usp-green:hover { box-shadow: 0 8px 24px rgba(52,211,153,.2); border-color: rgba(52,211,153,.3); }
.usp-ico-green { background: linear-gradient(135deg,rgba(16,185,129,0.9),rgba(13,148,136,1)); box-shadow: 0 4px 12px rgba(52,211,153,.3); }
.usp-t-green { background: linear-gradient(90deg,#34d399,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.usp-s-green { color: #6ee7b7; }

.usp-cyan:hover { box-shadow: 0 8px 24px rgba(34,211,238,.2); border-color: rgba(34,211,238,.3); }
.usp-ico-cyan { background: linear-gradient(135deg,rgba(6,182,212,0.9),rgba(37,99,235,1)); box-shadow: 0 4px 12px rgba(6,182,212,.3); }
.usp-t-cyan { background: linear-gradient(90deg,#22d3ee,#60a5fa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.usp-s-cyan { color: #67e8f9; }

.usp-orange:hover { box-shadow: 0 8px 24px rgba(251,146,60,.2); border-color: rgba(251,146,60,.3); }
.usp-ico-orange { background: linear-gradient(135deg,rgba(249,115,22,0.9),rgba(217,119,6,1)); box-shadow: 0 4px 12px rgba(249,115,22,.3); }
.usp-t-orange { background: linear-gradient(90deg,#fb923c,#fbbf24); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.usp-s-orange { color: #fdba74; }

.usp-purple:hover { box-shadow: 0 8px 24px rgba(167,139,250,.2); border-color: rgba(167,139,250,.3); }
.usp-ico-purple { background: linear-gradient(135deg,rgba(139,92,246,0.9),rgba(79,70,229,1)); box-shadow: 0 4px 12px rgba(139,92,246,.3); }
.usp-t-purple { background: linear-gradient(90deg,#a78bfa,#818cf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.usp-s-purple { color: #c4b5fd; }

/* ── Métriques ──────────────────────────────────────────────── */
/* ── Metrics Refinement ────────────────────────────────────── */
.hero-metrics {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px 40px;
  margin-top: 10px;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

/* Elegant Typography for Values */
.metric-val {
  font-family: 'Playfair Display', serif; /* Matching the H1 */
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

/* The "Gilded" Gold Effect */
.gold-glow {
  color: #f59e0b;
  text-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
}

.white-glow {
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

/* Subtle Labels */
.metric-lbl {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.65rem;
  font-family: 'Montserrat', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 600;
}

.metric-sep {
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2), transparent);
  align-self: center;
}

/* Responsive Tweak */
@media (max-width: 768px) {
  .hero-metrics {
    gap: 20px;
    background: transparent;
    border: none;
  }
  .metric-sep {
    display: none;
  }
  .metric-val {
    font-size: 1.5rem;
  }
}

/* Scroll hint */
.scroll-hint { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 5px; padding-bottom: 22px; color: rgba(255,255,255,.2); font-size: .7rem; }
.scroll-hint svg { animation: scrollbounce 1.8s ease-in-out infinite; }
@keyframes scrollbounce { 0%,100%{transform:translateY(0)} 55%{transform:translateY(6px)} }

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero-body { padding: 44px 16px 28px; gap: 20px; }
  .hero-h1   { font-size: 2.4rem; }
  .metric-sep { display: none; }
  .searchbar  { border-radius: 13px; }
  .usp-grid   { gap: 8px; }
}
@media (max-width: 420px) {
  .usp-card { padding: 10px 8px; }
  .usp-title { font-size: .75rem; }
}
</style>
