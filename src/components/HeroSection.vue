<!-- =============================================================
  components/HeroSection.vue — SamakMarket
  SEO: H1, meta structurées, aria-labels, schema.org ready
  Props: heroPhoto, totalProduits, onSearch, onVilleSelect
============================================================= -->
<template>
  <section class="hero" aria-label="SamakMarket — Marché de poisson frais au Maroc">

    <!-- ── Fond photo dynamique par ville ────────────────── -->
    <div class="hero-bg" aria-hidden="true">
      <img
        :src="heroPhoto"
        :alt="`Marché de poisson frais ${villeLabel} — SamakMarket`"
        class="hero-photo"
        loading="eager"
        fetchpriority="high"
        width="1600" height="580"
      />
      <div class="hero-overlay"></div>
      <div class="hero-shimmer"></div>
    </div>

    <!-- Vagues décoratives -->
    <div class="waves" aria-hidden="true">
      <div class="w w1"></div>
      <div class="w w2"></div>
      <div class="w w3"></div>
    </div>

    <!-- ── Contenu principal ──────────────────────────────── -->
    <div class="hero-body" style="margin-bottom: 80px;">

      <!-- Titre SEO H1 -->
       <div class="hero-title-wrap">
        <h1 class="hero-h1">
          La Tradition de la <span class="hero-accent">Pêche Marocaine</span>
        </h1>
        <p class="hero-tagline">L'élégance de l'océan, direct de nos pêcheurs</p>
      <!-- <ATPbtn/> -->
       
        
      </div>

      <!-- ── Barre de recherche (id pour TourGuide) ────────── -->
      <div class="search-glass-gold" id="hero-searchbar">
        <img src="/dophin.png" text-align: center alt="🐟 Samak Market" 
         class="block mx-auto h-32 md:h-40 w-auto object-contain 
              drop-shadow-xl transition-all duration-500 
              group-hover:drop-shadow-2xl group-hover:-rotate-2">
  <div class="input-section">
    <span class="search-icon">🔍</span>
    <div class="divider-vertical"></div>
    <input 
      v-model="searchLocal" 
      placeholder="Sardine, thon, crevettes..." 
      class="main-input"
    />
  </div>

  <div class="divider-vertical"></div>

  <div class="city-selector" @click.stop="toggleDropdown">
    <div class="selector-trigger">
      <span>{{ selectedVilleLabel }}</span>
      <span class="chevron" :class="{ 'rotate': isOpen }">▾</span>
    </div>

    <transition name="fade-slide">
      <div v-if="isOpen" class="dropdown-glass">
        <div 
          v-for="v in villes" 
          :key="v.value" 
          @click="selectVille(v)"
          class="dropdown-item"
        >
          {{ v.icon }} {{ v.name }}
        </div>
      </div>
    </transition>
  </div>

  <button @click="$emit('search')" class="btn-gold-action">
    Chercher
  </button>
</div>
<div class="live-badge" role="status">
          <span class="live-dot"></span>
          <span>ARRIVAGE EN DIRECT · {{ villeLabel }}</span>
        </div>
      <!-- ── 4 cartes USP (id pour TourGuide) ──────────────── -->
      <div class="usp-grid" id="hero-usp" aria-label="Avantages SamakMarket">

        <div class="usp-card usp-green" role="img" aria-label="100% frais, Tangier Direct">
          <div class="usp-ico-wrap usp-ico-green">
            <span aria-hidden="true">🕒</span>
          </div>
          <div>
            <p class="usp-title usp-t-green">100% Frais</p>
            <p class="usp-sub usp-s-green">Tangier Direct</p>
          </div>
        </div>

        <div class="usp-card usp-cyan" role="img" aria-label="Port Direct, 24h Garantie">
          <div class="usp-ico-wrap usp-ico-cyan">
            <span aria-hidden="true">🐟</span>
          </div>
          <div>
            <p class="usp-title usp-t-cyan">Port Direct</p>
            <p class="usp-sub usp-s-cyan">24h Garantie</p>
          </div>
        </div>

        <div class="usp-card usp-orange" role="img" aria-label="Marché Central, Pêcheurs Locaux">
          <div class="usp-ico-wrap usp-ico-orange">
            <span aria-hidden="true">🛒</span>
          </div>
          <div>
            <p class="usp-title usp-t-orange">Marché Central</p>
            <p class="usp-sub usp-s-orange">Pêcheurs Locaux</p>
          </div>
        </div>

        <div class="usp-card usp-purple" role="img" aria-label="Express, 2h Maximum">
          <div class="usp-ico-wrap usp-ico-purple">
            <span aria-hidden="true">🚀</span>
          </div>
          <div>
            <p class="usp-title usp-t-purple">Express</p>
            <p class="usp-sub usp-s-purple">2h Maximum</p>
          </div>
        </div>

      </div>

      <!-- ── Métriques ──────────────────────────────────────── -->
      <div class="hero-metrics" aria-label="Statistiques SamakMarket">
        <div class="metric">
          <span class="metric-val green" aria-label="100% frais du jour">100%</span>
          <span class="metric-lbl">Frais du jour</span>
        </div>
        <div class="metric-sep" aria-hidden="true"></div>
        <div class="metric">
          <span class="metric-val gold" aria-label="Zéro commission">Zéro</span>
          <span class="metric-lbl">Commission</span>
        </div>
        <!-- <div class="metric-sep" aria-hidden="true"></div>
        <div class="metric">
          <span class="metric-val" aria-label="Nombre de produits">+{{ totalProduits || '—' }}</span>
          <span class="metric-lbl">Poissons</span>
        </div> -->
        <div class="metric-sep" aria-hidden="true"></div>
        <div class="metric">
          <span class="metric-val green" aria-label="Commande directe WhatsApp">Direct</span>
          <span class="metric-lbl">WhatsApp</span>
        </div>
      </div>

      <!-- Scroll hint -->
      <div class="scroll-hint" aria-hidden="true">
        <span>Découvrir les offres</span>
        <svg width="14" height="10" viewBox="0 0 14 18" fill="none" aria-hidden="true">
          <path d="M7 1v16M7 17L1 11M7 17l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

    </div>
     
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import ATPbtn from './ATPbtn.vue'
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
const isOpen = ref(false);
const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const villes = [
  { value: 'ALL', name: 'Villes', icon: '📍' },
  { value: 'Tanger', name: 'Tanger', icon: '🌊' },
  { value: 'Casablanca', name: 'Casablanca', icon: '🏙️' },
  { value: 'Agadir', name: 'Agadir', icon: '🏖️' },
  { value: 'Rabat', name: 'Rabat', icon: '🏛️' },
  { value: 'Dakhla', name: 'Dakhla', icon: '🏜️' },
  { value: 'Safi', name: 'Safi', icon: '⚓' },
  { value: 'Nador', name: 'Nador', icon: '🐟' }
];

const selectedVilleLabel = computed(() => {
  const found = villes.find(v => v.value === villeLocal.value);
  return found ? `${found.icon} ${found.name}` : '📍 Villes';
});

const selectVille = (ville) => {
  villeLocal.value = ville.value
  isOpen.value = false
  onVilleChange() // Appelle ta fonction existante
}

// Fermer le menu si on clique ailleurs
window.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select-wrapper')) isOpen.value = false
})
</script>

<style scoped>
/* ── Hero ───────────────────────────────────────────────────── */
.hero {
  position: relative; min-height: 580px;
  overflow: hidden; background: #095d96;
  display: flex; flex-direction: column;
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
.hero-title-wrap { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 30px; }
.hero-h1 {
  font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900;
  color: white; line-height: 1.1; margin: 0;
  text-shadow: 0 2px 40px rgba(0,0,0,.5);
 
}
.hero-accent {
  background: linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b);
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: goldShift 3s linear infinite;
}
@keyframes goldShift { to { background-position: 200% center; } }
.hero-tagline {
  color: rgba(246, 247, 240, 0.842); font-size: .80rem; font-style: italic; margin: 0;
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
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a0e00; font-weight: 800; font-size: .70rem;
  padding: 11px 15px; border-radius: 12px; border: none;
  cursor: pointer; transition: all .2s; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(245,158,11,.4); letter-spacing: .03em;
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
.usp-title { font-size: .82rem; font-weight: 700; line-height: 1.2; margin: 0; }
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
.hero-metrics { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 36px; margin-top: -4px; }
.metric { display:flex; flex-direction:column; align-items:center; gap:3px; }
.metric-val { color: white; font-size: 1.6rem; font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums; }
.metric-val.gold  { color: #fbbf24; }
.metric-val.green { color: #34d399; }
.metric-lbl { color:rgba(247,244,244,0.877); font-size:.62rem; text-transform:uppercase; letter-spacing:.1em; }
.metric-sep { width:1px; background:rgba(255,255,255,.1); align-self:stretch; }

/* Scroll hint */
.scroll-hint { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 5px; padding-bottom: 11px; color: rgba(189, 201, 88, 0.486); font-size: .7rem; }
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
/* Wrapper principal */
.custom-select-wrapper {
  position: relative;
  min-width: 140px;
  cursor: pointer;
}

/* Le déclencheur (remplace le select) */
.sb-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.chevron {
  font-size: 0.7rem;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.is-active .chevron {
  transform: rotate(180deg);
}

/* Le menu déroulant (Style iPhone Glass) */
.sb-options-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: rgba(82, 158, 235, 0.85); /* Bleu profond transparent */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(110, 212, 243, 0.15);
  border-radius: 15px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* Chaque option */
.sb-option-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sb-option-item:last-child { border-bottom: none; }

.sb-option-item:hover {
  background: rgba(245, 158, 11, 0.2); /* Or transparent au survol */
}

.sb-option-item.is-selected {
  background: rgba(245, 158, 11, 0.4);
  color: #fcd34d;
}

.option-icon { font-size: 1.1rem; }

/* Animation fluide */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.search-glass-gold {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08); /* Effet verre transparent */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid #d4af37; /* Bordure Or Unie */
  border-radius: 18px;
  padding: 6px;
  width: 100%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.input-section {
  flex: 2;
  display: flex;
  align-items: center;
  padding-left: 15px;
}

.search-icon { color: #d4af37; margin-right: 10px; }

.main-input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  font-size: 0.95rem;
}

.main-input::placeholder { color: rgba(255, 255, 255, 0.5); }

.divider-vertical {
  width: 1px;
  height: 25px;
  background: rgba(212, 175, 55, 0.3);
  margin: 0 10px;
}

.city-selector {
  position: relative;
  flex: 1;
  cursor: pointer;
  color: #fcd34d;
  font-weight: 600;
  font-size: 0.9rem;
}

.selector-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
}

.chevron { transition: transform 0.3s ease; }
.chevron.rotate { transform: rotate(180deg); }

/* Menu déroulant style iPhone / Glass */
.dropdown-glass {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  background: rgba(10, 30, 60, 0.9);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 12px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  padding: 12px 15px;
  color: white;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: rgba(212, 175, 55, 0.2);
}

/* Bouton Chercher Doré Uni */
.btn-gold-action {
  background: #d4af37; /* Or Uni */
  color: #1a0e00;
  border: none;
  padding: 10px 10px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.btn-gold-action:hover {
  background: #fcd34d;
  transform: translateY(-1px);
}

/* Mobile */
@media (max-width: 768px) {
  .search-glass-gold { flex-direction: column; gap: 10px; padding: 15px; }
  .divider-vertical { display: none; }
  .btn-gold-action { width: 100%; }
}
</style>
