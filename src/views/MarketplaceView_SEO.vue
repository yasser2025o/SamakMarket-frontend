<!-- =============================================================
  views/MarketplaceView.vue — SamakMarket
  Design : Luxury Fish Market — dark ocean / gold accents
  GPS : UNIQUEMENT dans VendeursProches, pas dans les filtres
============================================================= -->
<template>
  <!-- //<div class="mp"> -->
    <NavBar />

    <!-- ═══════════════════════════════════════════════════
         HERO
    ═══════════════════════════════════════════════════ -->
    <section class="hero">
      <!-- Fond photo -->
      <div class="hero-bg">
        <img :src="heroPhoto" alt="Ville Maroc" class="hero-photo" loading="eager" />
        <!-- <img
          src="https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=1600&q=80&auto=format&fit=crop"
          alt="Océan Atlantique" class="hero-photo" loading="eager"
        /> -->
        <div class="hero-overlay"></div>
        <div class="hero-shimmer"></div>
      </div>

      <!-- Vagues -->
      <div class="waves" aria-hidden="true">
        <div class="w w1"></div>
        <div class="w w2"></div>
        <div class="w w3"></div>
      </div>

      <!-- Contenu -->
      <div class="hero-body">

        

        <!-- Titre -->
        <div class="hero-title-wrap">
          <!-- <p class="hero-accent">0% Commission, 100% Poisson Fret</p> -->
          <h1 class="hero-h1">
            <!--  -->
            <span class="hero-accent">Direct du Port</span>
          </h1>
          <p v-if="filtres.city !== 'ALL'">
  📍 Ville détectée : {{ filtres.city }}
</p>
          <p class="hero-tagline">
            Contactez les pêcheurs directement 
          </p>
          <br>
          <br>
          
<!-- Badge live -->
        <div class="live-badge">
          <span class="live-dot"></span>
          Marché en direct · Maroc
        </div>
        </div>

        <!-- Barre de recherche -->
        <div class="searchbar">
          <div class="sb-input-wrap">
            <span class="sb-icon">🔍</span>
            <input
              v-model="filtres.search"
              @input="rechercherAvecDelai"
              placeholder="Sardine, thon, crevettes..."
              class="sb-input"
            />
          </div>

          <div class="sb-divider"></div>

          <!-- <select v-model="filtres.city" @change="onVilleSelect" class="sb-select">
            <option value="ALL">📍 Toutes les villes</option>
            <option value="Tanger">🌊 Tanger</option>
            <option value="Casablanca">🏙️ Casablanca</option>
            <option value="Agadir">🏖️ Agadir</option>
            <option value="Rabat">🏛️ Rabat</option>
            <option value="Dakhla">🏜️ Dakhla</option>
            <option value="Safi">⚓ Safi</option>
            <option value="Nador">🐟 Nador</option>
          </select>
<div class="sb-divider"></div> -->
<!-- //<span class="metric-lbl">Frais du jour</span> -->
          <button @click="chargerProduits" class="sb-btn">
            Chercher
          </button>
          <div class="sb-divider"></div>
          <!-- <button @click="chargerProduits" class="sb-btn">
            Chercher
          </button> -->
        </div>
        <!-- Barre de ville et detecter boutton -->
        <div class="searchbar">
          <div class="sb-input-wrap">
            <span class="sb-icon"> 📡 </span>
            <!-- <input
              v-model="filtres.search"
              @input="rechercherAvecDelai"
              placeholder="Sardine, thon, crevettes..."
              class="sb-input"
            /> -->
            <select v-model="filtres.city" @change="onVilleSelect" class="sb-select">
            <option value="ALL">📍 Toutes les villes  </option>
            <option value="Tanger">🌊 Tanger</option>
            <option value="Casablanca">🏙️ Casablanca</option>
            <option value="Agadir">🏖️ Agadir</option>
            <option value="Rabat">🏛️ Rabat</option>
            <option value="Dakhla">🏜️ Dakhla</option>
            <option value="Safi">⚓ Safi</option>
            <option value="Nador">🐟 Nador</option>
          </select>
          </div>

          <div class="sb-divider"></div>

          
<div class="sb-divider"></div>
<!-- //<span class="metric-lbl">Frais du jour</span> -->
          <button @click="chargerProduits" class="sb-detect">
            Chercher
          </button>
          <div class="sb-divider"></div>
          <!-- <button @click="chargerProduits" class="sb-btn">
            Chercher
          </button> -->
        </div>

        <!-- Métriques -->
        <div class="hero-metrics">
          
          <div class="metric-sep"></div>
          <div class="metric">
            <span class="metric-val green">100%</span>
            <span class="metric-lbl">Frais du jour</span>
          </div>
          
          <div class="metric-sep"></div>
          <div class="metric">
            <span class="metric-val gold">Zéro</span>
            <span class="metric-lbl">Commission</span>
          </div>
         
          <div class="metric">
            <span class="metric-val">+{{ store.pagination.total || '—' }}</span>
            <span class="metric-lbl">Poissons</span>
          </div>
          
          <div class="metric-sep"></div>
          <div class="metric">
            <span class="metric-val green">Direct</span>
            <span class="metric-lbl">Whatsapp</span>
          </div>
        </div>

      </div>

      <!-- Scroll hint -->
      <div class="scroll-hint" aria-hidden="true">
        <span>Découvrir les offres</span>
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
          <path d="M7 1v16M7 17L1 11M7 17l6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════
         PROMOS DÉFILANTES
    ═══════════════════════════════════════════════════ -->
    <!-- <ProductPromo /> -->
     <VagueduJour /> 
    <!-- ═══════════════════════════════════════════════════
         VENDEURS PROCHES — GPS ici seulement
    ═══════════════════════════════════════════════════ -->
    <VendeursProches />

    <!-- ═══════════════════════════════════════════════════
         TOOLBAR — CATÉGORIES + TOGGLE VUE
    ═══════════════════════════════════════════════════ -->
    <div class="toolbar">

      <!-- Chips catégories -->
      <div class="cats-row">
        <button
          @click="filtrerCategorie('')"
          :class="['chip', filtres.category === '' && 'chip-on']"
        >
          🐟 Tout
        </button>
        <button
          v-for="cat in categories" :key="cat.valeur"
          @click="filtrerCategorie(cat.valeur)"
          :class="['chip', filtres.category === cat.valeur && 'chip-on']"
        >
          {{ cat.emoji }} {{ cat.label }}
        </button>
      </div>

      <!-- Droite : compteur + toggle vue -->
      <div class="toolbar-right">
        <span class="count-txt">
          <strong>{{ store.pagination.total }}</strong> produits
        </span>

        <div class="vue-btns">
          <!-- Liste -->
          <button @click="vue='liste'" :class="['vb', vue==='liste'&&'vb-on']" title="Liste">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="2" y1="5"  x2="18" y2="5"/>
              <line x1="2" y1="10" x2="18" y2="10"/>
              <line x1="2" y1="15" x2="18" y2="15"/>
            </svg>
          </button>
          <!-- 2 colonnes -->
          <button @click="vue='2'" :class="['vb', vue==='2'&&'vb-on']" title="2 colonnes">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <rect x="1" y="1" width="8" height="18" rx="2"/>
              <rect x="11" y="1" width="8" height="18" rx="2"/>
            </svg>
          </button>
          <!-- 3 colonnes -->
          <button @click="vue='3'" :class="['vb', vue==='3'&&'vb-on']" title="3 colonnes">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <rect x="1"   y="1" width="5" height="18" rx="1.5"/>
              <rect x="7.5" y="1" width="5" height="18" rx="1.5"/>
              <rect x="14"  y="1" width="5" height="18" rx="1.5"/>
            </svg>
          </button>
          <!-- 4 colonnes -->
          <button @click="vue='4'" :class="['vb', vue==='4'&&'vb-on']" title="4 colonnes">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <rect x="1"    y="1" width="3.5" height="18" rx="1"/>
              <rect x="5.5"  y="1" width="3.5" height="18" rx="1"/>
              <rect x="10"   y="1" width="3.5" height="18" rx="1"/>
              <rect x="14.5" y="1" width="3.5" height="18" rx="1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Pills filtres actifs -->
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
      <button class="af-reset" @click="toutReset">Tout effacer</button>
    </div>

    <!-- ═══════════════════════════════════════════════════
         GRILLE PRODUITS
    ═══════════════════════════════════════════════════ -->
    <main class="produits-zone">

      <!-- Chargement -->
      <div v-if="store.chargement" class="etat">
        <div class="fish-bounce">🐟</div>
        <p class="etat-txt">Chargement des produits...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="store.erreur" class="etat">
        <div class="etat-ico">😕</div>
        <p class="etat-err">{{ store.erreur }}</p>
        <button @click="chargerProduits" class="btn-action">Réessayer</button>
      </div>

      <!-- Vide -->
      <div v-else-if="store.produits.length === 0" class="etat">
        <div class="etat-ico">🔍</div>
        <p class="etat-vide">Aucun produit trouvé</p>
        <p class="etat-sous">Essayez d'autres filtres</p>
        <button @click="toutReset" class="btn-action mt-3">Effacer les filtres</button>
      </div>

      <!-- Grille -->
      <div v-else :class="grilleClass">
        <ProductCard
          v-for="produit in store.produits"
          :key="produit.id"
          :produit="produit"
          :vue-liste="vue === 'liste'"
        />
      </div>

      <!-- Pagination -->
      <div v-if="store.pagination.pages > 1" class="pagination">
        <button
          @click="changerPage(store.pagination.page - 1)"
          :disabled="store.pagination.page === 1"
          class="pg-btn"
        >← Précédent</button>

        <button
          v-for="p in store.pagination.pages" :key="p"
          @click="changerPage(p)"
          :class="['pg-btn', p === store.pagination.page && 'pg-on']"
        >{{ p }}</button>

        <button
          @click="changerPage(store.pagination.page + 1)"
          :disabled="store.pagination.page === store.pagination.pages"
          class="pg-btn"
        >Suivant →</button>
      </div>
    </main>
    <FooterSamak />
  <!-- </div> -->
  <ChatBot />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductStore }   from '../stores/products'
// Importations des composants (inchangées pour tes autres sections)
import NavBar          from '../components/NavBar.vue'
import ProductCard     from '../components/ProductCard.vue'
import ProductPromo    from '../components/ProductPromo.vue'
import VendeursProches from '../components/VendeursProches!.vue'
import FooterSamak     from '../components/FooterSamak.vue'
import ChatBot         from '../components/ChatBot.vue'
import VagueduJour      from '../components/VagueduJour.vue'

const store = useProductStore()

// ── Gestion des Images Hero ──────────────────────────────────────────
// Note : J'ai corrigé le chemin './Public' en '/images' car en Vue/Vite, 
// le dossier public est servi à la racine.
const photosVilles = {
  'DEFAULT':    '/images/villes/Default.jpg',
  'Tanger':     '/images/villes/tanger.jpg',
  'Casablanca': '/images/villes/casablanca.jpg',
  'Agadir':     '/images/villes/agadir.jpg',
  'Rabat':      '/images/villes/rabat.jpg',
  'Dakhla':     '/images/villes/dakhla.jpg',
  'Safi':       '/images/villes/safi.jpg',
  'Nador':      '/images/villes/nador.jpg',
}

const heroPhoto = ref(photosVilles['DEFAULT'])

// ── Filtres & État ─────────────────────────────────────────────────
const filtres = ref({ 
  search: '', 
  city: 'ALL', 
  category: '', 
  page: 1, 
  limit: 12 
})

// ── Logique de Sélection de Ville ─────────────────────────────────────
const onVilleSelect = () => {
  // Met à jour l'image du Hero dynamiquement
  heroPhoto.value = photosVilles[filtres.value.city] || photosVilles['DEFAULT']
  
  // Reset la pagination et charge les produits
  filtres.value.page = 1
  chargerProduits()
}

// ── Chargement des Produits (Logique Clean) ──────────────────────────
const chargerProduits = () => {
  const p = {
    page: filtres.value.page || 1,
    limit: filtres.value.limit || 12
  }

  if (filtres.value.search?.trim()) p.search = filtres.value.search
  if (filtres.value.city && filtres.value.city !== "ALL") p.city = filtres.value.city
  if (filtres.value.category) p.category = filtres.value.category

  store.chargerProduits(p)
}

// ── Détection de Ville (SEO & UX) ────────────────────────────────────
const detectCity = async () => {
  try {
    const res = await fetch("/api/detect-city")
    if (!res.ok) throw new Error()
    const data = await res.json()
    
    if (data.city) {
      filtres.value.city = data.city
      heroPhoto.value = photosVilles[data.city] || photosVilles['DEFAULT']
    }
  } catch (e) {
    filtres.value.city = "ALL"
    heroPhoto.value = photosVilles['DEFAULT']
  }
}

// ── Recherche avec Délai (Debounce) ──────────────────────────────────
let timer = null
const rechercherAvecDelai = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    filtres.value.page = 1
    chargerProduits()
  }, 450)
}

// ── Gestion de la Grille (Pour tes autres sections) ──────────────────
const vue = ref('3')
const grilleClass = computed(() => ({
  liste: 'flex flex-col gap-3',
  '2':   'grid grid-cols-1 sm:grid-cols-2 gap-5',
  '3':   'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5',
  '4':   'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
}[vue.value]))

// ── Autres Fonctions ────────────────────────────────────────────────
const filtrerCategorie = (cat) => {
  filtres.value.category = cat
  filtres.value.page = 1
  chargerProduits()
}

const changerPage = (page) => {
  filtres.value.page = page
  chargerProduits()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toutReset = () => {
  filtres.value = { search:'', city:'ALL', category:'', page:1, limit:12 }
  heroPhoto.value = photosVilles['DEFAULT']
  chargerProduits()
}

// ── Lifecycle ──────────────────────────────────────────────────────
onMounted(async () => {
  await detectCity() // Détecte la ville d'abord
  chargerProduits()  // Charge les produits selon la ville détectée
})
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

/* ══ HERO REVISITÉ : FRAÎCHEUR & SEO ════════════════════════════════ */
.hero {
  position: relative; 
  min-height: 100vh; /* Prend toute la hauteur pour l'impact */
  overflow: hidden; 
  background: #f0f9ff; /* Fond clair de secours */
  display: flex; 
  flex-direction: column;
}

.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-photo { 
  width: 100%; height: 100%; object-fit: cover; 
  filter: brightness(0.95) saturate(1.1); /* Rend les couleurs du port plus vives */
}

/* Overlay Lumineux (Vitre givrée) */
.hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(230, 245, 255, 0.2) 40%,
    rgba(2, 43, 89, 0.75) 100% /* Garde du contraste pour le texte du bas */
  );
}

/* Vagues Modernes (Plus visibles et bleutées) */
.waves { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.w {
  position: absolute; left: -100%; width: 300%; height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, rgba(0, 180, 216, 0.4), rgba(255, 255, 255, 0.6), rgba(0, 180, 216, 0.4), transparent);
  animation: wdrift 12s ease-in-out infinite;
}
.w1 { top: 30%; opacity:.3; animation-duration:8s; }
.w2 { top: 45%; opacity:.2; animation-duration:12s; animation-delay:2s; }
.w3 { top: 60%; opacity:.15; animation-duration:15s; }

/* Contenu Hero */
.hero-body {
  position: relative; z-index: 2; flex: 1;
  max-width: 900px; margin: 0 auto; width: 100%;
  padding: 80px 24px 40px;
  display: flex; flex-direction: column; align-items: center; gap: 32px;
}

/* Badge Live - Style Flottant */
.live-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: white; 
  border: 1.5px solid #00b4d8;
  color: #0077b6; 
  font-size: .85rem; font-weight: 700;
  padding: 8px 22px; border-radius: 99px;
  box-shadow: 0 4px 15px rgba(0, 180, 216, 0.2);
}
.live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
  animation: livepulse 2s ease-in-out infinite;
}

/* Titre & Typo */
.hero-title-wrap { text-align: center; }
.hero-h1 {
  font-size: clamp(2.8rem, 8vw, 4.5rem); font-weight: 900;
  color: #023e8a; /* Bleu marine profond pour le SEO et la clarté */
  line-height: 1.05; margin-bottom: 10px;
  text-shadow: 0 2px 15px rgba(255, 255, 255, 0.5);
}
.hero-accent {
  background: linear-gradient(90deg, #ff6b35, #f7b731, #ff6b35); /* Dégradé Corail/Soleil */
  background-size: 200% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: goldShift 4s linear infinite;
}

.hero-tagline {
  font-size: 1.2rem; font-weight: 600;
  color: #0077b6; /* Bleu océan */
  letter-spacing: 0.5px;
}

/* ── Barre de recherche "Ultra-White" ── */
.searchbar {
  width: 100%; max-width: 720px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid white;
  backdrop-filter: blur(15px);
  border-radius: 20px; padding: 10px;
  box-shadow: 0 15px 45px rgba(0, 31, 63, 0.15);
}
.sb-input {
  color: #1e3a5f; font-weight: 500;
}
.sb-input::placeholder { color: #94a3b8; }
.sb-divider { background: rgba(0, 119, 182, 0.15); }

.sb-select {
  color: #0077b6; font-weight: 600;
}
.sb-select option { background: white; color: #023e8a; }

/* Boutons - Le Corail pour l'action */
.sb-btn {
  background: linear-gradient(135deg, #ff6f61, #ee5253);
  color: white; font-weight: 700;
  box-shadow: 0 6px 20px rgba(238, 82, 83, 0.3);
}
.sb-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(238, 82, 83, 0.4); }

.sb-detect {
  background: linear-gradient(135deg, #00b4d8, #0077b6);
  color: white; box-shadow: 0 6px 20px rgba(0, 180, 216, 0.3);
}

/* Métriques du bas (Sur l'overlay sombre du bas) */
.hero-metrics {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  padding: 20px 40px; border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.metric-val { color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.metric-val.green { color: #4ade80; }
.metric-val.gold { color: #facc15; }
.metric-lbl { color: rgba(255, 255, 255, 0.9); font-weight: 600; }

/* Scroll hint */
.scroll-hint {
  color: white; font-weight: 700;
  text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
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
</style>
