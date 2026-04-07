<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  views/ProductDetailView.vue — SamakMarket                   ║
  ║  Design: Luxury nautique · dark ocean · cohérent ProductCard ║
  ║                                                              ║
  ║  FEATURES:                                                   ║
  ║    - Galerie multi-vues (vue1.jpg → vue5.jpg par catégorie)  ║
  ║    - Options découpe: entier / filet / darnes / portions     ║
  ║    - Quantité + total calculé dynamiquement                  ║
  ║    - ATP_BTN + WhatsApp avec options incluses                ║
  ║    - 5 derniers articles du vendeur                          ║
  ║    - SEO schema.org Product                                  ║
  ╚══════════════════════════════════════════════════════════════╝
-->
<template>
  <div class="pdv">
    <NavBar />

    <!-- ── Loading ─────────────────────────────────────────── -->
    <div v-if="chargement" class="pdv-loading">
      <div class="loading-fish">🐟</div>
      <p class="loading-txt">Chargement du produit...</p>
    </div>

    <!-- ── Not found ──────────────────────────────────────── -->
    <div v-else-if="!produit" class="pdv-notfound">
      <div class="nf-ico">😕</div>
      <p class="nf-txt">Produit introuvable</p>
      <RouterLink to="/" class="nf-link">← Retour à la marketplace</RouterLink>
    </div>

    <!-- ── Produit ────────────────────────────────────────── -->
    <main
      v-else
      class="pdv-main"
      itemscope
      itemtype="https://schema.org/Product"
    >
      <!-- Fil d'Ariane SEO -->
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <RouterLink to="/" class="bc-link">Marketplace</RouterLink>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-link">{{ produit.category }}</span>
        <span class="bc-sep" aria-hidden="true">›</span>
        <span class="bc-current" aria-current="page">{{ produit.name }}</span>
      </nav>
<!-- ── Vendeur ───────────────────────────────────── -->
          <div v-if="produit.seller" class="vendeur-bloc" itemprop="seller" itemscope itemtype="https://schema.org/Person">
            <div class="bloc-titre-row">
              <span class="bloc-titre">🧑‍🍳 Vendeur</span>
              <span v-if="produit.seller.nbProduits" class="vendeur-count-badge">
                🐟 {{ produit.seller.nbProduits }} articles
              </span>
            </div>
            <div class="vendeur-card">
              <div class="vendeur-av" aria-hidden="true">{{ produit.seller.name?.charAt(0)?.toUpperCase() }}</div>
              <div class="vendeur-info">
                <div class="vendeur-nom" itemprop="name">{{ produit.seller.name }}</div>
                <div class="vendeur-lieu">📍 {{ produit.seller.city }}</div>
              </div>
              <!-- OPTIONNEL: active quand page publique vendeur existe -->
              <!-- <RouterLink :to="`/vendeur/${produit.seller_id}`" class="vendeur-profil-btn">Voir profil →</RouterLink> -->
            </div>
          </div>
      <div class="pdv-grid">

        <!-- ════════════════════════════════════════════════
             COLONNE GAUCHE — Galerie multi-vues
        ════════════════════════════════════════════════ -->
        <div class="galerie-col">

          <!-- Image principale avec transition -->
          <div class="img-main-wrap">

            <!-- Badges overlay (même style que ProductCard) -->
            <div class="pc-badges" aria-label="Statut">
              <span v-if="produit.is_flash && produit.flash_price" class="pc-badge pc-flash">⚡ FLASH</span>
              <span v-else-if="produit.is_promo" class="pc-badge pc-promo">🔥 PROMO</span>
              <span v-if="estFraisAujourdhui" class="pc-badge pc-frais">● FRAIS</span>
            </div>

            <!-- Watermark logo -->
            <div class="pc-watermark" aria-hidden="true">
              <img src="/log.png" alt="" class="pc-wm-logo" />
            </div>

            <!-- Vues counter -->
            <div class="img-vues" aria-hidden="true">
              👁️ {{ produit.views_count || 0 }} vues
            </div>

            <Transition name="img-fade" mode="out-in">
              <img
                :key="vueActive"
                :src="vueActive"
                :alt="`${produit.name} ${optionActive.label} — ${produit.city} | SamakMarket`"
                class="img-main"
                loading="eager"
                itemprop="image"
                @error="onImgError"
              />
            </Transition>

            <!-- Flèches navigation galerie -->
            <button
              v-if="galerie.length > 1"
              class="img-nav img-prev"
              @click="vueIndex = (vueIndex - 1 + galerie.length) % galerie.length"
              aria-label="Vue précédente"
            >‹</button>
            <button
              v-if="galerie.length > 1"
              class="img-nav img-next"
              @click="vueIndex = (vueIndex + 1) % galerie.length"
              aria-label="Vue suivante"
            >›</button>
          </div>

          <!-- Thumbnails vues -->
          <div class="thumbnails" v-if="galerie.length > 1" role="list" aria-label="Vues du produit">
            <button
              v-for="(img, i) in galerie"
              :key="i"
              class="thumb"
              :class="{ 'thumb-on': vueIndex === i }"
              @click="vueIndex = i"
              :aria-label="`Vue ${i + 1}`"
              :aria-pressed="vueIndex === i"
              role="listitem"
            >
              <img :src="img" :alt="`Vue ${i+1}`" class="thumb-img" @error="e => e.target.style.opacity=0" />
            </button>
          </div>

          <!-- Partage -->
          <div class="share-row">
            <span class="share-lbl">Partager :</span>
            <button class="share-btn" @click="partagerWA" title="Partager sur WhatsApp" aria-label="Partager sur WhatsApp">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </button>
            <button class="share-btn" @click="copierLien" title="Copier le lien" aria-label="Copier le lien">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            </button>
          </div>

        </div>

        <!-- ════════════════════════════════════════════════
             COLONNE DROITE — Infos + Options + CTA
        ════════════════════════════════════════════════ -->
        <div class="infos-col">

          <!-- Catégorie + emoji -->
          <div class="infos-cat">
            <span class="cat-emoji" aria-hidden="true">{{ emojiProduit }}</span>
            <span class="cat-label" itemprop="category">{{ produit.category }}</span>
            <!-- Slogan humour pêcheur stable -->
            <span class="cat-slogan" aria-hidden="true">{{ sloganPecheur }}</span>
          </div>

          <!-- Nom SEO H1 -->
          <h1 class="pdv-nom" itemprop="name">{{ produit.name }}</h1>

          <!-- Lieu -->
          <div class="pdv-lieu">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {{ produit.city || produit.seller?.city }}
            <span class="pdv-fraicheur">· 🕐 Pêché ce matin</span>
          </div>

          <!-- Prix -->
          <div class="prix-bloc" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
            <span v-if="produit.is_flash && produit.flash_price" class="prix-ancien" aria-label="Ancien prix">
              {{ Number(produit.price).toLocaleString('fr-FR') }}
            </span>
            <span class="prix-val" itemprop="price" :content="prixEffectif" aria-label="Prix">
              {{ Number(prixEffectif).toLocaleString('fr-FR') }}
            </span>
            <span class="prix-unite" itemprop="priceCurrency" content="MAD">
              MAD / {{ produit.unit }}
            </span>
            <div v-if="produit.is_flash && produit.flash_price" class="reduction-badge" aria-label="Réduction">
              -{{ Math.round((1 - produit.flash_price / produit.price) * 100) }}%
            </div>
            <link itemprop="availability" href="https://schema.org/InStock" />
          </div>

          <!-- ══ OPTIONS DE DÉCOUPE ══════════════════════════
               Options spécifiques à la vente de poisson
               OPTIONNEL: retire les options non pertinentes
          ══════════════════════════════════════════════════ -->
          <div class="options-section">
            <div class="options-titre">
              🔪 Comment vous le voulez ?   / 👨‍🍳 ​اختار كيفاش تشهيتيه 
               <span class="options-sous">Le pêcheur prépare à votre demande</span>
            </div>

           <div class="options-grid" role="radiogroup" aria-label="Mode de découpe">
  <button
  v-for="opt in optionsAffichees" 
  :key="opt.id"
  class="opt-btn"
  :class="{ 'opt-on': optionChoisieId === opt.id }"
  
  
  @click="optionChoisieId = opt.id" 
  
  :aria-pressed="optionChoisieId === opt.id"
  :title="opt.desc"
>
  <span class="opt-ico" aria-hidden="true">{{ opt.ico }}</span>
  <span class="opt-label">{{ opt.label }}</span>
  
  <span v-if="opt.mult !== 1" class="opt-prix-adj" aria-label="Ajustement prix">
    x{{ opt.mult }}
  </span>
</button></div>


            <!-- Description de l'option sélectionnée -->
            <p class="opt-desc-active" aria-live="polite">
              {{ optionActive.ico }} {{ optionActive.desc }}
            </p>
          </div>

          <!-- ── Quantité ─────────────────────────────────── -->
          <div class="qte-section">
            <div class="qte-wrap">
              <button
                class="qte-btn"
                @click="qte > 1 && qte--"
                aria-label="Diminuer la quantité"
                :disabled="qte <= 1"
              >−</button>
              <span class="qte-val" aria-label="Quantité">{{ qte }}</span>
              <button
                class="qte-btn"
                @click="qte++"
                aria-label="Augmenter la quantité"
              >+</button>
              <span class="qte-unit">{{ produit.unit }}</span>
            </div>
            <div class="qte-total" aria-live="polite">
              Total estimé :
              <strong>{{ totalEstime }} MAD/</strong>
            </div>
          </div>

          <!-- ── CTA Boutons ──────────────────────────────── -->
          <div class="cta-group">

            <!-- WhatsApp — message avec options incluses -->
            <a
              :href="lienWhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-wa"
              :aria-label="`Commander ${produit.name} ${optionActive.label} sur WhatsApp`"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Commander {{ qte }}{{ produit.unit }} · {{ optionActive.label }}
            </a>

            <div class="cta-row-2">
              <!-- Appeler -->
              <a
                v-if="produit.seller?.phone"
                :href="`tel:${produit.seller.phone}`"
                class="btn-tel"
                aria-label="Appeler le vendeur"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 016 1.82a2 2 0 012 1.72v3a2 2 0 01-1.45 1.95 16 16 0 006.86 6.86A2 2 0 0116.15 14z"/>
                </svg>
                Appeler
              </a>

              <!-- ATP_BTN panier -->
              <AddToCartBtn
  v-if="produitPourPanier"
  :produit="produitPourPanier"
  size="md"
  variant="outline"
  label="Ajouter au Panier"
  style="flex:1"
  @added="onAdded"
/>

              <!-- Favori -->
              <button
                class="btn-favori"
                :class="{ 'favori-on': favori }"
                @click="favori = !favori"
                :aria-label="favori ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                :aria-pressed="favori"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" :fill="favori ? '#f87171' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Description -->
          <div v-if="produit.description" class="description-bloc">
            <div class="bloc-titre">📋 Description</div>
            <p class="desc-txt" itemprop="description">{{ produit.description }}</p>
          </div>

          

          <!-- Tags SEO -->
          <div class="tags-seo" aria-label="Tags">
            <span class="tag">{{ produit.category }}</span>
            <span class="tag">Poisson frais {{ produit.city }}</span>
            <span class="tag">{{ produit.unit }}</span>
            <span class="tag">{{ optionActive.label }}</span>
            <span class="tag">SamakMarket Maroc</span>
          </div>

        </div>
      </div>

      <!-- ════════════════════════════════════════════════════
           SECTION — 5 derniers articles du vendeur
      ════════════════════════════════════════════════════ -->
      <section v-if="autresProduits.length > 0" class="autres-section" aria-label="Autres produits du vendeur">
        <div class="autres-titre">
          🐟 Autres produits de {{ produit.seller?.name?.split(' ')[0] }}
          <span class="autres-sous">Frais du même port</span>
        </div>
        <div class="autres-liste" role="list">
          <article
            v-for="p in autresProduits"
            :key="p.id"
            class="autre-card"
            role="listitem"
            :aria-label="`${p.name} — ${p.price} MAD/${p.unit}`"
          >
            <!-- Image mini -->
            <RouterLink :to="`/products/${p.id}`" class="autre-img-wrap" :aria-label="`Voir ${p.name}`">
              <img
                :src="`/images/${p.name?.toLowerCase().replace(/\s+/g,'-')}/jours/jours_1.jpg`"
                :alt="p.name"
                class="autre-img"
                @error="e => e.target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect fill='%23061428' width='80' height='80'/><text y='52' x='40' font-size='36' text-anchor='middle'>${encodeURIComponent(emojiMap[p.category] || '🐟')}</text></svg>`"
              />
            </RouterLink>

            <!-- Infos -->
            <div class="autre-info">
              <RouterLink :to="`/products/${p.id}`" class="autre-nom">{{ p.name }}</RouterLink>
              <div class="autre-prix">
                {{ Number(p.price).toLocaleString('fr-FR') }} MAD
                <span class="autre-unite">/ {{ p.unit }}</span>
              </div>
            </div>

            <!-- Boutons -->
            <div class="autre-btns">
              <RouterLink :to="`/products/${p.id}`" class="btn-voir" :aria-label="`Voir ${p.name}`">
                Voir →
              </RouterLink>
              <AddToCartBtn 
  :produit="produitPret" 
  size="sm" 
  variant="icon" 
  @added="onAdded" 
/>
            </div>
          </article>
        </div>
      </section>

      <!-- Toast -->
      <Transition name="toast-pdv">
        <div v-if="toastVisible" class="pdv-toast" role="status" aria-live="polite">
          ✅ {{ dernierAjoute?.name }} ajouté au panier !
        </div>
      </Transition>

    </main>

    <RouterLink to="/" class="pdv-back">← Retour à la marketplace</RouterLink>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, RouterLink }    from 'vue-router'
import api         from '../services/api'
import NavBar      from '../components/NavBar.vue'
import AddToCartBtn from '../components/AddToCartBtn.vue'

/* ── Route ──────────────────────────────────────────────────── */
const route        = useRoute()
const produit      = ref(null)
const chargement   = ref(true)
const autresProduits = ref([])

/* ── State UI ───────────────────────────────────────────────── */
const vueIndex    = ref(0)
const favori      = ref(false)
const qte         = ref(1)
const toastVisible  = ref(false)
const dernierAjoute = ref(null)

/* ── Options de découpe poisson ─────────────────────────────── */

 const optionsDecoupe = [
  // --- OPTIONS GÉNÉRALES POISSONS ---
  { 
    id: 'entier', 
    ico: '🐟', 
    label: 'صاين / Entier', 
    desc: 'حوتة كاملة، منقية ومقشرة حسب الطلب / Poisson entier, vidé et écaillé à la demande', 
    mult: 1 
  },
  { 
    id: 'filet', 
    ico: '🍣', 
    label: 'فيلي / Filet', 
    desc: 'هبرة بلا شوك، مقادة وطايبة مثالية للأطفال / Filets levés, sans arêtes, prêts à cuire', 
    mult: 1.15 
  },
  { 
    id: 'darne', 
    ico: '🔪', 
    label: 'طرونش / Darnes', 
    desc: 'طريفات غلاظ للطاجين أو الشوا / Tranches épaisses de 3-4 cm, idéales pour grill ou tajine', 
    mult: 1 
  },
  { 
    id: 'portion', 
    ico: '🍽️', 
    label: 'طراف / Portions', 
    desc: 'مقطعة طريفات صغار واجدة للقلي / Découpé en portions individuelles 150-200g', 
    mult: 1.1 
  },
  { 
    id: 'papillon', 
    ico: '🦋', 
    label: 'محلول / Papillon', 
    desc: 'محلول من الظهر واجد للعمارة أو الفران / Ouvert à plat, dos intact — parfait pour four', 
    mult: 1.05 
  },
  { 
    id: 'tete', 
    ico: '🫙', 
    label: 'بلا راس / Sans tête', 
    desc: 'محيد ليه الراس، نقي وواجد للطياب / Tête retirée, reste entier — pratique et propre', 
    mult: 0.95 
  },
  { 
    id: 'vide', 
    ico: '📦', 
    label: 'مكرط فقط / Vidé seulement', 
    desc: 'محيد ليه غير لداخل، الباقي عليك / Juste éviscéré, vous faites le reste 💪', 
    mult: 0.98 
  },

  // --- SPÉCIFIQUE CREVETTES & FRUITS DE MER ---
  { 
    id: 'decortique', 
    ico: '🍤', 
    label: 'منقي / Décortiqué', 
    desc: 'قشور محيدة كاملة، واجد للمقيلة أو السلطة / Carapaces retirées, prêt pour poêlée ou salade', 
    mult: 1.4 
  },
  { 
    id: 'nettoye', 
    ico: '🐙', 
    label: 'منظف / Nettoyé', 
    desc: 'مغسول ومقطع دوائر (سيبيا/كالامار) / Nettoyé et coupé en rondelles (Seiche/Calamar)', 
    mult: 1.2 
  },
  { 
    id: 'mix-paella', 
    ico: '🥘', 
    label: 'خليط بايلة / Mix Paella', 
    desc: 'تشكيلة فواكه البحر مقطعة وواجدة / Mélange de fruits de mer découpés pour paella', 
    mult: 1.25 
  },

  /* OPTIONNEL: options spéciales selon catégorie */
  
  { 
    id: 'sashimi', 
    ico: '🎌', 
    label: 'ساشيمي / Sashimi', 
    desc: 'طريفات رقاق بزاف - طون فقط / Tranches fines style japonais — thon uniquement', 
    mult: 1.3 
  },
  { 
    id: 'fume', 
    ico: '💨', 
    label: 'مدخن / Fumé', 
    desc: 'مدخن على اليد (ديلاي 24 ساعة) / Fumé à froid sur commande (délai 24h)', 
    mult: 1.5 
  },
  
]
// const produitPret = computed(() => {
//   if (!produit.value) return null;
  
//   return {
//     ...produit.value,
//     // On ajoute les infos de la sélection actuelle
//     preparation: optionActive.value.label, 
//     prixFinal: (produit.value.prix * optionActive.value.mult).toFixed(2),
//     optionId: optionActive.value.id
//   }
// })
// // On initialise à vide ou avec une valeur sûre

// const optionsAffichees = computed(() => {
//   // 1. Sécurité : Si pas de produit, on ne montre rien ou une option par défaut
//   if (!produit.value || !produit.value.category) {
//     return optionsDecoupe.filter(o => ['entier', 'vide'].includes(o.id))
//   }

//   // 2. Nettoyage de la catégorie (minuscules, sans espaces inutiles)
//   const cat = produit.value.category.toLowerCase().trim()
// console.log("Catégorie nettoyée :", cat)
//   // 3. Logique de filtrage par "mots-clés"
  
//   // Cas : Crevettes, Gambas, Langoustes...
//   if (cat.includes('crustacé') || cat.includes('crevette') || cat.includes('fruit de mer')) {
//     return optionsDecoupe.filter(o => ['entier', 'decortique', 'mix-paella'].includes(o.id))
//   }

//   // Cas : Calamar, Seiche, Poulpe...
//   if (cat.includes('calamar') || cat.includes('seiche') || cat.includes('poulpe') || cat.includes('mollusque')) {
//     return optionsDecoupe.filter(o => ['entier', 'nettoye', 'portion'].includes(o.id))
//   }

//   // Cas : Petits poissons bleus (Sardine, Anchois...)
//   if (cat.includes('sardine') || cat.includes('anchois') || cat.includes('jurel')) {
//     return optionsDecoupe.filter(o => ['entier', 'vide', 'papillon', 'tete'].includes(o.id))
//   }

//   // Cas : Gros poissons à la découpe (Thon, Espadon...)
//   if (cat.includes('thon') || cat.includes('espadon')) {
//     return optionsDecoupe.filter(o => ['darne', 'portion', 'filet'].includes(o.id))
//   }

//   // 4. Cas par défaut (Pageot, Dorade, Loup...)
//   // On enlève les options spécifiques aux crevettes et calmars
//   return optionsDecoupe.filter(o => 
//     !['decortique', 'nettoye', 'mix-paella'].includes(o.id)
//   )
// })
//const optionActive = ref(optionsAffichees.value[0] || optionsDecoupe[0])
/* ── CONFIGURATION RADICALE DU PANIER (p) ───────────────────── */

// 1. État de la découpe (on stocke l'ID pour la stabilité)
const optionChoisieId = ref('entier')

// 2. Filtrage intelligent des options selon la catégorie du produit
const optionsAffichees = computed(() => {
  if (!produit.value || !produit.value.category) {
    return optionsDecoupe.filter(o => o.id === 'entier')
  }

  const cat = produit.value.category.toLowerCase().trim()

  // Poissons bleus
  if (cat.includes('sardine') || cat.includes('anchois') || cat.includes('jurel')) {
    return optionsDecoupe.filter(o => ['entier', 'vide', 'papillon', 'tete'].includes(o.id))
  }
  // Crustacés
  if (cat.includes('crustacé') || cat.includes('crevette') || cat.includes('fruit de mer')) {
    return optionsDecoupe.filter(o => ['entier', 'decortique', 'mix-paella'].includes(o.id))
  }
  // Céphalopodes
  if (cat.includes('calamar') || cat.includes('seiche') || cat.includes('poulpe')) {
    return optionsDecoupe.filter(o => ['entier', 'nettoye', 'portion'].includes(o.id))
  }
  // Gros poissons
  if (cat.includes('thon') || cat.includes('espadon')) {
    return optionsDecoupe.filter(o => ['darne', 'portion', 'filet'].includes(o.id))
  }

  // Par défaut (Pageot, Dorade, etc.)
  return optionsDecoupe.filter(o => !['decortique', 'nettoye', 'mix-paella', 'sashimi'].includes(o.id))
})

// 3. L'option active réelle (Sécurité si l'ID n'est plus dans la liste filtrée)
const optionActive = computed(() => {
  return optionsAffichees.value.find(o => o.id === optionChoisieId.value) || optionsAffichees.value[0]
})

// 4. L'objet "p" : TA SOURCE UNIQUE POUR LE PANIER
const p = computed(() => {
  if (!produit.value || !optionActive.value) return null

  // On crée l'objet parfait pour AddToCartBtn
  return {
    ...produit.value,
    // Prix calculé (Prix base * multiplicateur option)
    price: (Number(prixEffectif.value) * optionActive.value.mult).toFixed(2),
    // Nom enrichi avec la découpe (ex: "Sardine (فيلي)")
    name: `${produit.value.name} (${optionActive.value.label.split('/')[0].trim()})`,
    // Infos techniques pour le poissonnier
    preparation: optionActive.value.id,
    optionLabel: optionActive.value.label,
    unit: produit.value.unit
  }
})

// Reset de la sélection quand on change de fiche produit
watch(() => produit.value?.id, () => {
  optionChoisieId.value = 'entier'
}, { immediate: true })

/* ── Fin de la configuration radicale ───────────────────────── */
// // ET SURTOUT : On synchronise quand le produit change
// watch(() => produit.value?.id, () => {
//   if (optionsAffichees.value.length > 0) {
//     optionActive.value = optionsAffichees.value[0]
//   }
// }, { immediate: true })
// watchEffect(() => {
//   console.log("Catégorie détectée :", produit.value?.category)
//   console.log("Options filtrées :", optionsAffichees.value.map(o => o.id))
// })
/* ── Galerie images ─────────────────────────────────────────── */
/*
  Structure attendue: /images/poissons/{category}/vue1.jpg → vue5.jpg
  Exemple: /images/poissons/sardine/vue1.jpg
  Fallback: image depuis la base de données ou emoji SVG
*/
const galerie = computed(() => {
  // Si le produit n'est pas encore là, on retourne une image vide ou un loader
  if (!produit.value || !produit.value.category) {
    return ['/images/placeholder-loading.jpg'] 
  }
  
  const cat = produit.value.category.toLowerCase().trim().replace(/\s+/g, '-')
  
  // 1. On récupère les images de la DB (si elles existent)
  const imagesDB = produit.value.images || []
  
  // 2. On génère les chemins pour les vues "maison" (vue1, vue2, vue3)
  const vuesAuto = [1, 2, 3].map(i => `/images/poissons/${cat}/vue${i}.jpg`)

  // 3. Image de secours (Fallback) si rien ne marche
  const fallback = `/images/${cat}/jours/jours_1.jpg`

  // On fusionne : Priorité DB > Vues Auto > Fallback
  const total = [...imagesDB, ...vuesAuto, fallback]

  // On retourne une liste unique sans doublons (au cas où) et limitée à 4-5 images
  return [...new Set(total)].slice(0, 5)
})

const vueActive = computed(() => galerie.value[vueIndex.value] || galerie.value[0])

const onImgError = (e) => {
  const cat = produit.value?.category || 'Poisson'
  const emoji = emojiMap[cat] || '🐟'
  console.error("L'image suivante a échoué :", e.target.src);
  // Design du placeholder : Fond sombre dégradé avec l'emoji au centre
  const placeholder = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'>
      <defs>
        <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:%230f172a;stop-opacity:1' />
          <stop offset='100%' style='stop-color:%231e293b;stop-opacity:1' />
        </linearGradient>
      </defs>
      <rect width='600' height='450' fill='url(%23g)'/>
      <text y='55%' x='50%' font-size='120' text-anchor='middle' style='filter: drop-shadow(0px 5px 15px rgba(0,0,0,0.5))'>
        ${emoji}
      </text>
      <text y='85%' x='50%' font-size='20' font-family='sans-serif' fill='%2394a3b8' text-anchor='middle' font-weight='bold'>
        ${cat.toUpperCase()} - SamakMarket
      </text>
    </svg>
  `)}`

  e.target.src = placeholder
  // On marque l'image comme "chargée avec erreur" pour éviter de reboucler
  e.target.dataset.error = "true"
}

/* ── Emoji + slogan ─────────────────────────────────────────── */
const emojiMap = {
  'Sardine':'🐟','Thon':'🐠','Crevette':'🦐','Homard':'🦞',
  'Mérou':'🐡','Dorade':'🐠','Calamar':'🦑','Poulpe':'🐙',
  'Capitaine':'🐟','Sole':'🐟','sardine':'🐟',
}
const emojiProduit = computed(() => emojiMap[produit.value?.category] || '🐟')

const slogans = [
  'Encore vivant ce matin 😅', 'Direct du filet !',
  'Mon poisson > ton poisson', 'Certifié par le pêcheur',
  'Sorti de l\'eau avant toi', 'Frais ou remboursé 🤝',
]
const sloganPecheur = computed(() => slogans[produit.value?.id % slogans.length] || slogans[0])

/* ── Prix ───────────────────────────────────────────────────── */
const prixEffectif = computed(() =>
  produit.value?.is_flash && produit.value?.flash_price
    ? produit.value.flash_price
    : produit.value?.price
)

/* Prix ajusté avec multiplicateur option */
const prixAvecOption = computed(() =>
  Math.round(Number(prixEffectif.value) * optionActive.value.mult * 100) / 100
)

const totalEstime = computed(() =>
  (prixAvecOption.value * qte.value).toLocaleString('fr-FR')
)

/* Produit enrichi avec option pour ATP_BTN */
const produitAvecOption = computed(() => ({
  ...produit.value,
  price: prixAvecOption.value,
  name:  `${produit.value?.name} (${optionActive.value.label})`,
}))

/* ── Fraîcheur ──────────────────────────────────────────────── */
const estFraisAujourdhui = computed(() => {
  if (!produit.value?.createdAt) return false
  return new Date(produit.value.createdAt).toDateString() === new Date().toDateString()
})
const produitPourPanier = computed(() => {
  if (!produit.value || !optionActive.value) return null;

  return {
    ...produit.value,
    // IMPORTANT: On écrase le prix par le prix calculé (multiplicateur)
    price: (produit.value.price * optionActive.value.mult).toFixed(2),
    // On modifie le nom pour que le client voie la découpe dans son panier
    name: `${produit.value.name} (${optionActive.value.label.split('/')[0].trim()})`,
    // On ajoute une info de préparation pour le backend
    preparation: optionActive.value.id 
  };
});
/* ── WhatsApp message complet avec options ──────────────────── */
const SAMAK_WA = '212647689006'
const lienWhatsApp = computed(() => {
  if (!produit.value) return '#'
  const num = (produit.value.seller?.whatsapp || SAMAK_WA).replace(/[\s\-\+\(\)]/g, '')
  const msg = encodeURIComponent(
    `سلام SamakMarket 🐟\n` +
    `كنبغي: *${produit.value.name}*\n` +
    `🔪 Préparation: ${optionActive.value.label} ${optionActive.value.ico}\n` +
    `📦 Quantité: ${qte.value} ${produit.value.unit}\n` +
    `💰 Prix: ${prixAvecOption.value} MAD/${produit.value.unit}\n` +
    `💵 Total estimé: ${totalEstime.value} MAD\n` +
    `📍 ${produit.value.city}\n` +
    `🆔 ref:${produit.value.id}`
  )
  return `https://wa.me/${num}?text=${msg}`
})

/* ── Partage ────────────────────────────────────────────────── */
const partagerWA = () => {
  const msg = encodeURIComponent(`🐟 ${produit.value?.name} — ${prixEffectif.value} MAD/${produit.value?.unit}\n${window.location.href}`)
  window.open(`https://wa.me/?text=${msg}`, '_blank')
}

const copierLien = async () => {
  await navigator.clipboard.writeText(window.location.href)
  /* OPTIONNEL: toast copié */
}

/* ── Toast ──────────────────────────────────────────────────── */
const onAdded = ({ produit: p }) => {
  dernierAjoute.value = p
  toastVisible.value  = true
  setTimeout(() => { toastVisible.value = false }, 2500)
}

/* ── Chargement données ─────────────────────────────────────── */
onMounted(async () => {
  try {
    const { data } = await api.get(`/products/${route.params.id}`)
    produit.value = data.produit

    /* SEO: JSON-LD schema.org Product */
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: produit.value?.name,
      description: produit.value?.description,
      category: produit.value?.category,
      offers: {
        '@type': 'Offer',
        price: produit.value?.price,
        priceCurrency: 'MAD',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Person', name: produit.value?.seller?.name }
      }
    })
    document.head.appendChild(script)

    /* Charge autres articles du vendeur */
    if (produit.value?.seller_id) {
      const res = await api.get('/products', {
        params: {
          seller_id:    produit.value.seller_id,
          limit:        6,
          is_available: true,
          sort:         'updated_at',
        }
      })
      autresProduits.value = (res.data.produits || [])
        .filter(p => p.id !== produit.value.id)
        .slice(0, 5)
    }
  } catch (e) {
    console.error('Erreur produit:', e)
    produit.value = null
  } finally {
    chargement.value = false
  }
})
</script>

<style scoped>
/* ══ Variables — cohérent avec ProductCard ═══════════════════ */
.pdv {
  --ocean:  #020e23;
  --surf:   #061428;
  --deep:   #040f20;
  --or:     #d4af37;
  --or2:    #f5d57a;
  --cyan:   #0dcaf0;
  --vert:   #25d366;
  --rouge:  #f87171;
  min-height: 100vh;
  background: var(--ocean);
  color: white;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Loading ────────────────────────────────────────────────── */
.pdv-loading { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:16px; }
.loading-fish { font-size:4rem; animation: swim 1.2s ease-in-out infinite; }
@keyframes swim { 0%,100%{transform:translateX(0) rotate(0);} 25%{transform:translateX(12px) rotate(6deg);} 75%{transform:translateX(-12px) rotate(-6deg);} }
.loading-txt { color:rgba(255,255,255,.3); font-size:.9rem; }

/* ── Not found ──────────────────────────────────────────────── */
.pdv-notfound { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; gap:12px; }
.nf-ico { font-size:3.5rem; }
.nf-txt { color:rgba(255,255,255,.4); }
.nf-link { color:var(--cyan); text-decoration:none; font-size:.88rem; }

/* ── Main ───────────────────────────────────────────────────── */
.pdv-main { max-width:1100px; margin:0 auto; padding:16px 16px 40px; }

/* Breadcrumb */
.breadcrumb { display:flex; align-items:center; gap:6px; margin-bottom:20px; flex-wrap:wrap; }
.bc-link { color:rgba(255,255,255,.3); font-size:.75rem; text-decoration:none; transition:color .2s; }
.bc-link:hover { color:var(--cyan); }
.bc-sep { color:rgba(255,255,255,.15); font-size:.75rem; }
.bc-current { color:rgba(255,255,255,.6); font-size:.75rem; font-weight:600; }

/* Grid 2 colonnes */
.pdv-grid { display:grid; grid-template-columns:1fr 1fr; gap:28px; }

/* ══ GALERIE ════════════════════════════════════════════════ */
.galerie-col { display:flex; flex-direction:column; gap:12px; }

.img-main-wrap {
  position:relative; border-radius:20px; overflow:hidden;
  background:linear-gradient(135deg,#061428,#0d2040);
  aspect-ratio:4/3; cursor:zoom-in;
}
.img-main { width:100%; height:100%; object-fit:cover; display:block; }

/* Transitions image */
.img-fade-enter-active,.img-fade-leave-active { transition:opacity .3s ease; }
.img-fade-enter-from,.img-fade-leave-to { opacity:0; }

/* Badges — même style ProductCard */
.pc-badges { position:absolute; top:12px; left:12px; z-index:3; display:flex; flex-direction:column; gap:5px; }
.pc-badge { font-size:.58rem; font-weight:900; letter-spacing:.1em; padding:3px 8px; border-radius:99px; display:inline-flex; align-items:center; gap:3px; backdrop-filter:blur(8px); }
.pc-flash { background:rgba(251,191,36,.2); border:1px solid rgba(251,191,36,.4); color:#fbbf24; }
.pc-promo  { background:rgba(248,113,113,.15); border:1px solid rgba(248,113,113,.3); color:#f87171; }
.pc-frais  { background:rgba(13,202,240,.12); border:1px solid rgba(13,202,240,.25); color:var(--cyan); }

/* Watermark */
.pc-watermark { position:absolute; bottom:10px; right:10px; z-index:2; opacity:.2; pointer-events:none; mix-blend-mode:screen; }
.pc-wm-logo { width:32px; height:32px; object-fit:contain; filter:brightness(10); }

/* Vues count */
.img-vues { position:absolute; bottom:10px; left:12px; z-index:2; display:flex; align-items:center; gap:4px; background:rgba(0,0,0,.5); backdrop-filter:blur(8px); color:rgba(255,255,255,.5); font-size:.65rem; padding:3px 9px; border-radius:99px; }

/* Flèches navigation */
.img-nav {
  position:absolute; top:50%; transform:translateY(-50%); z-index:5;
  width:36px; height:36px; border-radius:50%;
  background:rgba(0,0,0,.5); backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,.15); color:white;
  font-size:1.3rem; cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:all .2s;
}
.img-nav:hover { background:rgba(0,0,0,.7); }
.img-prev { left:10px; }
.img-next { right:10px; }

/* Thumbnails */
.thumbnails { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; }
.thumbnails::-webkit-scrollbar { display:none; }
.thumb { width:64px; height:64px; flex-shrink:0; border-radius:10px; overflow:hidden; border:2px solid transparent; cursor:pointer; transition:border-color .2s; background:var(--surf); }
.thumb-on { border-color:var(--cyan); }
.thumb-img { width:100%; height:100%; object-fit:cover; }

/* Share */
.share-row { display:flex; align-items:center; gap:8px; }
.share-lbl { color:rgba(255,255,255,.25); font-size:.72rem; }
.share-btn { width:32px; height:32px; border-radius:50%; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.share-btn:hover { background:rgba(255,255,255,.1); }

/* ══ INFOS COLONNE ══════════════════════════════════════════ */
.infos-col { display:flex; flex-direction:column; gap:18px; }

/* Catégorie */
.infos-cat { display:flex; align-items:center; gap:6px; }
.cat-emoji { font-size:1rem; }
.cat-label { color:rgba(255,255,255,.3); font-size:.65rem; text-transform:uppercase; letter-spacing:.1em; }
.cat-slogan { margin-left:auto; color:rgba(13,202,240,.5); font-size:.6rem; font-style:italic; }

/* Nom H1 */
.pdv-nom { font-size:1.6rem; font-weight:900; color:white; line-height:1.2; margin:0; }

/* Lieu */
.pdv-lieu { display:flex; align-items:center; gap:5px; color:rgba(255,255,255,.35); font-size:.78rem; }
.pdv-fraicheur { color:var(--cyan); font-size:.72rem; }

/* Prix */
.prix-bloc { display:flex; align-items:baseline; gap:8px; flex-wrap:wrap; padding:14px 16px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; }
.prix-ancien { color:rgba(255,255,255,.3); text-decoration:line-through; font-size:.9rem; }
.prix-val    { color:var(--or2); font-size:2rem; font-weight:900; line-height:1; }
.prix-unite  { color:rgba(255,255,255,.3); font-size:.78rem; align-self:flex-end; padding-bottom:3px; }
.reduction-badge { margin-left:auto; background:rgba(248,113,113,.15); border:1px solid rgba(248,113,113,.25); color:#f87171; font-size:.75rem; font-weight:900; padding:4px 10px; border-radius:8px; }

/* ══ OPTIONS DÉCOUPE ════════════════════════════════════════ */
.options-section { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:14px; padding:14px; }
.options-titre { color:white; font-size:.85rem; font-weight:700; margin-bottom:4px; }
.options-sous  { display:block; color:rgba(255,255,255,.25); font-size:.68rem; font-weight:400; margin-top:2px; }
.options-grid {
  display: grid;
  /* On descend à 85px pour en caser plus sur une ligne mobile */
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
  gap: 8px;
  margin: 10px 0;
}

.opt-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Centre verticalement le contenu */
  gap: 4px;
  padding: 10px 4px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 1 / 1; /* Force la forme carrée parfaite */
}

/* Correction du Hover : On évite le blanc total qui cache le texte */
.opt-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px); /* Petit effet de levée */
}

.opt-on {
  background: rgba(13, 202, 240, 0.12) !important;
  border-color: #0dcaf0 !important; /* Ton Cyan */
  color: #0dcaf0 !important;
  box-shadow: 0 4px 12px rgba(13, 202, 240, 0.15);
}

.opt-ico {
  font-size: 1.4rem; /* Légèrement plus grand pour le visuel */
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.opt-label {
  font-size: 0.6rem; /* Très compact pour le bilingue */
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.opt-prix-adj {
  font-size: 0.55rem;
  color: #fbbf24; /* Jaune ambre plus vif */
  font-weight: 800;
  background: rgba(251, 191, 36, 0.1);
  padding: 1px 4px;
  border-radius: 4px;
}

/* Description active plus lisible */
.opt-desc-active {
  color: #38bdf8; /* Un bleu ciel plus doux */
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.4;
  margin-top: 12px;
  padding: 8px;
  background: rgba(56, 189, 248, 0.05);
  border-radius: 8px;
  border-left: 3px solid #38bdf8;
}

/* ── Quantité ───────────────────────────────────────────────── */
.qte-section { display:flex; flex-direction:column; gap:8px; }
.qte-wrap { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:8px 14px; width:fit-content; }
.qte-btn { width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); color:white; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
.qte-btn:hover:not(:disabled) { background:rgba(13,202,240,.15); border-color:rgba(13,202,240,.3); }
.qte-btn:disabled { opacity:.3; cursor:not-allowed; }
.qte-val  { color:white; font-size:1.1rem; font-weight:800; min-width:28px; text-align:center; }
.qte-unit { color:rgba(255,255,255,.3); font-size:.78rem; }
.qte-total { color:rgba(255,255,255,.4); font-size:.8rem; }
.qte-total strong { color:var(--or2); font-size:1rem; }

/* ── CTA ────────────────────────────────────────────────────── */
.cta-group { display:flex; flex-direction:column; gap:10px; }
.btn-wa {
  display:flex; align-items:center; justify-content:center; gap:8px;
  background:linear-gradient(135deg,#075e54,#25d366);
  color:white; text-decoration:none; font-weight:800; font-size:.88rem;
  padding:14px 20px; border-radius:14px;
  box-shadow:0 4px 20px rgba(37,211,102,.25); transition:all .2s;
}
.btn-wa:hover { filter:brightness(1.1); transform:translateY(-1px); }
.cta-row-2 { display:flex; gap:8px; align-items:center; }
.btn-tel {
  display:flex; align-items:center; justify-content:center; gap:6px;
  background:rgba(13,202,240,.1); border:1px solid rgba(13,202,240,.2);
  color:var(--cyan); text-decoration:none; font-weight:700; font-size:.82rem;
  padding:10px 16px; border-radius:12px; transition:all .2s; white-space:nowrap;
}
.btn-tel:hover { background:rgba(13,202,240,.18); }
.btn-favori { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); cursor:pointer; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.4); transition:all .2s; }
.favori-on { background:rgba(248,113,113,.1) !important; border-color:rgba(248,113,113,.3) !important; color:#f87171 !important; }

/* ── Description ────────────────────────────────────────────── */
.description-bloc { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); border-radius:14px; padding:16px; }
.bloc-titre { color:rgba(255,255,255,.4); font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; }
.bloc-titre-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
.desc-txt { color:rgba(255,255,255,.6); font-size:.85rem; line-height:1.7; margin:8px 0 0; }

/* ── Vendeur ────────────────────────────────────────────────── */
.vendeur-bloc { background:rgba(212,175,55,.04); border:1px solid rgba(212,175,55,.1); border-radius:14px; padding:14px; }
.vendeur-count-badge { background:rgba(13,202,240,.1); border:1px solid rgba(13,202,240,.2); color:var(--cyan); font-size:.65rem; font-weight:700; padding:3px 10px; border-radius:99px; }
.vendeur-card { display:flex; align-items:center; gap:12px; }
.vendeur-av { width:40px; height:40px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,var(--or),var(--or2)); color:#020e23; font-weight:900; font-size:.9rem; display:flex; align-items:center; justify-content:center; }
.vendeur-nom  { color:white; font-size:.85rem; font-weight:700; }
.vendeur-lieu { color:rgba(255,255,255,.3); font-size:.72rem; margin-top:2px; }

/* Tags SEO */
.tags-seo { display:flex; flex-wrap:wrap; gap:6px; }
.tag { color:rgba(255,255,255,.2); font-size:.65rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); padding:3px 10px; border-radius:99px; }

/* ══ AUTRES PRODUITS ════════════════════════════════════════ */
.autres-section { margin-top:40px; }
.autres-titre { color:white; font-size:1rem; font-weight:800; margin-bottom:4px; }
.autres-sous  { display:block; color:rgba(255,255,255,.25); font-size:.72rem; font-weight:400; margin-bottom:16px; }
.autres-liste { display:flex; flex-direction:column; gap:8px; }

.autre-card { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:12px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); transition:background .2s; }
.autre-card:hover { background:rgba(255,255,255,.06); }
.autre-img-wrap { width:52px; height:52px; border-radius:10px; overflow:hidden; flex-shrink:0; background:var(--surf); display:block; }
.autre-img { width:100%; height:100%; object-fit:cover; }
.autre-info { flex:1; min-width:0; }
.autre-nom  { color:white; font-size:.82rem; font-weight:700; text-decoration:none; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.autre-nom:hover { color:var(--cyan); }
.autre-prix { color:var(--or2); font-size:.78rem; font-weight:700; margin-top:2px; }
.autre-unite { color:rgba(255,255,255,.3); font-size:.65rem; font-weight:400; }
.autre-btns { display:flex; gap:6px; align-items:center; flex-shrink:0; }
.btn-voir { padding:5px 12px; border-radius:8px; font-size:.72rem; font-weight:700; background:rgba(13,202,240,.08); border:1px solid rgba(13,202,240,.2); color:var(--cyan); text-decoration:none; transition:all .2s; white-space:nowrap; }
.btn-voir:hover { background:rgba(13,202,240,.15); }

/* ── Toast ──────────────────────────────────────────────────── */
.pdv-toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); background:rgba(5,46,22,.95); border:1px solid rgba(22,101,52,.8); color:#4ade80; font-size:.82rem; font-weight:700; padding:10px 20px; border-radius:99px; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,.4); z-index:9999; }
.toast-pdv-enter-active,.toast-pdv-leave-active { transition:all .3s ease; }
.toast-pdv-enter-from,.toast-pdv-leave-to { opacity:0; transform:translateX(-50%) translateY(8px); }

/* Back link */
.pdv-back { display:block; text-align:center; padding:20px; color:rgba(255,255,255,.2); font-size:.82rem; text-decoration:none; transition:color .2s; }
.pdv-back:hover { color:var(--cyan); }

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .pdv-grid  { grid-template-columns:1fr; gap:20px; }
  .pdv-nom   { font-size:1.3rem; }
  .prix-val  { font-size:1.6rem; }
  .options-grid { grid-template-columns:repeat(4,1fr); }
  .btn-wa    { font-size:.82rem; padding:12px; }
  .cat-slogan { display:none; }
}
@media (max-width: 420px) {
  .options-grid { grid-template-columns:repeat(3,1fr); }
  .cta-row-2 { flex-wrap:wrap; }
}
</style>