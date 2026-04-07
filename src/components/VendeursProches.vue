<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  components/VendeursProches.vue — SamakMarket                ║
  ║                                                              ║
  ║  DESIGN: "Radar de pêche" — dark ocean luxury nautique       ║
  ║  Différenciation concurrents:                                ║
  ║    → Radar animé SVG pendant la localisation                 ║
  ║    → Cards horizontales avec "score fraîcheur" pêcheur       ║
  ║    → Expand vendeur → produits inline + ATP_BTN              ║
  ║    → Ping distance animé                                     ║
  ║    → Statut "En ligne" simulé selon dernière activité        ║
  ╚══════════════════════════════════════════════════════════════╝
-->
<template>
  <section class="vp" aria-label="Vendeurs proches de vous">

    <!-- ══ IDLE — Invite localisation ══════════════════════ -->
    <div v-if="etat === 'idle'" class="vp-invite">
      <div class="invite-content">
        <!-- Icône sonar décorative -->
        <div class="invite-sonar" aria-hidden="true">
          <div class="sonar-ring r1"></div>
          <div class="sonar-ring r2"></div>
          <div class="sonar-ring r3"></div>
          <span class="sonar-ico">📍</span>
        </div>
        <div class="invite-txt">
          <h3 class="invite-titre">Vendeurs près de vous / بائع قريب او سمك جديد </h3>
          <p class="invite-sous">Les pêcheurs de votre quartier ont du poisson frais ce matin 🌅</p>
        </div>
        <button @click="localiser" class="btn-radar" aria-label="Activer la localisation">
          <span class="btn-radar-ico" aria-hidden="true">📡</span>
          Activer le radar
        </button>
      </div>
    </div>

    <!-- ══ GPS — Radar animé ════════════════════════════════ -->
    <div v-else-if="etat === 'gps' || etat === 'api'" class="vp-radar-wrap" aria-live="polite" aria-label="Recherche en cours">
      <div class="radar-container" aria-hidden="true">
        <!-- Cercles concentriques radar -->
        <svg class="radar-svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(13,202,240,.08)" stroke-width="1"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(13,202,240,.1)" stroke-width="1"/>
          <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(13,202,240,.15)" stroke-width="1"/>
          <!-- Croix centrale -->
          <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(13,202,240,.06)" stroke-width="1"/>
          <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(13,202,240,.06)" stroke-width="1"/>
          <!-- Sweep radar -->
          <path d="M100,100 L100,10 A90,90 0 0,1 190,100 Z" fill="url(#radarSweep)" class="radar-sweep"/>
          <defs>
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(13,202,240,0.3)"/>
              <stop offset="100%" stop-color="rgba(13,202,240,0)"/>
            </radialGradient>
          </defs>
          <!-- Points vendeurs simulés pendant le scan -->
          <circle cx="130" cy="60" r="3" fill="#0dcaf0" opacity=".6" class="radar-blip b1"/>
          <circle cx="75" cy="80" r="3" fill="#f5d57a" opacity=".5" class="radar-blip b2"/>
          <circle cx="150" cy="120" r="2" fill="#0dcaf0" opacity=".4" class="radar-blip b3"/>
        </svg>
        <div class="radar-center-ico">🐟</div>
      </div>
      <p class="radar-txt">
        {{ etat === 'gps' ? 'Détection de votre position...' : 'Scan des pêcheurs locaux...' }}
      </p>
    </div>

    <!-- ══ ERREUR ════════════════════════════════════════════ -->
    <div v-else-if="etat === 'erreur'" class="vp-erreur" role="alert">
      <span class="erreur-ico" aria-hidden="true">⚠️</span>
      <span class="erreur-msg">{{ erreurMsg }}</span>
      <button @click="etat = 'idle'" class="btn-retry">Réessayer</button>
    </div>

    <!-- ══ RÉSULTATS ════════════════════════════════════════ -->
    <template v-else-if="etat === 'ok'">

      <!-- Header résultats -->
      <div class="vp-header">
        <div class="vp-header-left">
          <!-- Ping animé -->
          <div class="ping-wrap" aria-hidden="true">
            <div class="ping-dot"></div>
            <div class="ping-ring"></div>
          </div>
          <div>
            <h2 class="vp-titre">{{ vendeurs.length }} pêcheur{{ vendeurs.length > 1 ? 's' : '' }} près de vous</h2>
            <p class="vp-sous">Triés par distance · Poisson frais ce matin</p>
          </div>
        </div>
        <button @click="etat = 'idle'" class="btn-reset" aria-label="Réinitialiser la recherche">
          ✕ Réinitialiser
        </button>
      </div>

      <!-- Liste vendeurs -->
      <div class="vp-liste" role="list">
        <article
          v-for="(v, idx) in vendeurs"
          :key="v.id"
          class="vp-card"
          :class="{ 'vp-card-open': vendeurOuvert === v.id }"
          :style="{ animationDelay: idx * 0.08 + 's' }"
          role="listitem"
          :aria-label="`${v.name}, ${formatDist(v.distance_km)} de vous`"
        >
          <!-- ── Ligne principale vendeur ── -->
          <div class="vp-card-main" @click="toggleVendeur(v.id)">

            <!-- Rang + distance -->
            <div class="vp-rang" aria-hidden="true">
              <span class="rang-num">{{ idx + 1 }}</span>
              <span class="rang-dist">{{ formatDist(v.distance_km) }}</span>
            </div>

            <!-- Avatar + statut en ligne -->
            <div class="vp-av-wrap">
              <div class="vp-av" aria-hidden="true">{{ v.name.charAt(0).toUpperCase() }}</div>
              <!-- Statut actif si vendeur a des produits récents -->
              <div
                class="vp-status"
                :class="v.nb_produits > 0 ? 'status-on' : 'status-off'"
                :aria-label="v.nb_produits > 0 ? 'Actif' : 'Inactif'"
              ></div>
            </div>

            <!-- Infos vendeur -->
            <div class="vp-info">
              <div class="vp-nom">{{ v.name }}</div>
              <div class="vp-ville">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ v.city }}
                <!-- Barre fraîcheur (humour: "score pêcheur") -->
                <span class="fraicheur-bar" :title="`Score fraîcheur: ${fraicheurScore(v)}/5`" aria-label="Score fraîcheur">
                  <span
                    v-for="i in 5" :key="i"
                    class="fraicheur-dot"
                    :class="{ 'f-on': i <= fraicheurScore(v) }"
                    aria-hidden="true"
                  ></span>
                </span>
              </div>
            </div>

            <!-- Stats rapides -->
            <div class="vp-stats" aria-label="Statistiques vendeur">
              <div class="vp-stat" v-if="v.nb_produits > 0">
                <span class="stat-val">{{ v.nb_produits }}</span>
                <span class="stat-lbl">articles</span>
              </div>
              <div class="vp-stat" v-if="v.nb_promos > 0">
                <span class="stat-val stat-gold">{{ v.nb_promos }}</span>
                <span class="stat-lbl">promos</span>
              </div>
              <div v-if="v.nb_produits === 0" class="vp-vide-label">
                Pas encore de produits
              </div>
            </div>

            <!-- Chevron expand -->
            <div
              class="vp-chevron"
              :class="{ 'chevron-open': vendeurOuvert === v.id }"
              aria-hidden="true"
            >›</div>

          </div>

          <!-- ── Panel expand: produits + ATP_BTN ── -->
          <Transition name="expand">
            <div v-if="vendeurOuvert === v.id" class="vp-produits-panel">

              <!-- Produits liste -->
              <div v-if="(v.produits || []).length > 0" class="prod-liste" role="list">
                <div
                  v-for="p in (v.produits || []).slice(0, 4)"
                  :key="p.id"
                  class="prod-item"
                  role="listitem"
                  :aria-label="`${p.name}, ${p.price} MAD par ${p.unit}`"
                >
                  <!-- Emoji catégorie -->
                  <span class="prod-emoji" aria-hidden="true">{{ emojiCat(p.category) }}</span>

                  <!-- Nom + prix -->
                  <div class="prod-info">
                    <span class="prod-nom">{{ p.name }}</span>
                    <span class="prod-prix">
                      {{ Number(p.price).toLocaleString('fr-FR') }}
                      <span class="prod-unite">MAD/{{ p.unit }}</span>
                    </span>
                  </div>

                  <!-- Badge promo -->
                  <span v-if="p.is_promo" class="prod-promo" aria-label="En promotion">🔥</span>

                  <!-- ATP_BTN par produit -->
                  <AddToCartBtn
                    :produit="{ ...p, seller: { name: v.name, whatsapp: v.whatsapp } }"
                    size="sm"
                    variant="icon"
                    @added="onAdded"
                  />
                </div>

                <!-- Plus d'articles -->
                <div v-if="(v.produits || []).length > 4" class="prod-plus">
                  +{{ (v.produits || []).length - 4 }} autre{{ (v.produits || []).length - 4 > 1 ? 's' : '' }} produits
                </div>
              </div>

              <!-- Aucun produit -->
              <div v-else class="prod-vide">
                <span aria-hidden="true">🌊</span>
                Ce pêcheur n'a pas encore ajouté ses produits
                <span class="prod-vide-sub">— Contactez-le directement !</span>
              </div>

              <!-- CTA row: WhatsApp + voir profil -->
              <div class="panel-cta">
                <a
                  :href="waLien(v)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn-wa-panel"
                  :aria-label="`Contacter ${v.name} sur WhatsApp`"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contacter {{ v.name.split(' ')[0] }}
                </a>

                <!-- OPTIONNEL: page publique vendeur (active quand dispo)
                <RouterLink :to="`/vendeur/${v.id}`" class="btn-profil-panel">
                  Voir profil →
                </RouterLink>
                -->

                <!-- ATP_BTN panier global vendeur (commande multiple) -->
                <AddToCartBtn
                  v-if="(v.produits || []).length > 0"
                  :produit="{ id: v.id, name: `Commande ${v.name}`, price: prixMoyen(v), unit: 'lot', seller: v }"
                  size="sm"
                  variant="outline"
                  label="Tout commander"
                  @added="onAdded"
                />
              </div>

            </div>
          </Transition>

        </article>
      </div>

      <!-- ══ INTOUCHABLE — Voir tous sur la carte ══════════ -->
      <div class="vp-voir-carte">
        <RouterLink to="/carte" class="btn-carte" aria-label="Voir tous les vendeurs sur la carte interactive">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/>
            <line x1="15" y1="6" x2="15" y2="21"/>
          </svg>
          Voir tous les vendeurs sur la carte
          <span class="btn-carte-badge" aria-hidden="true">🗺️</span>
        </RouterLink>
      </div>

    </template>

    <!-- Toast ajout panier -->
    <Transition name="toast-vp">
      <div v-if="toastVisible" class="vp-toast" role="status" aria-live="polite">
        ✅ {{ dernierAjoute?.name }} ajouté !
      </div>
    </Transition>

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import api          from '@/services/api'
import AddToCartBtn from './AddToCartBtn.vue'

/* ── State ──────────────────────────────────────────────────── */
const etat         = ref('idle')  // idle | gps | api | ok | erreur
const erreurMsg    = ref('')
const vendeurs     = ref([])
const vendeurOuvert = ref(null)
const toastVisible  = ref(false)
const dernierAjoute = ref(null)

/* ── Helpers ────────────────────────────────────────────────── */
const emojiCat = (cat) => ({
  Sardine:'🐟', sardine:'🐟', Thon:'🐠', Crevette:'🦐',
  Mérou:'🐡', Homard:'🦞', Calamar:'🦑', Dorade:'🐠',
  Poulpe:'🐙', Sole:'🐟', Capitaine:'🐟',
})[cat] || '🐟'

const formatDist = (km) => {
  if (!km && km !== 0) return ''
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

/* Score fraîcheur (1-5) basé sur nb_produits + nb_promos */
const fraicheurScore = (v) => {
  if (!v.nb_produits) return 0
  const score = Math.min(5, Math.ceil((v.nb_produits + v.nb_promos) / 2))
  return Math.max(1, score)
}

/* Prix moyen des produits d'un vendeur */
const prixMoyen = (v) => {
  const prods = v.produits || []
  if (!prods.length) return 0
  return Math.round(prods.reduce((s, p) => s + Number(p.price), 0) / prods.length)
}

/* Lien WhatsApp avec liste produits */
const waLien = (v) => {
  const num  = (v.whatsapp || v.phone || '212647689006').replace(/[\s\-\+\(\)]/g, '')
  const list = (v.produits || []).slice(0, 3).map(p => `• ${p.name} — ${p.price} MAD/${p.unit}`).join('\n')
  const msg  = encodeURIComponent(
    `سلام ${v.name.split(' ')[0]} ! 🐟\n` +
    `كنبغي نشري من عندك :\n${list || 'Vos produits disponibles'}\n` +
    `(SamakMarket — ${formatDist(v.distance_km)} de moi)`
  )
  return `https://wa.me/${num}?text=${msg}`
}

/* ── Toggle expand vendeur ──────────────────────────────────── */
const toggleVendeur = (id) => {
  vendeurOuvert.value = vendeurOuvert.value === id ? null : id
}

/* ── Toast ──────────────────────────────────────────────────── */
const onAdded = ({ produit }) => {
  dernierAjoute.value = produit
  toastVisible.value  = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

/* ── Localisation + API ─────────────────────────────────────── */
const localiser = () => {
  if (!navigator.geolocation) {
    erreurMsg.value = 'Géolocalisation non supportée par votre navigateur'
    etat.value = 'erreur'
    return
  }
  etat.value = 'gps'
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      etat.value = 'api'
      try {
        const { data } = await api.get('/vendeurs/proches', {
          params: { lat: pos.coords.latitude, lng: pos.coords.longitude, limit: 5}
        })
        vendeurs.value = data
        etat.value = vendeurs.value.length > 0 ? 'ok' : 'erreur'
        if (!vendeurs.value.length) erreurMsg.value = 'Aucun pêcheur géolocalisé dans votre zone'
      } catch {
        etat.value = 'erreur'
        erreurMsg.value = 'Impossible de charger les vendeurs proches'
      }
    },
    (err) => {
      etat.value = 'erreur'
      const msgs = { 1: 'Localisation refusée', 2: 'Position indisponible', 3: 'Délai dépassé — réessayez' }
      erreurMsg.value = msgs[err.code] || 'Erreur de localisation'
    },
    /* Timeout augmenté à 15s + basse précision d'abord pour mobile */
    { timeout: 15000, enableHighAccuracy: false, maximumAge: 60000 }
  )
}
</script>

<style scoped>
/* ══ Variables ═══════════════════════════════════════════════ */
.vp {
  --ocean:  #020e23;
  --surf:   #061428;
  --deep:   #040f20;
  --or:     #d4af37;
  --or2:    #f5d57a;
  --cyan:   #0dcaf0;
  --vert:   #25d366;
  background: var(--ocean);
  border-top:    1px solid rgba(255,255,255,.06);
  border-bottom: 1px solid rgba(255,255,255,.06);
  padding: 28px 20px;
  position: relative; overflow: hidden;
}

/* ══ IDLE — Sonar invite ════════════════════════════════════ */
.vp-invite { max-width: 860px; margin: 0 auto; }
.invite-content { display:flex; align-items:center; gap:20px; flex-wrap:wrap; }

/* Sonar animé */
.invite-sonar {
  position: relative; width: 64px; height: 64px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.sonar-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(13,202,240,.3);
  animation: sonar-expand 2.4s ease-out infinite;
}
.sonar-ring.r1 { width: 64px; height: 64px; animation-delay: 0s; }
.sonar-ring.r2 { width: 64px; height: 64px; animation-delay: .8s; }
.sonar-ring.r3 { width: 64px; height: 64px; animation-delay: 1.6s; }
@keyframes sonar-expand {
  0%   { transform: scale(.3); opacity: .8; }
  100% { transform: scale(2.5); opacity: 0; }
}
.sonar-ico { font-size: 1.6rem; position: relative; z-index: 1; }

.invite-txt { flex: 1; min-width: 180px; }
.invite-titre { color: white; font-weight: 800; font-size: 1rem; margin: 0 0 4px; }
.invite-sous  { color: rgba(255,255,255,.3); font-size: .78rem; margin: 0; }

.btn-radar {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 99px;
  background: linear-gradient(135deg, var(--or), var(--or2));
  color: #020e23; font-weight: 800; font-size: .85rem;
  border: none; cursor: pointer; transition: all .2s;
  box-shadow: 0 4px 16px rgba(212,175,55,.3); white-space: nowrap;
}
.btn-radar:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(212,175,55,.45); }
.btn-radar-ico { font-size: 1rem; }

/* ══ RADAR — Scan animé ═════════════════════════════════════ */
.vp-radar-wrap {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 20px 0;
}
.radar-container {
  position: relative; width: 140px; height: 140px;
  display: flex; align-items: center; justify-content: center;
}
.radar-svg { width: 100%; height: 100%; }
.radar-sweep { animation: radar-spin 2s linear infinite; transform-origin: 100px 100px; }
@keyframes radar-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Blips radar clignotants */
.radar-blip { animation: blip 2s ease-in-out infinite; }
.b1 { animation-delay: .3s; }
.b2 { animation-delay: 1.1s; }
.b3 { animation-delay: 1.7s; }
@keyframes blip { 0%,100%{opacity:0;} 40%,60%{opacity:1;} }

.radar-center-ico {
  position: absolute; font-size: 1.8rem;
  animation: center-pulse 2s ease-in-out infinite;
}
@keyframes center-pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.1);} }
.radar-txt { color: rgba(255,255,255,.35); font-size: .82rem; letter-spacing: .04em; }

/* ══ ERREUR ═════════════════════════════════════════════════ */
.vp-erreur { display:flex; align-items:center; justify-content:center; gap:12px; padding:20px; flex-wrap:wrap; }
.erreur-ico { font-size: 1.2rem; }
.erreur-msg { color: rgba(255,200,100,.7); font-size: .85rem; }
.btn-retry  { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.5); font-size:.78rem; padding:5px 14px; border-radius:99px; cursor:pointer; transition:all .2s; }
.btn-retry:hover { color:white; }

/* ══ RÉSULTATS ══════════════════════════════════════════════ */
.vp-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; flex-wrap: wrap; gap: 10px; max-width: 860px; margin-left: auto; margin-right: auto;
}
.vp-header-left { display:flex; align-items:center; gap:12px; }

/* Ping animé */
.ping-wrap { position:relative; width:16px; height:16px; flex-shrink:0; }
.ping-dot  { width:10px; height:10px; border-radius:50%; background:#4ade80; position:absolute; top:3px; left:3px; box-shadow:0 0 6px #4ade80; }
.ping-ring { width:16px; height:16px; border-radius:50%; border:1px solid #4ade80; position:absolute; top:0; left:0; animation:ping 1.5s ease-out infinite; }
@keyframes ping { 0%{transform:scale(.5);opacity:.8;} 100%{transform:scale(2);opacity:0;} }

.vp-titre { color:white; font-weight:800; font-size:1rem; margin:0; }
.vp-sous  { color:rgba(255,255,255,.3); font-size:.72rem; margin-top:2px; }
.btn-reset { background:none; border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.3); font-size:.75rem; padding:4px 10px; border-radius:99px; cursor:pointer; transition:all .2s; }
.btn-reset:hover { color:rgba(255,255,255,.6); }

/* ══ LISTE VENDEURS ═════════════════════════════════════════ */
.vp-liste { display:flex; flex-direction:column; gap:8px; max-width:860px; margin:0 auto 16px; }

/* Card vendeur */
.vp-card {
  background: rgba(6,20,40,.8);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px; overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
  animation: card-in .4s ease both;
}
@keyframes card-in { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
.vp-card:hover { border-color: rgba(13,202,240,.15); }
.vp-card-open  { border-color: rgba(13,202,240,.25) !important; box-shadow: 0 0 0 1px rgba(13,202,240,.08); }

/* Ligne principale cliquable */
.vp-card-main {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; cursor: pointer;
  transition: background .15s;
}
.vp-card-main:hover { background: rgba(255,255,255,.02); }

/* Rang + distance */
.vp-rang { display:flex; flex-direction:column; align-items:center; min-width:36px; flex-shrink:0; }
.rang-num  { color:rgba(255,255,255,.15); font-size:.65rem; font-weight:800; }
.rang-dist {
  color: var(--cyan); font-size: .72rem; font-weight: 800;
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  padding: 2px 6px; border-radius: 99px; margin-top: 3px; white-space: nowrap;
}

/* Avatar + statut */
.vp-av-wrap { position:relative; flex-shrink:0; }
.vp-av {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--or), var(--or2));
  color: #020e23; font-weight: 900; font-size: .9rem;
  display: flex; align-items: center; justify-content: center;
}
.vp-status { position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; border:2px solid var(--ocean); }
.status-on  { background: #4ade80; box-shadow: 0 0 5px #4ade80; }
.status-off { background: rgba(255,255,255,.2); }

/* Infos */
.vp-info { flex:1; min-width:0; }
.vp-nom  { color:white; font-size:.85rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.vp-ville { display:flex; align-items:center; gap:4px; color:rgba(255,255,255,.3); font-size:.68rem; margin-top:3px; flex-wrap:wrap; }

/* Barre fraîcheur */
.fraicheur-bar { display:inline-flex; gap:2px; margin-left:6px; }
.fraicheur-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.1); transition:background .2s; }
.fraicheur-dot.f-on { background: #f5d57a; }

/* Stats */
.vp-stats { display:flex; gap:8px; flex-shrink:0; }
.vp-stat  { display:flex; flex-direction:column; align-items:center; }
.stat-val { color:white; font-size:.85rem; font-weight:800; line-height:1; }
.stat-val.stat-gold { color:var(--or2); }
.stat-lbl { color:rgba(255,255,255,.25); font-size:.58rem; text-transform:uppercase; letter-spacing:.06em; }
.vp-vide-label { color:rgba(255,255,255,.15); font-size:.65rem; font-style:italic; }

/* Chevron */
.vp-chevron { color:rgba(255,255,255,.2); font-size:1.2rem; font-weight:300; transition:transform .25s; flex-shrink:0; }
.chevron-open { transform: rotate(90deg); color:var(--cyan); }

/* ══ PANEL PRODUITS (expand) ════════════════════════════════ */
.vp-produits-panel {
  border-top: 1px solid rgba(255,255,255,.06);
  padding: 12px 14px 14px;
  background: rgba(0,0,0,.2);
}

.prod-liste { display:flex; flex-direction:column; gap:4px; margin-bottom:10px; }
.prod-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 10px;
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.05);
  transition: background .15s;
}
.prod-item:hover { background: rgba(255,255,255,.06); }
.prod-emoji { font-size:.95rem; flex-shrink:0; }
.prod-info  { flex:1; min-width:0; display:flex; align-items:center; justify-content:space-between; gap:8px; }
.prod-nom   { color:white; font-size:.78rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.prod-prix  { color:var(--or2); font-size:.78rem; font-weight:800; white-space:nowrap; flex-shrink:0; }
.prod-unite { color:rgba(255,255,255,.3); font-weight:400; font-size:.65rem; }
.prod-promo { font-size:.8rem; flex-shrink:0; }
.prod-plus  { color:rgba(255,255,255,.2); font-size:.68rem; font-style:italic; padding: 4px 10px; }

.prod-vide { color:rgba(255,255,255,.2); font-size:.78rem; text-align:center; padding:12px 0; }
.prod-vide-sub { display:block; color:var(--cyan); font-size:.68rem; margin-top:4px; }

/* CTA panel */
.panel-cta { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.btn-wa-panel {
  flex:1; display:flex; align-items:center; justify-content:center; gap:6px;
  background:linear-gradient(135deg,#075e54,#25d366);
  color:white; text-decoration:none; font-weight:700; font-size:.78rem;
  padding:9px 14px; border-radius:11px;
  box-shadow:0 3px 12px rgba(37,211,102,.2); transition:all .2s;
}
.btn-wa-panel:hover { filter:brightness(1.1); transform:translateY(-1px); }

/* OPTIONNEL: btn profil vendeur
.btn-profil-panel { padding:8px 14px; border-radius:10px; font-size:.75rem; font-weight:700; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.5); text-decoration:none; transition:all .2s; white-space:nowrap; }
.btn-profil-panel:hover { color:white; }
*/

/* Transitions expand */
.expand-enter-active { transition: all .3s cubic-bezier(.25,.46,.45,.94); }
.expand-leave-active { transition: all .2s ease; }
.expand-enter-from  { opacity:0; max-height:0; }
.expand-enter-to    { opacity:1; max-height:500px; }
.expand-leave-from  { opacity:1; max-height:500px; }
.expand-leave-to    { opacity:0; max-height:0; }

/* ══ INTOUCHABLE — Voir carte ═══════════════════════════════ */
.vp-voir-carte { text-align:center; margin-top:8px; max-width:860px; margin-left:auto; margin-right:auto; }
.btn-carte {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 24px; border-radius: 99px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.12);
  color: rgba(255,255,255,.5); font-size: .82rem; font-weight: 600;
  text-decoration: none; transition: all .2s;
}
.btn-carte:hover { color:white; background:rgba(255,255,255,.09); border-color:rgba(255,255,255,.2); }
.btn-carte-badge { font-size:.9rem; }

/* ══ TOAST ══════════════════════════════════════════════════ */
.vp-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:rgba(5,46,22,.95); border:1px solid rgba(22,101,52,.8); color:#4ade80; font-size:.78rem; font-weight:700; padding:9px 18px; border-radius:99px; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,.4); z-index:9999; }
.toast-vp-enter-active,.toast-vp-leave-active { transition:all .3s ease; }
.toast-vp-enter-from,.toast-vp-leave-to { opacity:0; transform:translateX(-50%) translateY(8px); }

/* ══ RESPONSIVE ═════════════════════════════════════════════ */
@media (max-width: 640px) {
  .vp { padding: 20px 12px; }
  .invite-content { flex-direction:column; text-align:center; }
  .vp-stats { display:none; }
  .prod-info { flex-direction:column; align-items:flex-start; gap:2px; }
  .panel-cta { flex-direction:column; }
  .btn-wa-panel { width:100%; }
}
</style>
