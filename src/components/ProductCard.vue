<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  components/ProductCard.vue — SamakMarket                    ║
  ║  Design: Luxury nautique · dark ocean · humour pêcheur 🐟    ║
  ║                                                              ║
  ║  STRUCTURE:                                                  ║
  ║    1. Image + watermark logo + badges (promo/flash/frais)    ║
  ║    2. Nom poisson + prix + atp_btn                           ║
  ║    3. Vendeur info: nom + ville + distance + bulle articles   ║
  ║    4. CTA: WhatsApp + atp_btn panier                         ║
  ║                                                              ║
  ║  SEO: itemscope Product schema.org sur la card               ║
  ╚══════════════════════════════════════════════════════════════╝
-->
<template>
  <!-- itemscope SEO Product schema.org -->
  <article
    class="pc"
    :class="{ 'pc-liste': vueListe }"
    itemscope
    itemtype="https://schema.org/Product"
    :aria-label="`${produit.name} — ${produit.price} MAD/${produit.unit} à ${produit.city}`"
  >

    <!-- ══════════════════════════════════════════════════
         BLOC 1 — IMAGE + WATERMARK + BADGES
    ══════════════════════════════════════════════════ -->
    <RouterLink :to="`/products/${produit.id}`" class="pc-img-wrap" :aria-label="`Voir ${produit.name}`">

      <!-- Image produit -->
      <img
        :src="imageUrl"
        :alt="`${produit.name} frais — ${produit.city} | SamakMarket`"
        class="pc-img"
        loading="lazy"
        width="400" height="300"
        @error="onImgError"
        itemprop="image"
      />

      <!-- Watermark logo (protection superficielle) -->
      <div class="pc-watermark" aria-hidden="true">
        <img src="/log.png" alt="" class="pc-wm-logo" />
        <!-- OPTIONNEL: remplace par ton vrai logo SVG -->
        <!-- <span class="pc-wm-text">SamakMarket</span> -->
      </div>

      <!-- Badges overlay -->
      <div class="pc-badges" aria-label="Statut du produit">
        <!-- Badge flash vente — priorité max -->
        <span v-if="produit.is_flash && produit.flash_price" class="pc-badge pc-flash" aria-label="Offre flash">
          ⚡ FLASH
        </span>
        <!-- Badge promo -->
        <span v-else-if="produit.is_promo" class="pc-badge pc-promo" aria-label="Promotion">
          🔥 PROMO
        </span>

        <!-- Badge frais du jour — si créé aujourd'hui -->
        <span v-if="estFraisAujourdhui" class="pc-badge pc-frais" aria-label="Frais du jour">
          ● FRAIS
        </span>
      </div>

      <!-- Prix flash en overlay (si flash sale actif) -->
      <div v-if="produit.is_flash && produit.flash_price" class="pc-flash-countdown" aria-label="Prix flash limité">
        <span class="pc-flash-price">{{ Number(produit.flash_price).toLocaleString('fr-FR') }} MAD</span>
      </div>

      <!-- OPTIONNEL: compteur vues -->
      <!-- <div class="pc-vues" aria-hidden="true">👁️ {{ produit.views_count || 0 }}</div> -->

    </RouterLink>

    <!-- ══════════════════════════════════════════════════
         BLOC 2 — NOM POISSON + PRIX + ATP_BTN
    ══════════════════════════════════════════════════ -->
   <div class="pc-main">

  <div class="pc-cat" aria-label="Catégorie">
    <span class="pc-cat-emoji" aria-hidden="true">{{ emojiProduit }}</span>
    <span class="pc-cat-label" itemprop="category">
      {{ i18n.t(`categories.${produit.category}`) }}
    </span>
    <span class="pc-slogan" aria-hidden="true">
      {{ i18n.t(`slogans.${sloganPecheurKey}`) }}
    </span>
  </div>

  <h3 class="pc-nom" itemprop="name">
    <RouterLink :to="`/products/${produit.id}`" class="pc-nom-link">
      {{ i18n.t(`products.${produit.id}.name`) }}
    </RouterLink>
  </h3>

  <div class="pc-prix-row">
    <div class="pc-prix" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
      <span v-if="produit.is_flash && produit.flash_price" class="pc-prix-ancien">
        {{ Number(produit.price).toLocaleString(i18n.lang === 'ar' ? 'ar-MA' : 'fr-FR') }}
      </span>
      <span class="pc-prix-val" itemprop="price" :content="prixEffectif">
        {{ Number(prixEffectif).toLocaleString(i18n.lang === 'ar' ? 'ar-MA' : 'fr-FR') }}
      </span>
      <span class="pc-prix-unite" itemprop="priceCurrency" content="MAD">
        MAD/{{ i18n.t(`units.${produit.unit}`) }}
      </span>
      <link itemprop="availability" href="https://schema.org/InStock" />
    </div>

    <AddToCartBtn :produit="produit" size="sm" variant="icon" @added="onAdded" />
  </div>
</div>

<div class="pc-vendeur" v-if="produit.seller" itemscope itemtype="https://schema.org/Person">
  <div class="pc-vendeur-row">
    <div class="pc-vendeur-av" aria-hidden="true">
      {{ produit.seller.name?.charAt(0)?.toUpperCase() }}
    </div>

    <div class="pc-vendeur-info">
      <span class="pc-vendeur-nom" itemprop="name">{{ produit.seller.name }}</span>
      <span class="pc-vendeur-ville">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        {{ i18n.t(`villes.${produit.city || produit.seller.city}`) }}
        
        <span v-if="produit.distance" class="pc-distance">
          · {{ formatDistance(produit.distance) }}
        </span>
      </span>
    </div>
  </div>
</div>

    <!-- ══════════════════════════════════════════════════
         BLOC 3 — VENDEUR: nom + ville + distance + bulle
    ══════════════════════════════════════════════════ -->
    <div class="pc-vendeur" v-if="produit.seller" itemscope itemtype="https://schema.org/Person">

      <!-- Info vendeur ligne principale -->
     

    </div>

    <!-- ══════════════════════════════════════════════════
         BLOC 4 — CTA: WHATSAPP + ATP_BTN PANIER
    ══════════════════════════════════════════════════ -->
    <div class="pc-cta">

      <!-- WhatsApp — CTA principal -->
      <a
        :href="lienWhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        class="pc-wa-btn"
        :aria-label="`Commander ${produit.name} sur WhatsApp`"
        @click.stop
      >
        <!-- Icône WhatsApp SVG -->
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Commander
      </a>

      <!-- ATP_BTN panier — variante outline -->
      <AddToCartBtn
        :produit="produit"
        size="md"
        variant="outline"
        label="Panier"
        @added="onAdded"
      />

    </div>

    <!-- Toast confirmation ajout panier -->
    <Transition name="toast-atp">
      <div v-if="toastVisible" class="pc-toast" role="status" aria-live="polite">
        ✅ {{ dernierAjoute?.name }} ajouté !
      </div>
    </Transition>

  </article>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink }    from 'vue-router'
import AddToCartBtn      from './AddToCartBtn.vue'
import api from '@/services/api'
import { fishSpecies } from '@/data/products'
import { useI18nStore } from '@/stores/i18n'

const i18n = useI18nStore()

/* ── Props ──────────────────────────────────────────────────── */
const props = defineProps({
  produit:   { type: Object,  required: true },
  vueListe:  { type: Boolean, default: false },
  /* Distance GPS en km (optionnel, injecté par vendeurs/proches) */
  // distance: { type: Number, default: null },
})

/* ── State ──────────────────────────────────────────────────── */
const bulleVisible  = ref(false)
const toastVisible  = ref(false)
const dernierAjoute = ref(null)

/* ── Image avec fallback ────────────────────────────────────── */
const imageUrl = computed(() => {
  /* Priorité: image en base → image par nom dans public → emoji SVG */
  if (props.produit.images?.length) return props.produit.images[0]
  const nom = props.produit.name?.toLowerCase().replace(/\s+/g, '-') || ''
  const category = props.produit.category?.toLowerCase().replace(/\s+/g, '-') || ''
  //console.log('🐟 imageUrl pour', props.produit.name, '→', `./images/poissons/${category}/jours/jour_1.jpg`) // debug
 return `/images/poissons/${category}/jours/jour_1.jpg`
})
const onImgError = (e) => {
  /* Fallback: emoji SVG si image introuvable */
  const emoji = emojiMap[props.produit.category] || '🐟'
  e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23061428' width='400' height='300'/><text y='170' x='200' font-size='100' text-anchor='middle'>${encodeURIComponent(emoji)}</text></svg>`
}

/* ── Emoji par catégorie ─────────────────────────────────────── */
const emojiMap = {
  'Sardine':'🐟','Thon':'🐠','Crevette':'🦐','Homard':'🦞',
  'Mérou':'🐡','Dorade':'🐠','Calamar':'🦑','Poulpe':'🐙',
  'Capitaine':'🐟','Sole':'🐟',
}
const emojiProduit = computed(() => emojiMap[props.produit.category] || '🐟')

/* ── Slogans pêcheur (humour) ────────────────────────────────── */
const slogans = ['fresh', 'local'] // Les clés qui sont dans ton fichier fr.js
const sloganPecheurKey = slogans[Math.floor(Math.random() * slogans.length)]

/* ── Prix effectif (flash ou normal) ───────────────────────── */
const prixEffectif = computed(() =>
  props.produit.is_flash && props.produit.flash_price
    ? props.produit.flash_price
    : props.produit.price
)

/* ── Frais aujourd'hui ──────────────────────────────────────── */
const estFraisAujourdhui = computed(() => {
  if (!props.produit.createdAt) return false
  const creation = new Date(props.produit.createdAt)
  const auj = new Date()
  return creation.toDateString() === auj.toDateString()
})

/* ── Distance formatée ──────────────────────────────────────── */
const formatDistance = (km) => {
  if (!km && km !== 0) return ''
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`
}

/* ── WhatsApp avec message structuré ────────────────────────── */
const SAMAK_WA = '212647689006'
const lienWhatsApp = computed(() => {
  const num = (props.produit.seller?.whatsapp || SAMAK_WA).replace(/[\s\-\+\(\)]/g, '')
  const msg = encodeURIComponent(
    `سلام SamakMarket 🐟\n` +
    `كنبغي: *${props.produit.name}*\n` +
    `💰 ${prixEffectif.value} MAD/${props.produit.unit}\n` +
    `📍 ${props.produit.city}\n` +
    `🆔 ref:${props.produit.id}`
  )
  return `https://wa.me/${num}?text=${msg}`
})

/* ── Articles vendeur pour bulle tooltip ────────────────────── */
/* OPTIONNEL: charge les articles depuis le store ou l'API */
const articlesVendeur = ref([])

// Charge au survol de la bulle (lazy loading)
const chargerArticlesVendeur = async () => {
  console.log('🐟 charger articles', props.produit.seller_id)  // ← ici
  if (articlesVendeur.value.length) return
  if (!props.produit.seller_id) return
  try {
    const { data } = await api.get('/products', {
      params: {
        seller_id:    props.produit.seller_id,
        limit:        5,
        is_available: true,
        sort:         'updated_at',
      }
    })
    // ← data.produits pas data directement !
    articlesVendeur.value = (data.produits || [])
      .filter(p => p.id !== props.produit.id)
      .slice(0, 4)
    
    console.log('articles vendeur:', articlesVendeur.value) // debug
  } catch (e) {
    console.error('erreur articles vendeur:', e)
  }
}

/* ── Toast ajout panier ─────────────────────────────────────── */
const onAdded = ({ produit }) => {
  dernierAjoute.value = produit
  toastVisible.value  = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}
</script>

<style scoped>
/* ══ Variables ═══════════════════════════════════════════════ */
.pc {
  --ocean:  #020e23;
  --surf:   #061428;
  --deep:   #040f20;
  --or:     #d4af37;
  --or2:    #f5d57a;
  --cyan:   #0dcaf0;
  --vert:   #25d366;
  --rouge:  #f87171;

  /* Card structure */
  display: flex; flex-direction: column;
  background: var(--surf);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px; overflow: hidden;
  transition: transform .25s cubic-bezier(.25,.46,.45,.94), box-shadow .25s;
  position: relative;
  /* Animation entrée */
  animation: pc-in .4s ease both;
}
@keyframes pc-in {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
.pc:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,.4), 0 0 0 1px rgba(13,202,240,.1);
}

/* ── Mode liste (horizontal) ──────────────────────────────── */
.pc-liste { flex-direction: row; border-radius: 14px; }
.pc-liste .pc-img-wrap { width: 120px; min-width: 120px; aspect-ratio: auto; height: 120px; }
.pc-liste .pc-main { padding: 10px 12px 6px; }
.pc-liste .pc-vendeur { padding: 0 12px 6px; }
.pc-liste .pc-cta { flex-direction: row; padding: 8px 12px; margin-top: auto; }

/* ══ BLOC 1 — IMAGE ══════════════════════════════════════════ */
.pc-img-wrap {
  position: relative; overflow: hidden;
  aspect-ratio: 4/3; background: var(--deep);
  display: block;
}
.pc-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .4s ease;
  display: block;
}
.pc:hover .pc-img { transform: scale(1.05); }

/* Watermark logo protection */
.pc-watermark {
  position: absolute; bottom: 8px; right: 8px; z-index: 2;
  opacity: .25; pointer-events: none;
  mix-blend-mode: screen;
}
.pc-wm-logo { width: 28px; height: 28px; object-fit: contain; filter: brightness(10); }
/* OPTIONNEL text watermark:
.pc-wm-text { font-size: .6rem; color: white; font-weight: 700; letter-spacing: .08em; } */

/* Badges */
.pc-badges { position: absolute; top: 8px; left: 8px; z-index: 3; display: flex; flex-direction: column; gap: 4px; }
.pc-badge {
  font-size: .58rem; font-weight: 900; letter-spacing: .1em;
  padding: 3px 8px; border-radius: 99px; display: inline-flex; align-items: center; gap: 3px;
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.pc-flash { background: rgba(251,191,36,.2); border: 1px solid rgba(251,191,36,.4); color: #fbbf24; }
.pc-promo  { background: rgba(248,113,113,.15); border: 1px solid rgba(248,113,113,.3); color: #f87171; }
.pc-frais  { background: rgba(13,202,240,.12); border: 1px solid rgba(13,202,240,.25); color: var(--cyan); }

/* Prix flash overlay */
.pc-flash-countdown {
  position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
  background: linear-gradient(transparent, rgba(251,191,36,.2));
  padding: 16px 10px 6px;
  text-align: center;
}
.pc-flash-price { color: #fbbf24; font-size: .85rem; font-weight: 900; }

/* ══ BLOC 2 — NOM + PRIX ═════════════════════════════════════ */
.pc-main { padding: 12px 14px 8px; flex: 1; display: flex; flex-direction: column; gap: 6px; }

/* Catégorie */
.pc-cat { display: flex; align-items: center; gap: 5px; }
.pc-cat-emoji { font-size: .9rem; }
.pc-cat-label {
  color: rgba(255,255,255,.3); font-size: .65rem;
  text-transform: uppercase; letter-spacing: .1em;
}
/* Slogan humour pêcheur */
.pc-slogan {
  margin-left: auto;
  color: rgba(13,202,240,.5); font-size: .6rem;
  font-style: italic; white-space: nowrap;
  /* OPTIONNEL: masque si trop chargé → ajoute display:none */
}

/* Nom H3 SEO */
.pc-nom { margin: 0; }
.pc-nom-link {
  color: white; text-decoration: none;
  font-size: .92rem; font-weight: 800; line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  transition: color .2s;
}
.pc-nom-link:hover { color: var(--cyan); }

/* Prix row */
.pc-prix-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.pc-prix { display: flex; align-items: baseline; gap: 4px; flex-wrap: wrap; }
.pc-prix-ancien { color: rgba(255,255,255,.3); text-decoration: line-through; font-size: .72rem; }
.pc-prix-val    { color: var(--or2); font-size: 1.1rem; font-weight: 900; }
.pc-prix-unite  { color: rgba(255,255,255,.35); font-size: .65rem; }

/* ══ BLOC 3 — VENDEUR ════════════════════════════════════════ */
.pc-vendeur {
  padding: 0 14px 10px;
  border-top: 1px solid rgba(255,255,255,.05);
  padding-top: 8px; margin-top: 4px;
}
.pc-vendeur-row { display: flex; align-items: center; gap: 8px; }

/* Avatar initiale */
.pc-vendeur-av {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, var(--or), var(--or2));
  color: #020e23; font-weight: 900; font-size: .72rem;
  display: flex; align-items: center; justify-content: center;
}
.pc-vendeur-info { flex: 1; min-width: 0; }
.pc-vendeur-nom  { color: white; font-size: .78rem; font-weight: 700; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-vendeur-ville {
  color: rgba(255,255,255,.3); font-size: .65rem;
  display: flex; align-items: center; gap: 3px; margin-top: 1px;
}
.pc-distance { color: var(--cyan); font-weight: 700; }

/* Bulle articles vendeur */
.pc-vendeur-bulle {
  position: relative; flex-shrink: 0;
  background: rgba(13,202,240,.08); border: 1px solid rgba(13,202,240,.15);
  color: var(--cyan); font-size: .65rem; font-weight: 700;
  padding: 3px 8px; border-radius: 99px; cursor: pointer;
  transition: all .2s; white-space: nowrap;
}
.pc-vendeur-bulle:hover { background: rgba(13,202,240,.15); }

/* Tooltip bulle articles */
.pc-bulle-tooltip {
  position: absolute; bottom: calc(100% + 8px); right: 0;
  width: 220px; z-index: 50;
  background: rgba(4,15,32,.97); backdrop-filter: blur(20px);
  border: 1px solid rgba(13,202,240,.2); border-radius: 14px;
  padding: 10px; box-shadow: 0 16px 40px rgba(0,0,0,.5);
}
.pc-bulle-titre {
  color: rgba(255,255,255,.4); font-size: .62rem;
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px;
}
.pc-bulle-item {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,.04);
}
.pc-bulle-item:last-of-type { border-bottom: none; }
.pc-bulle-nom  { flex: 1; color: white; font-size: .72rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-bulle-prix { color: var(--or2); font-size: .68rem; font-weight: 700; white-space: nowrap; }
/* OPTIONNEL: lien profil vendeur
.pc-bulle-voir { display:block; text-align:center; color:var(--cyan); font-size:.68rem; margin-top:8px; text-decoration:none; }
*/

/* Animation bulle */
.bulle-fade-enter-active, .bulle-fade-leave-active { transition: all .2s ease; }
.bulle-fade-enter-from, .bulle-fade-leave-to { opacity: 0; transform: translateY(6px) scale(.97); }

/* ══ BLOC 4 — CTA ═══════════════════════════════════════════ */
.pc-cta {
  display: flex; gap: 8px; padding: 10px 14px 14px;
  border-top: 1px solid rgba(255,255,255,.05);
  align-items: center;
}

/* WhatsApp */
.pc-wa-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  background: linear-gradient(135deg, #075e54, #25d366);
  color: white; text-decoration: none; font-size: .78rem; font-weight: 800;
  padding: 9px 12px; border-radius: 11px;
  box-shadow: 0 3px 12px rgba(37,211,102,.25); transition: all .2s;
}
.pc-wa-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* ══ TOAST ══════════════════════════════════════════════════ */
.pc-toast {
  position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%);
  background: rgba(5,46,22,.95); border: 1px solid rgba(22,101,52,.8);
  color: #4ade80; font-size: .75rem; font-weight: 700;
  padding: 7px 14px; border-radius: 99px; white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0,0,0,.4); z-index: 20;
}
.toast-atp-enter-active, .toast-atp-leave-active { transition: all .25s ease; }
.toast-atp-enter-from, .toast-atp-leave-to { opacity: 0; transform: translateX(-50%) translateY(6px); }

/* ══ RESPONSIVE ═════════════════════════════════════════════ */
@media (max-width: 480px) {
  .pc-nom-link { font-size: .85rem; }
  .pc-prix-val { font-size: .98rem; }
  .pc-slogan   { display: none; } /* masqué mobile — trop petit */
  .pc-cta      { padding: 8px 10px 10px; gap: 6px; }
}
</style>
