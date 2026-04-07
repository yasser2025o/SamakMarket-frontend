<!-- =============================================================
  views/MarketplaceView.vue — SamakMarket
  Design : Luxury Fish Market — dark ocean / gold accents
  GPS : UNIQUEMENT dans VendeursProches, pas dans les filtres
============================================================= -->
<template>
  <NavBar />

  <div class="main-homepage-wrapper">
   <HeroSection 
  v-model:modelVille="filtres.city"
  :countsByCity="statsVilles" 
  @search="rechargerProduits"
/>
  </div>

  <!-- <VagueduJour />  -->
  <VendeursProches />

  <div class="toolbar">
    <div class="cats-row">
      <button
        @click="filtrerCategorie('')"
        :class="['chip', filtres.category === '' && 'chip-on']"
      >
        🐟 {{ i18n.t('common.all') }}
      </button>
      <button
        v-for="cat in categories" :key="cat.valeur"
        @click="filtrerCategorie(cat.valeur)"
        :class="['chip', filtres.category === cat.valeur && 'chip-on']"
      >
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <div class="toolbar-right flex items-center gap-4">
      <span class="count-txt text-sm text-gray-600">
        <strong class="text-gray-900">{{ store.pagination.total }}</strong> {{ i18n.t('common.products') }}
      </span>

      <div class="vue-btns flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
        <button @click="vue='2'" :class="btnClass('2')" :title="i18n.t('toolbar.view_2')">
          <svg viewBox="0 0 20 20" fill="currentColor"><rect x="1" y="1" width="8" height="18" rx="2"/><rect x="11" y="1" width="8" height="18" rx="2"/></svg>
        </button>

        <button @click="vue='3'" :class="btnClass('3')" :title="i18n.t('toolbar.view_3')">
          <svg viewBox="0 0 20 20" fill="currentColor"><rect x="1" y="1" width="5" height="18" rx="1.5"/><rect x="7.5" y="1" width="5" height="18" rx="1.5"/><rect x="14" y="1" width="5" height="18" rx="1.5"/></svg>
        </button>

        <button @click="vue='4'" :class="btnClass('4')" :title="i18n.t('toolbar.view_4')">
          <svg viewBox="0 0 20 20" fill="currentColor"><rect x="1" y="1" width="3.5" height="18" rx="1"/><rect x="5.5" y="1" width="3.5" height="18" rx="1"/><rect x="10" y="1" width="3.5" height="18" rx="1"/><rect x="14.5" y="1" width="3.5" height="18" rx="1"/></svg>
        </button>

        <button @click="vue='liste'" :class="btnClass('liste')" :title="i18n.t('toolbar.view_list')">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="5" x2="18" y2="5"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="2" y1="15" x2="18" y2="15"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div v-if="filtres.city || filtres.category" class="active-filters">
    <span v-if="filtres.city" class="af-pill">
      📍 {{ filtres.city }}
      <button @click="filtres.city=''; chargerProduits()">×</button>
    </span>
    <span v-if="filtres.category" class="af-pill">
      {{ categories.find(c=>c.valeur===filtres.category)?.emoji }}
      {{ filtres.category }}
      <button @click="filtrerCategorie('')">×</button>
    </span>
    <button class="af-reset" @click="toutReset">{{ i18n.t('common.clear_all') }}</button>
  </div>

  <main class="produits-zone">
    <div v-if="store.chargement" class="etat">
      <div class="fish-bounce">🐟</div>
      <p class="etat-txt">{{ i18n.t('common.loading') }}</p>
    </div>

    <div v-else-if="store.erreur" class="etat">
      <div class="etat-ico">😕</div>
      <p class="etat-err">{{ i18n.t('common.error') }}</p>
      <button @click="chargerProduits" class="btn-action">{{ i18n.t('common.retry') }}</button>
    </div>

    <div v-else-if="store.produits.length === 0" class="etat">
      <div class="etat-ico">🔍</div>
      <p class="etat-vide">{{ i18n.t('common.no_results') }}</p>
      <p class="etat-sous">{{ i18n.t('common.try_filters') }}</p>
      <button @click="toutReset" class="btn-action mt-3">{{ i18n.t('common.reset_filters') }}</button>
    </div>

    <div v-else :class="grilleClass">
      <ProductCard
        v-for="produit in store.produits"
        :key="produit.id"
        :produit="produit"
        :vue-liste="vue === 'liste'"
      />
    </div>

    <div v-if="store.pagination.pages > 1" class="pagination">
      <button
        @click="changerPage(store.pagination.page - 1)"
        :disabled="store.pagination.page === 1"
        class="pg-btn"
      >← {{ i18n.t('common.prev') }}</button>

      <button
        v-for="p in store.pagination.pages" :key="p"
        @click="changerPage(p)"
        :class="['pg-btn', p === store.pagination.page && 'pg-on']"
      >{{ p }}</button>

      <button
        @click="changerPage(store.pagination.page + 1)"
        :disabled="store.pagination.page === store.pagination.pages"
        class="pg-btn"
      >{{ i18n.t('common.next') }} →</button>
    </div>
  </main>

  <FooterSamak />
  <ChatBot />
  <CartSystem />
</template>

<script setup>
import HeroSection from '../components/HeroSection.vue'
import { ref, computed, onMounted } from 'vue'
import { useProductStore }   from '../stores/products'
import NavBar          from '../components/NavBar.vue'
import ProductCard     from '../components/ProductCard.vue'
import ProductPromo    from '../components/ProductPromo.vue'
import VendeursProches from '../components/VendeursProches.vue'
import FooterSamak  from '../components/FooterSamak.vue'
import ChatBot      from '../components/ChatBot.vue'
import VagueduJour   from '../components/VagueduJour.vue'
import CartSystem from '../components/CartSystem.vue'
//import PoissonGrillade from '../components/PoissonGrillade.vue'
import { useI18nStore } from '../stores/i18n'
// 1. Déclare la variable pour les compteurs
const statsVilles = ref({
  'Tanger': 0,
  'Casablanca': 0,
  'Agadir': 0,
  'ALL': 0
})

// 2. Déclare la fonction de recherche
const rechargerProduits = () => {
  console.log("Recherche lancée...")
  // Ici, appelle la fonction de ton store qui charge les produits
  // ex: productStore.chargerProduits()
}

// Optionnel : Exemple pour remplir statsVilles au chargement
onMounted(() => {
  // Simule ou récupère les vraies données
  statsVilles.value = {
    'Tanger': 12,
    'Casablanca': 5,
    'Agadir': 3,
    'ALL': 20
  }
})
const i18n = useI18nStore()
const btnClass = (type) => [
  'vb w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200',
  'text-gray-500 hover:text-blue-700 hover:bg-white',
  vue === type
    ? 'bg-white text-blue-800 shadow font-bold'
    : ''
]

const store = useProductStore()
//image change dans hero par ville en searchbar
const photosVilles = {
  '':           './Public/images/villes/Default.jpg',
  'Tanger':     './Public/images/villes/tanger.jpg',
  'Casablanca': './Public/images/villes/casablanca.jpg',
  'Agadir':     './Public/images/villes/agadir.jpg',
  'Rabat':      './Public/images/villes/rabat.jpg',
  'Dakhla':     './Public/images/villes/dakhla.jpg',
  'Safi':       './Public/images/villes/safi.jpg',
  'Nador':      './Public/images/villes/nador.jpg',
}

const heroPhoto = ref(photosVilles[''])

// Remplace ton onVilleSelect existant par celui-ci
const onVilleSelect = () => {
  heroPhoto.value = photosVilles[filtres.value.city] || photosVilles['']
  filtres.value.page = 1
  chargerProduits()
}
// ── Vue grille ──────────────────────────────────────────────
const vue = ref(2)
const grilleClass = computed(() => ({
  liste: 'flex flex-col gap-3',
  '2':   'grid grid-cols-1 sm:grid-cols-2 gap-5',
  '3':   'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5',
  '4':   'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
}[vue.value]))

// ── Filtres ─────────────────────────────────────────────────
const filtres = ref({ search:'', city:'', category:'', page:1, limit:12 })

const categories = [
  { valeur: 'Sardine', label: 'سردين / Sardine', emoji: '🐟' },
  { valeur: 'Pageot', label: 'باجو / Pageot', emoji: '🐠' },
  { valeur: 'Merlan', label: 'ميرلا / Merlan', emoji: '🐟' },
  { valeur: 'Thon', label: 'طون / Thon', emoji: '🐠' },
  { valeur: 'Crevette', label: 'قيمرون / Crevette', emoji: '🦐' },
  { valeur: 'Mérou', label: 'ميرو / Mérou', emoji: '🐡' },
  { valeur: 'Homard', label: 'همر / Homard', emoji: '🦞' },
  { valeur: 'Capitaine', label: 'كابيتان / Capitaine', emoji: '🐟' },
  { valeur: 'Dorade', label: 'دوراد / Dorade', emoji: '🐠' },
  { valeur: 'Calamar', label: 'كلامار / Calamar', emoji: '🦑' },
  { valeur: 'Poulpe', label: 'روكاي / Poulpe', emoji: '🐙' },
  { valeur: 'Espadon', label: 'بوسيف / Espadon', emoji: '🗡️' },
  { valeur: 'Loup', label: 'درعي / Loup', emoji: '🐟' },
  { valeur: 'Sole', label: 'صول / Sole', emoji: '🐠' },
  { valeur: 'Saumon', label: 'سومو / Saumon', emoji: '🍣' },
  { valeur: 'Bar', label: 'درعي / Bar', emoji: '🐟' },
  { valeur: 'Saint-Pierre', label: 'سان پير / St-Pierre', emoji: '🐠' },
  { valeur: 'Turbot', label: 'موسى / Turbot', emoji: '🐟' },
  { valeur: 'Huitres', label: 'محار / Huîtres', emoji: '🦪' },
  { valeur: 'Crevette Royale', label: 'قيمرون ملكي / Crevette Royale', emoji: '🦐' },
  { valeur: 'Lotte', label: 'بوزروك / Lotte', emoji: '🐟' },
  { valeur: 'Araignée', label: 'عنكبوت البحر / Araignée de mer', emoji: '🦀' }
];
  


// ── Fonctions ────────────────────────────────────────────────
const chargerProduits = () => {
  const p = {}

  if (filtres.value.search?.trim()) {
    p.search = filtres.value.search
  }

  if (filtres.value.city && filtres.value.city !== "ALL") {
    p.city = filtres.value.city
  }

  if (filtres.value.category) {
    p.category = filtres.value.category
  }

  p.page  = filtres.value.page || 1
  p.limit = filtres.value.limit || 10

  store.chargerProduits(p)
}
const detectCity = async () => {
  try {
    const res = await fetch("/api/detect-city");
    const data = await res.json();

    filtres.value.city = data.city || "ALL";

  } catch (e) {
    filtres.value.city = "ALL";
  }
};

const filtrerCategorie = (cat) => {
  filtres.value.category = cat
  filtres.value.page = 1
  chargerProduits()
}

// Sélection ville — PAS de GPS, filtre simple
// const onVilleSelect = () => {
//   filtres.value.page = 1
//   chargerProduits()
// }

const changerPage = (page) => {
  filtres.value.page = page
  chargerProduits()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toutReset = () => {
  filtres.value = { search:'', city:'', category:'', page:1, limit:12 }
  chargerProduits()
}

let timer = null
const rechercherAvecDelai = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    filtres.value.page = 1
    chargerProduits()
  }, 450)
}

onMounted(async () => {
  await detectCity();   // set city
  chargerProduits();    // utilise city
});
   store.visitors = '12K'
store.sellers = '250'
store.orders = '890'
store.revenue = '2.5M+'
</script>

<style scoped>
/* ══ TOKENS ══════════════════════════════════════════════ */
:root {
  --ocean:  #020e23;
  --gold:   #d4af37;
  --gold-l: #f5d57a;
  --navy:   #1e3a5f;
}

/* ══ SHELL ═══════════════════════════════════════════════ */
.mp { min-height: 100vh; background: #050396fb; font-family: 'Segoe UI', system-ui, sans-serif; }

/* ══ HERO ════════════════════════════════════════════════ */
.hero {
  position: relative; min-height: 580px;
  overflow: hidden; background: #020e23;
  display: flex; flex-direction: column;
}

.hero-bg        { position: absolute; inset: 0; z-index: 0; }
.hero-photo     { width: 100%; height: 100%; object-fit: cover; min-height: 580px; }
.hero-overlay {
  position: absolute; 
  inset: 0;
  /* Dégradé plus "frais" : 
     Le haut est presque transparent pour voir le ciel/port,
     Le bas s'assombrit pour faire ressortir tes métriques blanches. */
  background: linear-gradient(
    165deg,
    rgba(6, 44, 170, 0.15) 0%,   /* Reflet de surface */
    rgba(1, 70, 107, 0.822) 40%,    /* Teinte eau claire */
    rgba(2, 62, 138, 0.6) 80%,     /* Profondeur pour le texte */
    rgba(2, 14, 35, 0.85) 100%     /* Base solide pour la transition section suivante */
  );
  backdrop-filter: saturate(1.2); /* Booste les couleurs de ta photo en dessous */
}
.hero-shimmer {
  position: absolute; 
  bottom: 0; 
  left: 0; 
  right: 0; 
  height: 180px;
  /* Effet "Vague de lumière" : un bleu turquoise très léger qui remonte */
  background: linear-gradient(
    to top, 
    rgba(0, 180, 216, 0.2) 0%, 
    rgba(144, 224, 239, 0.05) 50%, 
    transparent 100%
  );
  pointer-events: none;
}

/* Vagues */
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

/* Contenu hero */
.hero-body {
  position: relative; z-index: 2; flex: 1;
  max-width: 860px; margin: 0 auto; width: 100%;
  padding: 60px 24px 36px;
  display: flex; flex-direction: column; align-items: center; gap: 28px;
}

/* Badge live */
.live-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,180,216,.08); border: 1px solid rgba(0,180,216,.2);
  color: #7dd3f0; font-size: .75rem; font-weight: 600; letter-spacing: .06em;
  padding: 6px 18px; border-radius: 99px;
}
.live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: livepulse 1.8s ease-in-out infinite;
}
@keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }

/* Titre */
.hero-title-wrap { text-align: center; }
.hero-eyebrow {
  color: rgba(245, 229, 7, 0.795); font-size: .8rem; letter-spacing: .25em;
  text-transform: uppercase; margin-bottom: 12px;
}
.hero-h1 {
  font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900;
  color: white; line-height: 1.1; margin-bottom: 12px;
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
    font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900;
  color: rgba(3, 247, 15, 0.38); font-size: .70rem; font-style: italic;
}

/* ── Barre de recherche ── */
.search-grid {
  width: 100%; 
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px; /* upgradé à gap-6 */
}
.search_wrap   .searchbar { /* plus utilisé */
  flex: 1; min-width: 280px;
}
.search_wrap .searchbar {
 flex: 1; min-width: 280px;
}

.searchbar {
  width: 100%;
  display: flex; align-items: center;  gap: 2px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.15);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-radius: 18px; padding: 6px;
  box-shadow: 0 12px 40px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.08);
}
.sb-input-wrap {
  flex: 1; min-width: 160px; position: relative;
  display: flex; align-items: center;
}
.sb-icon   { position: absolute; left: 13px; font-size: .9rem; pointer-events: none; }
.sb-input  {
  width: 100%; background: transparent; border: none; outline: none;
  color: white; font-size: .9rem; padding: 11px 14px 11px 38px;
}
.sb-input::placeholder { color: rgba(147,197,253,.45); }
.sb-divider { width:1px; height:26px; background:rgba(255,255,255,.1); flex-shrink:0; }
.sb-select {
  background: transparent; border: none; outline: none;
  color: rgba(255,255,255,.75); font-size: .85rem;
  padding: 11px 16px; cursor: pointer; min-width: 100px;
}
.sb-select option { background: #1e3a5f; color: white; }
.sb-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #1a0e00; font-weight: 800; font-size: .70rem;
  padding: 11px 15px; border-radius: 12px; border: none;
  cursor: pointer; transition: all .2s; white-space: nowrap; 
  box-shadow: 0 4px 16px rgba(245,158,11,.4);
  letter-spacing: .03em;
}
.sb-btn:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(245,158,11,.55); }
.sb-detect {
  background: linear-gradient(135deg, #0b97f5, #1022c2);
  color: #1a0e00; font-weight: 800; font-size: .85rem;
  padding: 11px 18px; border-radius: 12px; border: none;
  cursor: pointer; transition: all .2s; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(245,158,11,.4);
  letter-spacing: .03em;
}
.sb-detect:hover { transform:translateY(-1px); box-shadow:0 6px 22px rgba(245,158,11,.55); }
/* Métriques */
.hero-metrics {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 6px 36px; margin-top: -4px;
}
.metric { display:flex; flex-direction:column; align-items:center; gap:3px; }
.metric-val {
  color: white; font-size: 1.6rem; font-weight: 900; line-height: 1;
  font-variant-numeric: tabular-nums;
}
.metric-val.gold  { color: #fbbf24; }
.metric-val.green { color: #34d399; }
.metric-lbl { color:rgba(247, 244, 244, 0.877); font-size:.62rem; text-transform:uppercase; letter-spacing:.1em; }
.metric-sep { width:1px; background:rgba(255,255,255,.1); align-self:stretch; }

/* Scroll hint */
.scroll-hint {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding-bottom: 22px; color: rgba(255,255,255,.2); font-size: .7rem;
}
.scroll-hint svg { animation: scrollbounce 1.8s ease-in-out infinite; }
@keyframes scrollbounce { 0%,100%{transform:translateY(0)} 55%{transform:translateY(6px)} }

/* ══ TOOLBAR ══════════════════════════════════════════════ */
.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 10px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 28px;
  position: sticky; top: 0; z-index: 20;
  box-shadow: 0 2px 12px rgba(0,0,0,.07);
}

.cats-row { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }

.chip {
  padding: 6px 15px; border-radius: 99px; font-size: .8rem; font-weight: 600;
  border: 1.5px solid #e5e7eb; background: white; color: #6b7280;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
.chip:hover { border-color: #93c5fd; color: #1e40af; background: #eff6ff; }
.chip-on {
  background: #1e3a5f !important; color: white !important;
  border-color: #1e3a5f !important;
  box-shadow: 0 2px 8px rgba(30,58,95,.3);
}

.toolbar-right { display:flex; align-items:center; gap:14px; }
.count-txt { font-size:.8rem; color:#9ca3af; white-space:nowrap; }
.count-txt strong { color:#1e3a5f; font-weight:700; }

/* Toggle vue */
.vue-btns {
  display: flex; background: #f3f4f6; border-radius: 10px; padding: 3px; gap: 2px;
  border: 1px solid #e5e7eb;
}
.vb {
  width: 30px; height: 30px; border-radius: 7px; border: none;
  background: transparent; color: #9ca3af;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .15s;
}
.vb svg { width:14px; height:14px; }
.vb:hover { background: white; color: #374151; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
.vb-on {
  background: #1e3a5f !important; color: white !important;
  box-shadow: 0 2px 6px rgba(30,58,95,.35) !important;
}

/* Filtres actifs */
.active-filters {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  padding: 8px 28px;
  background: linear-gradient(90deg, #eff6ff, #f0f9ff);
  border-bottom: 1px solid #bfdbfe;
}
.af-pill {
  display: inline-flex; align-items: center; gap: 5px;
  background: white; border: 1.5px solid #93c5fd;
  color: #1e40af; font-size: .78rem; font-weight: 600;
  padding: 4px 12px; border-radius: 99px;
  box-shadow: 0 1px 4px rgba(59,130,246,.1);
}
.af-pill button {
  background: none; border: none; cursor: pointer;
  color: #93c5fd; font-size: .9rem; padding: 0; line-height: 1;
  margin-left: 2px;
}
.af-pill button:hover { color: #ef4444; }
.af-reset {
  margin-left: auto; background: none; border: none;
  cursor: pointer; color: #9ca3af; font-size: .75rem; text-decoration: underline;
}
.af-reset:hover { color: #374151; }

/* ══ GRILLE PRODUITS ══════════════════════════════════════ */
.produits-zone {
  max-width: 1280px; margin: 0 auto; padding: 28px 24px 72px;
}

/* États */
.etat {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; padding:90px 20px; text-align:center;
}
.fish-bounce { font-size:3.2rem; animation:fishsw 1.3s ease-in-out infinite; }
@keyframes fishsw {
  0%,100%{transform:translateX(0) rotate(0)}
  30%{transform:translateX(10px) rotate(6deg)}
  70%{transform:translateX(-10px) rotate(-6deg)}
}
.etat-ico  { font-size:3rem; margin-bottom:12px; }
.etat-txt  { color:#9ca3af; font-size:.9rem; margin-top:10px; }
.etat-err  { color:#ef4444; font-weight:600; margin-bottom:10px; }
.etat-vide { color:#6b7280; font-weight:600; }
.etat-sous { color:#9ca3af; font-size:.85rem; margin-top:4px; }

.btn-action {
  padding:8px 22px; border-radius:99px;
  background:#1e3a5f; color:white; border:none;
  font-weight:700; font-size:.85rem; cursor:pointer;
  transition:all .2s; box-shadow:0 3px 10px rgba(30,58,95,.3);
}
.btn-action:hover { background:#1d4ed8; transform:translateY(-1px); }
.mt-3 { margin-top:12px; }

/* Pagination */
.pagination {
  display:flex; justify-content:center; gap:6px;
  margin-top:48px; flex-wrap:wrap;
}
.pg-btn {
  padding:8px 16px; border-radius:10px;
  border:1.5px solid #e5e7eb; background:white;
  color:#374151; font-weight:600; font-size:.85rem;
  cursor:pointer; transition:all .15s;
}
.pg-btn:hover:not(:disabled) { border-color:#93c5fd; color:#1e40af; background:#eff6ff; }
.pg-btn:disabled { opacity:.3; cursor:not-allowed; }
.pg-on {
  background:#1e3a5f !important; color:white !important;
  border-color:#1e3a5f !important;
  box-shadow:0 3px 10px rgba(30,58,95,.3);
}

/* ══ RESPONSIVE ═══════════════════════════════════════════ */
@media (max-width:768px) {
  .hero-body    { padding:44px 16px 28px; gap:20px; }
  .hero-h1      { font-size:2.4rem; }
  .metric-sep   { display:none; }
  .toolbar      { padding:8px 14px; position:relative; }
  .toolbar-right { width:100%; justify-content:space-between; }
  .cats-row     { order:2; width:100%; }
  .produits-zone { padding:16px 14px 56px; }
  .searchbar    { border-radius:13px; }
}
/* ── Unified Layout & Traditional Texture ──────────────────── */

/* The main outer background: Deep, Traditional blue */
.main-homepage-wrapper {
  background-color: #0a0a0ae0; /* Base color of image_0.png */
}

/* This container applies the 'default.png' pattern to everything else */
.textured-content-area {
  position: relative;
  /* ── Traditional Moroccan Zellige Texture (Your default.png) ── */
  background-image: url('/path/to/default.png');
  background-repeat: repeat;
  background-size: 200px 200px; /* Adjust scale based on your default.png */
  background-attachment: fixed; /* Parallax effect for elegance */
  background-blend-mode: soft-light; /* Makes texture blend nicely */
}

/* Adjusting other components so they work over the texture */
.textured-content-area :deep(section) {
  position: relative;
  z-index: 1;
}
</style>
