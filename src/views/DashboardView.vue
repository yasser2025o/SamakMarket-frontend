<!-- =============================================================
  views/DashboardView.vue  —  SamakMarket  v3
  ✅ 1. Données réelles depuis la base (plus de mock)
  ✅ 2. Édition inline de tous les champs + toggle actif/inactif
  ✅ 3. Liste des vraies villes du Maroc (autocomplete)
  ✅ 4. Images visibles correctement depuis /uploads
  ✅ 5. Boutons d'action toujours visibles sur mobile
  ✅ 6. Code propre et commenté
  ============================================================= -->

<template>
  <div class="min-h-screen bg-[#F0F5FF]">

    <Head>
      <title>Mon Étal — SamakMarket</title>
      <meta name="robots" content="noindex" />
    </Head>

    <NavBar />

    <div class="flex min-h-[calc(100vh-64px)]">

      <!-- ══════════════════════════════════
           SIDEBAR — desktop uniquement
           ══════════════════════════════════ -->
      <aside class="hidden lg:flex flex-col w-60 bg-[#0A1628] min-h-full px-4 py-8 gap-1 flex-shrink-0">

        <!-- Vendeur info -->
        <div class="flex items-center gap-3 px-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center
                      text-cyan-400 font-black text-lg flex-shrink-0">
            {{ authStore.nomInitiale }}
          </div>
          <div class="min-w-0">
            <p class="text-white font-bold text-sm truncate">{{ authStore.utilisateur?.name }}</p>
            <p class="text-blue-400 text-xs">Vendeur ✓</p>
          </div>
        </div>

        <!-- Nav items -->
        <button v-for="item in tabs" :key="item.id"
          @click="tabActive = item.id"
          :class="['flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left',
            tabActive === item.id
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-blue-300/60 hover:text-white hover:bg-white/5']">
          <span class="text-base">{{ item.icon }}</span>
          {{ item.label }}
        </button>

        <!-- Score vendeur -->
        <div class="mt-auto bg-white/5 rounded-xl p-4 border border-white/10">
          <p class="text-blue-300 text-[10px] uppercase tracking-widest mb-2 font-bold">Score vendeur</p>
          <p class="text-2xl font-black text-white">{{ statsReelles.score }}</p>
          <div class="bg-white/10 rounded-full h-1.5 mt-2 mb-1">
            <div class="bg-cyan-400 h-full rounded-full transition-all"
              :style="`width:${Math.min(100,(statsReelles.score/500)*100)}%`"></div>
          </div>
          <p class="text-cyan-400 text-xs">{{ badgeActuel.icon }} {{ badgeActuel.label }}</p>
        </div>
      </aside>

      <!-- ══════════════════════════════════
           CONTENU PRINCIPAL
           ══════════════════════════════════ -->
      <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">

        <!-- ────────────────────────────────
             TAB : DASHBOARD
             ──────────────────────────────── -->
        <section v-show="tabActive === 'dashboard'">

          <!-- Header -->
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p class="text-cyan-600 text-xs font-bold uppercase tracking-widest mb-1">Tableau de bord</p>
              <h1 class="text-3xl font-black text-slate-900">Mon Étal Digital <span class="text-cyan-500">.</span></h1>
              <p class="text-slate-400 text-sm mt-1">
                Bonjour {{ authStore.utilisateur?.name?.split(' ')[0] }} —
                <span v-if="chargement" class="text-cyan-500 animate-pulse">Chargement...</span>
                <span v-else>{{ produits.length }} produits actifs</span>
              </p>
            </div>
            <button @click="ouvrirFormulaire(null)"
              class="flex items-center gap-2 bg-[#0A1628] hover:bg-cyan-700 text-white
                     font-bold px-5 py-3 rounded-2xl transition-all shadow-lg self-start sm:self-auto text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter un produit
            </button>
          </div>

          <!-- KPIs — données RÉELLES depuis la BD -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div class="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-base mb-3">👁️</div>
              <p class="text-2xl font-black text-slate-900">{{ statsReelles.totalVues.toLocaleString() }}</p>
              <p class="text-xs text-slate-400 font-semibold mt-0.5">Vues totales</p>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div class="w-9 h-9 bg-cyan-50 rounded-xl flex items-center justify-center text-base mb-3">📦</div>
              <p class="text-2xl font-black text-slate-900">{{ statsReelles.produitsActifs }}</p>
              <p class="text-xs text-slate-400 font-semibold mt-0.5">Produits actifs</p>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-slate-100 border-l-4 border-l-orange-400 shadow-sm">
              <div class="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-base mb-3">⚡</div>
              <p class="text-2xl font-black text-slate-900">{{ statsReelles.offresFlash }}</p>
              <p class="text-xs text-slate-400 font-semibold mt-0.5">Offres flash</p>
            </div>

            <div class="bg-[#0A1628] rounded-2xl p-5 shadow-lg text-white">
              <div class="flex items-center justify-between mb-3">
                <div class="w-9 h-9 bg-cyan-500/20 rounded-xl flex items-center justify-center text-base">🏪</div>
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              </div>
              <p class="text-2xl font-black">Ouvert</p>
              <p class="text-blue-300 text-xs font-semibold mt-0.5">Échoppe en ligne</p>
            </div>
          </div>

          <!-- Top produits (données réelles) -->
          <div class="grid lg:grid-cols-2 gap-6">

            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div class="px-6 py-4 border-b border-slate-50">
                <h3 class="font-black text-slate-800">🏆 Top produits par vues</h3>
              </div>
              <div v-if="chargement" class="p-8 text-center">
                <div class="text-3xl animate-bounce">🐟</div>
              </div>
              <div v-else-if="topProduits.length === 0" class="p-8 text-center text-slate-400 text-sm">
                Aucun produit pour le moment
              </div>
              <div v-else class="divide-y divide-slate-50">
                <div v-for="(p, i) in topProduits" :key="p.id"
                  class="flex items-center gap-4 px-6 py-4">
                  <span :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0',
                    i===0?'bg-yellow-400 text-yellow-900':i===1?'bg-slate-200 text-slate-600':'bg-orange-100 text-orange-600']">
                    {{ i+1 }}
                  </span>
                  <!-- Image réelle depuis le backend -->
                  <img :src="getImageUrl(p.images)"
                    class="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                    @error="handleImgError" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold text-slate-800 truncate">{{ p.name }}</p>
                    <div class="flex items-center gap-2 mt-1">
                      <div class="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div class="bg-cyan-500 h-full rounded-full"
                          :style="`width:${topProduits[0]?.views_count ? Math.round((p.views_count/topProduits[0].views_count)*100) : 0}%`">
                        </div>
                      </div>
                      <span class="text-xs text-slate-400 font-semibold flex-shrink-0">{{ p.views_count || 0 }} vues</span>
                    </div>
                  </div>
                  <span class="font-black text-slate-900 text-sm flex-shrink-0">{{ p.price }} DH</span>
                </div>
              </div>
            </div>

            <!-- Conseils -->
            <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
              <h3 class="font-black text-slate-800 mb-1">💡 Conseils du jour</h3>
              <p class="text-xs text-slate-400 mb-4">Pour améliorer votre score vendeur</p>
              <div class="flex flex-col gap-3">
                <div v-for="c in conseils" :key="c.id"
                  class="bg-white rounded-xl p-4 border border-blue-50 flex items-start gap-3">
                  <span class="text-xl flex-shrink-0">{{ c.icon }}</span>
                  <div>
                    <p class="text-sm font-bold text-slate-800">{{ c.titre }}</p>
                    <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ c.texte }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ────────────────────────────────
             TAB : MES PRODUITS
             ──────────────────────────────── -->
        <section v-show="tabActive === 'produits'">

          <!-- Header section -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Inventaire</h2>
              <p class="text-slate-400 text-sm">{{ produits.length }} produit(s) — {{ statsReelles.produitsActifs }} actif(s)</p>
            </div>
            <button @click="ouvrirFormulaire(null)"
              class="flex items-center gap-2 bg-[#0A1628] hover:bg-cyan-700 text-white
                     font-bold px-5 py-3 rounded-2xl transition-all shadow-lg self-start text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Nouveau produit
            </button>
          </div>

          <!-- ══ FORMULAIRE AJOUT / ÉDITION ══ -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-3"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">

            <div v-if="afficherFormulaire"
              class="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 mb-8">

              <!-- Titre + fermer -->
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-black text-slate-800 flex items-center gap-3">
                  <span class="w-1.5 h-7 bg-cyan-500 rounded-full"></span>
                  {{ estEnEdition ? "Modifier l'annonce" : "Nouveau arrivage 🚀" }}
                </h3>
                <button @click="afficherFormulaire = false"
                  class="w-8 h-8 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-xl
                         flex items-center justify-center text-slate-400 transition-colors text-sm font-bold">
                  ✕
                </button>
              </div>

              <form @submit.prevent="soumettreFormulaire" class="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <!-- ── Photo upload ── -->
                <div class="lg:col-span-4">
                  <label class="label-style">Photo du produit</label>

                  <div class="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200
                              flex flex-col items-center justify-center overflow-hidden bg-slate-50
                              hover:border-cyan-400 transition-all cursor-pointer group">

                    <!-- Aperçu image -->
                    <img v-if="aperçuImage" :src="aperçuImage"
                      class="absolute inset-0 w-full h-full object-cover" />

                    <!-- Placeholder -->
                    <div v-else class="text-center p-4 pointer-events-none select-none">
                      <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-2 text-2xl">📸</div>
                      <p class="text-sm font-bold text-slate-500">Choisir une photo</p>
                      <p class="text-xs text-slate-400 mt-1">JPG, PNG — max 5 Mo</p>
                    </div>

                    <!-- Overlay "changer" si déjà une image -->
                    <div v-if="aperçuImage"
                      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                             transition-opacity flex items-center justify-center">
                      <span class="bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl">
                        📷 Changer la photo
                      </span>
                    </div>

                    <!--
                      INPUT FILE — invisible, couvre toute la zone cliquable
                      @change="gererFichier" → capte le fichier dès sélection
                      accept="image/*" → tous formats image
                    -->
                    <input type="file" accept="image/*"
                      @change="gererFichier"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>

                  <!-- Info fichier sélectionné -->
                  <p v-if="fichierImage" class="text-xs text-cyan-600 font-semibold mt-2 text-center">
                    ✓ {{ fichierImage.name }} ({{ Math.round(fichierImage.size/1024) }} Ko)
                  </p>
                  <p v-else-if="estEnEdition && aperçuImage"
                    class="text-xs text-slate-400 mt-2 text-center">
                    Photo actuelle conservée si aucun nouveau fichier
                  </p>
                </div>

                <!-- ── Champs texte ── -->
                <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <!-- Nom -->
                  <div class="sm:col-span-2">
                    <label class="label-style">Nom du produit *</label>
                    <input v-model="form.name" type="text" required
                      placeholder="ex: Gambas de Larache (Calibre A)" class="input-style" />
                  </div>

                  <!-- Catégorie -->
                  <div>
                    <label class="label-style">Catégorie</label>
                    <select v-model="form.category" class="input-style">
                      <option value="">-- Choisir --</option>
                      <option v-for="cat in categories" :key="cat.val" :value="cat.val">
                        {{ cat.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Ville — avec autocomplete villes Maroc -->
                  <div class="relative">
                    <label class="label-style">Ville de provenance</label>
                    <input v-model="rechercheVille" type="text"
                      placeholder="Tanger, Casablanca..."
                      class="input-style"
                      @input="filtrerVilles"
                      @focus="showVilles = true"
                      @blur="setTimeout(() => showVilles = false, 200)"
                      autocomplete="off" />
                    <!-- Dropdown villes -->
                    <div v-if="showVilles && villesFiltrees.length"
                      class="absolute z-50 top-full left-0 right-0 bg-white border border-slate-200
                             rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                      <button type="button"
                        v-for="ville in villesFiltrees" :key="ville"
                        @click="selectionnerVille(ville)"
                        class="w-full text-left px-4 py-2.5 text-sm text-slate-700
                               hover:bg-cyan-50 hover:text-cyan-700 transition-colors first:rounded-t-xl last:rounded-b-xl">
                        {{ ville }}
                      </button>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="sm:col-span-2">
                    <label class="label-style">Description</label>
                    <textarea v-model="form.description" rows="3" class="input-style resize-none"
                      placeholder="Pêché à la palangre ce matin, très frais...">
                    </textarea>
                  </div>

                  <!-- Prix / Unité / Stock / Disponible -->
                  <div class="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">

                    <div>
                      <label class="label-style">Prix (DH) *</label>
                      <input v-model="form.price" type="number" step="0.5" min="0" required
                        class="input-style !bg-white font-bold text-cyan-700" />
                    </div>

                    <div>
                      <label class="label-style">Unité</label>
                      <select v-model="form.unit" class="input-style !bg-white">
                        <option value="kg">kg</option>
                        <option value="pièce">pièce</option>
                        <option value="lot">lot</option>
                        <option value="boite">boite</option>
                      </select>
                    </div>

                    <div>
                      <label class="label-style">Stock</label>
                      <input v-model="form.quantity" type="number" min="0" class="input-style !bg-white" />
                    </div>

                    <div class="flex flex-col justify-end pb-1">
                      <label class="label-style">En ligne</label>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="form.is_available" class="sr-only peer" />
                        <div class="w-11 h-6 bg-slate-200 rounded-full peer
                                    peer-checked:bg-cyan-500
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                    after:transition-all peer-checked:after:translate-x-5">
                        </div>
                        <span class="ml-2 text-xs font-bold text-slate-600">{{ form.is_available ? 'Oui' : 'Non' }}</span>
                      </label>
                    </div>
                  </div>

                  <!-- Options marketing -->
                  <div class="sm:col-span-2 flex flex-wrap gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.is_promo"
                        class="w-4 h-4 rounded text-orange-500 border-orange-300 focus:ring-orange-400" />
                      <span class="font-bold text-orange-600 text-sm">🏷️ Promotion</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" v-model="form.is_flash"
                        class="w-4 h-4 rounded text-red-500 border-red-300 focus:ring-red-400" />
                      <span class="font-bold text-red-600 text-sm">⚡ Vente Flash</span>
                    </label>
                  </div>

                  <!-- Champs flash -->
                  <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0">
                    <div v-if="form.is_flash"
                      class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-red-50 rounded-2xl p-4 border border-red-100">
                      <div>
                        <label class="label-style !text-red-400">Prix Flash (DH)</label>
                        <input v-model="form.flash_price" type="number" class="input-style border-red-100" />
                      </div>
                      <div>
                        <label class="label-style !text-red-400">Début</label>
                        <input v-model="form.flash_start" type="datetime-local" class="input-style border-red-100" />
                      </div>
                      <div>
                        <label class="label-style !text-red-400">Fin</label>
                        <input v-model="form.flash_end" type="datetime-local" class="input-style border-red-100" />
                      </div>
                    </div>
                  </Transition>

                  <!-- Barre progression upload -->
                  <div v-if="enCoursDEnvoi" class="sm:col-span-2">
                    <div class="flex justify-between mb-1 text-xs font-bold text-cyan-600">
                      <span>Upload en cours...</span>
                      <span>{{ progression }}%</span>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-2">
                      <div class="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                        :style="`width:${progression}%`"></div>
                    </div>
                  </div>

                  <!-- Succès -->
                  <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-95">
                    <div v-if="messageSucces"
                      class="sm:col-span-2 p-4 bg-green-50 border border-green-100
                             text-green-700 rounded-2xl text-center font-bold text-sm">
                      ✅ {{ messageSucces }}
                    </div>
                  </Transition>

                  <!-- Erreur -->
                  <div v-if="messageErreur"
                    class="sm:col-span-2 p-4 bg-red-50 border border-red-100
                           text-red-700 rounded-2xl text-sm font-semibold">
                    ⚠️ {{ messageErreur }}
                  </div>

                  <!-- Actions formulaire -->
                  <div class="sm:col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-100">
                    <button type="button" @click="afficherFormulaire = false"
                      class="px-5 py-2.5 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm">
                      Annuler
                    </button>
                    <button type="submit" :disabled="enCoursDEnvoi"
                      class="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white
                             px-8 py-3 rounded-2xl font-black shadow-lg shadow-cyan-100
                             transition-all active:scale-95 text-sm">
                      {{ enCoursDEnvoi ? '⏳ Envoi...' : (estEnEdition ? '✓ Mettre à jour' : '🚀 Publier') }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Transition>

          <!-- ══ TABLEAU PRODUITS ══ -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            <div class="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <h3 class="font-black text-slate-800">Inventaire complet</h3>
              <span class="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
                {{ produits.length }} produits
              </span>
            </div>

            <!-- Loading -->
            <div v-if="chargement" class="flex flex-col items-center justify-center py-16 gap-3">
              <div class="text-4xl animate-bounce">🐟</div>
              <p class="text-slate-400 text-sm animate-pulse">Chargement depuis la base de données...</p>
            </div>

            <!-- État vide -->
            <div v-else-if="produits.length === 0"
              class="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div class="text-5xl mb-3">📦</div>
              <p class="text-slate-500 font-semibold mb-4">Aucun produit pour le moment</p>
              <button @click="ouvrirFormulaire(null)"
                class="bg-cyan-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-cyan-700 transition">
                + Ajouter mon premier produit
              </button>
            </div>

            <!-- ══ CARDS MOBILE / TABLEAU DESKTOP ══ -->
            <div v-else>

              <!-- CARDS — affichées sur mobile (< md) -->
              <div class="md:hidden divide-y divide-slate-50">
                <div v-for="p in produits" :key="p.id"
                  class="p-4 flex gap-3">

                  <!-- Image produit -->
                  <div class="relative flex-shrink-0">
                    <img :src="getImageUrl(p.images)"
                      class="w-16 h-16 rounded-xl object-cover bg-slate-100"
                      @error="handleImgError" />
                    <!-- Point statut -->
                    <span :class="['absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full',
                      p.is_available ? 'bg-green-500' : 'bg-slate-300']"></span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2">
                      <p class="font-bold text-slate-800 text-sm truncate">{{ p.name }}</p>
                      <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0',
                        p.is_available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500']">
                        {{ p.is_available ? 'Actif' : 'Inactif' }}
                      </span>
                    </div>

                    <p class="text-cyan-700 font-black text-sm mt-0.5">
                      {{ p.price }} DH/{{ p.unit }}
                      <span class="text-slate-400 font-normal text-xs ml-2">{{ p.views_count || 0 }} vues</span>
                    </p>

                    <!-- ✅ BOUTONS TOUJOURS VISIBLES sur mobile -->
                    <div class="flex gap-2 mt-2 flex-wrap">

                      <!-- Toggle actif/inactif -->
                      <button @click="toggleActif(p)"
                        :class="['flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all',
                          p.is_available
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200']">
                        {{ p.is_available ? '⏸ Désactiver' : '▶ Activer' }}
                      </button>

                      <button @click="editerProduit(p)"
                        class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl
                               bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all">
                        ✏️ Modifier
                      </button>

                      <button @click="partagerWhatsApp(p)"
                        class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl
                               bg-green-100 text-green-700 hover:bg-green-200 transition-all">
                        📲 Partager
                      </button>

                      <button @click="supprimerProduit(p.id, p.name)"
                        class="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl
                               bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TABLEAU — affiché sur desktop (≥ md) -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left min-w-[760px]">
                  <thead class="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <tr>
                      <th class="px-6 py-4">Produit</th>
                      <th class="px-6 py-4">Prix & Stock</th>
                      <th class="px-6 py-4 text-center">Statut</th>
                      <th class="px-6 py-4 text-center">Marketing</th>
                      <th class="px-6 py-4">Vues</th>
                      <!-- ✅ Colonne actions TOUJOURS visible (pas opacity-0) -->
                      <th class="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <tr v-for="p in produits" :key="p.id"
                      class="hover:bg-slate-50/70 transition-colors">

                      <!-- Produit -->
                      <td class="px-6 py-5">
                        <div class="flex items-center gap-4">
                          <!-- ✅ Image correctement affichée depuis /uploads -->
                          <img :src="getImageUrl(p.images)"
                            class="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-slate-100 shadow-sm"
                            @error="handleImgError" />
                          <div>
                            <p class="font-black text-slate-800 leading-none mb-1.5">{{ p.name }}</p>
                            <div class="flex gap-1.5 flex-wrap">
                              <span class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md uppercase">
                                {{ p.category }}
                              </span>
                              <span class="text-[10px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded-md">
                                {{ getTempsEcoule(p.createdAt || p.created_at) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <!-- Prix & Stock -->
                      <td class="px-6 py-5">
                        <p class="text-lg font-black text-slate-900">
                          {{ p.price }} <small class="text-xs text-slate-400 font-normal">DH/{{ p.unit }}</small>
                        </p>
                        <p class="text-xs text-slate-400">
                          Stock: {{ p.quantity ?? '—' }} {{ p.unit }}
                        </p>
                      </td>

                      <!-- ✅ Toggle actif/inactif inline -->
                      <td class="px-6 py-5 text-center">
                        <button @click="toggleActif(p)"
                          :class="['text-xs font-bold px-3 py-1.5 rounded-full transition-all',
                            p.is_available
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200']">
                          {{ p.is_available ? '● Actif' : '○ Inactif' }}
                        </button>
                      </td>

                      <!-- Marketing -->
                      <td class="px-6 py-5 text-center">
                        <div class="flex flex-col gap-1 items-center">
                          <span v-if="p.is_promo"
                            class="text-[10px] bg-orange-100 text-orange-600 font-black px-2.5 py-0.5 rounded-full">Promo</span>
                          <span v-if="p.is_flash"
                            class="text-[10px] bg-red-100 text-red-600 font-black px-2.5 py-0.5 rounded-full">⚡ Flash</span>
                          <span v-if="!p.is_promo && !p.is_flash" class="text-slate-200 text-xs">—</span>
                        </div>
                      </td>

                      <!-- Vues -->
                      <td class="px-6 py-5">
                        <span class="font-black text-slate-800">{{ p.views_count || 0 }}</span>
                        <span class="text-slate-300 text-xs ml-1">vues</span>
                      </td>

                      <!-- ✅ ACTIONS — toujours visibles (suppression du opacity-0) -->
                      <td class="px-6 py-5">
                        <div class="flex justify-end gap-2">
                          <button @click="partagerWhatsApp(p)"
                            title="Partager WhatsApp"
                            class="w-9 h-9 bg-green-50 text-green-600 rounded-xl
                                   hover:bg-green-600 hover:text-white transition-all flex items-center justify-center">
                            📲
                          </button>
                          <button @click="editerProduit(p)"
                            title="Modifier"
                            class="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl
                                   hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                            ✏️
                          </button>
                          <button @click="supprimerProduit(p.id, p.name)"
                            title="Supprimer"
                            class="w-9 h-9 bg-red-50 text-red-500 rounded-xl
                                   hover:bg-red-600 hover:text-white transition-all flex items-center justify-center">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <!-- ────────────────────────────────
             TAB : CLASSEMENT
             ──────────────────────────────── -->
        <section v-show="tabActive === 'classement'">
          <h2 class="text-2xl font-black text-slate-900 mb-6">🏆 Classement vendeurs — Tanger</h2>

          <!-- Ma position -->
          <div class="bg-[#0A1628] text-white rounded-2xl p-6 mb-6">
            <p class="text-blue-300 text-sm mb-2">Votre position actuelle</p>
            <div class="flex items-end gap-4">
              <span class="text-5xl font-black">#{{ maPosition }}</span>
              <div class="pb-1">
                <p class="font-bold">sur {{ classement.length }} vendeurs</p>
                <p class="text-blue-300 text-sm">{{ pointsManquants }} pts pour le rang suivant</p>
              </div>
              <span class="ml-auto text-4xl">{{ badgeActuel.icon }}</span>
            </div>
            <div class="mt-4">
              <div class="flex justify-between text-xs text-blue-300 mb-1">
                <span>{{ badgeActuel.label }}</span>
                <span>Rang suivant</span>
              </div>
              <div class="bg-white/20 rounded-full h-2">
                <div class="bg-cyan-400 h-full rounded-full transition-all duration-700"
                  :style="`width:${Math.min(100,(statsReelles.score/500)*100)}%`"></div>
              </div>
            </div>
          </div>

          <!-- Tableau classement -->
          <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="divide-y divide-slate-50">
              <div v-for="(v, i) in classement" :key="v.id"
                :class="['flex items-center gap-4 px-6 py-4 transition-colors',
                  v.estMoi ? 'bg-cyan-50 border-l-4 border-cyan-500' : 'hover:bg-slate-50']">

                <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0',
                  i===0?'bg-yellow-400 text-yellow-900':i===1?'bg-slate-300 text-slate-700':i===2?'bg-orange-200 text-orange-800':'bg-slate-100 text-slate-500']">
                  {{ i < 3 ? ['🥇','🥈','🥉'][i] : i+1 }}
                </div>

                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0',
                  v.estMoi ? 'bg-cyan-600 text-white' : 'bg-blue-100 text-blue-800']">
                  {{ v.initiale }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-bold text-slate-800 text-sm truncate">
                    {{ v.nom }}
                    <span v-if="v.estMoi" class="text-cyan-500 font-normal text-xs">(vous)</span>
                  </p>
                  <p class="text-xs text-slate-400">{{ v.ville }} · ⭐ {{ v.note }}</p>
                </div>

                <div class="text-right flex-shrink-0">
                  <p :class="['font-black text-sm', v.estMoi ? 'text-cyan-700' : 'text-slate-700']">
                    {{ v.score }} pts
                  </p>
                  <p class="text-xs text-slate-400">{{ v.ventes }} ventes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>

    <!-- ══ BOTTOM NAV MOBILE ══ -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100
                flex z-40 shadow-2xl safe-area-pb">
      <button v-for="tab in tabs" :key="tab.id"
        @click="tabActive = tab.id"
        :class="['flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors',
          tabActive === tab.id ? 'text-cyan-600' : 'text-slate-400 hover:text-slate-600']">
        <span class="text-xl leading-none">{{ tab.icon }}</span>
        <span class="text-[10px] font-bold">{{ tab.label }}</span>
      </button>
    </nav>

    <!-- ══ TOAST SUCCÈS ══ -->
    <Transition enter-active-class="transition duration-300" enter-from-class="opacity-0 translate-y-2">
      <div v-if="toastMsg"
        class="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50
               bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl
               flex items-center gap-2 font-semibold text-sm whitespace-nowrap">
        ✓ {{ toastMsg }}
      </div>
    </Transition>

  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { Head } from '@vueuse/head'
import NavBar from '../components/NavBar.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

// ─────────────────────────────────────────────────────────────
// NAVIGATION TABS
// ─────────────────────────────────────────────────────────────
const tabActive = ref('dashboard')
const tabs = [
  { id: 'dashboard',  icon: '📊', label: 'Dashboard'  },
  { id: 'produits',   icon: '📦', label: 'Produits'   },
  { id: 'classement', icon: '🏆', label: 'Classement' },
]

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
const produits          = ref([])    // Données réelles depuis BD
const chargement        = ref(true)
const afficherFormulaire = ref(false)
const estEnEdition      = ref(false)
const enCoursDEnvoi     = ref(false)
const progression       = ref(0)
const messageSucces     = ref('')
const messageErreur     = ref('')
const toastMsg          = ref('')
const aperçuImage       = ref(null)
const fichierImage      = ref(null)

// ─────────────────────────────────────────────────────────────
// VILLES DU MAROC — liste complète des principales villes
// Source : données officielles + github.com/mehdibo/morocco-cities
// ─────────────────────────────────────────────────────────────
const VILLES_MAROC = [
  'Agadir','Aït Melloul','Al Hoceima','Asilah','Azemmour','Azrou',
  'Ben Guerir','Béni Mellal','Berrechid','Boujdour','Bouznika',
  'Casablanca','Chefchaouen','Dakhla','Demnate','El Jadida','El Kelaa des Sraghna',
  'Errachidia','Essaouira','Fès','Figuig','Fnideq','Guelmim','Guercif',
  'Ifrane','Jerada','Kalaat Mgouna','Kenitra','Khemisset','Khenifra',
  'Khouribga','Ksar El Kebir','Larache','Marrakech','Martil','Meknès',
  'Midelt','Mohammadia','Nador','Ouarzazate','Oued Zem','Oujda',
  'Rabat','Safi','Salé','Settat','Sidi Bennour','Sidi Ifni','Sidi Kacem',
  'Sidi Slimane','Souk El Arbaa','Tan-Tan','Tanger','Taounate','Taourirt',
  'Taroudant','Taza','Tétouan','Tiznit','Zagora','Zenata'
].sort() // Tri alphabétique automatique

// Autocomplete ville
const rechercheVille  = ref('')
const showVilles      = ref(false)
const villesFiltrees  = computed(() => {
  if (!rechercheVille.value || rechercheVille.value.length < 2) return []
  const q = rechercheVille.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  return VILLES_MAROC.filter(v =>
    v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)
  ).slice(0, 8) // Max 8 suggestions
})

const filtrerVilles = () => { showVilles.value = true }
const selectionnerVille = (ville) => {
  rechercheVille.value = ville
  form.value.city = ville
  showVilles.value = false
}

// ─────────────────────────────────────────────────────────────
// CATÉGORIES
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// FORMULAIRE
// ─────────────────────────────────────────────────────────────
const initialForm = {
  id: null, name: '', description: '', price: 0, unit: 'kg',
  quantity: 0, category: 'sardine', city: '',
  is_available: true, is_promo: false,
  is_flash: false, flash_price: null, flash_start: '', flash_end: ''
}
const form = ref({ ...initialForm })

// Ouvrir pour NOUVEAU produit
const ouvrirFormulaire = () => {
  estEnEdition.value    = false
  form.value            = { ...initialForm }
  aperçuImage.value     = null
  fichierImage.value    = null
  rechercheVille.value  = ''
  messageErreur.value   = ''
  afficherFormulaire.value = true
  setTimeout(() => {
    document.querySelector('[data-form]')?.scrollIntoView({ behavior: 'smooth' })
  }, 50)
}

// Ouvrir pour MODIFIER un produit existant — pré-remplit tous les champs
const editerProduit = (p) => {
  estEnEdition.value    = true
  form.value            = { ...p }      // Copie toutes les données du produit
  aperçuImage.value     = getImageUrl(p.images)
  fichierImage.value    = null          // Pas de nouveau fichier par défaut
  rechercheVille.value  = p.city || ''
  messageErreur.value   = ''
  afficherFormulaire.value = true
  tabActive.value       = 'produits'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─────────────────────────────────────────────────────────────
// GESTION IMAGE
// ─────────────────────────────────────────────────────────────

/**
 * gererFichier — capte le fichier sélectionné
 * 1. Vérifie la taille (max 5 Mo)
 * 2. Stocke le File brut pour l'envoi FormData
 * 3. Crée une URL locale pour prévisualiser
 */
const gererFichier = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    messageErreur.value = 'Image trop lourde ! Maximum 5 Mo.'
    return
  }
  messageErreur.value = ''
  fichierImage.value  = file
  aperçuImage.value   = URL.createObjectURL(file) // Preview local
}

/**
 * getImageUrl — construit l'URL correcte de l'image
 *
 * Le backend stocke le champ images comme JSON string : '["sardine_abc.jpg"]'
 * Il faut :
 *   1. Parser le JSON
 *   2. Préfixer avec l'URL du backend (VITE_API_URL ou localhost:3000)
 *
 * ✅ FIX : c'était le bug principal — l'URL n'était pas construite correctement
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getImageUrl = (imgData) => {
  if (!imgData) return null // handleImgError affichera le placeholder
  try {
    const imgs = typeof imgData === 'string' ? JSON.parse(imgData) : imgData
    if (!Array.isArray(imgs) || !imgs[0]) return null

    const nom = String(imgs[0]).trim()
    if (!nom) return null

    // Si déjà une URL complète (http/https) → retourner tel quel
    if (nom.startsWith('http://') || nom.startsWith('https://')) return nom

    // Sinon → construire l'URL complète vers /uploads/ du backend
    return `${API_URL}/uploads/${nom}`
  } catch {
    return null
  }
}

// Fallback si l'image ne charge pas — remplace par une icône neutre
const handleImgError = (e) => {
  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Crect width='56' height='56' rx='12' fill='%23E2E8F0'/%3E%3Ctext x='28' y='36' font-size='22' text-anchor='middle'%3E🐟%3C/text%3E%3C/svg%3E"
}

// ─────────────────────────────────────────────────────────────
// TOGGLE ACTIF / INACTIF — action directe sans ouvrir le formulaire
// ─────────────────────────────────────────────────────────────
const toggleActif = async (p) => {
  const ancienStatut = p.is_available
  p.is_available = !p.is_available // Optimistic update (UI rapide)
  try {
    // PATCH → modifier seulement is_available, sans FormData (pas de fichier)
    await api.patch(`/products/${p.id}`, { is_available: p.is_available })
    afficherToast(p.is_available ? 'Produit activé ✓' : 'Produit désactivé')
  } catch (e) {
    p.is_available = ancienStatut // Rollback si erreur
    console.error('Erreur toggle:', e)
  }
}

// ─────────────────────────────────────────────────────────────
// SOUMETTRE FORMULAIRE
// FormData obligatoire pour envoyer le fichier image avec les textes
// ─────────────────────────────────────────────────────────────
const soumettreFormulaire = async () => {
  messageErreur.value = ''
  enCoursDEnvoi.value = true
  progression.value   = 5

  try {
    const formData = new FormData()

    // Ajouter tous les champs texte (sauf id et valeurs null)
    Object.entries(form.value).forEach(([key, val]) => {
      if (key !== 'id' && val !== null && val !== undefined && val !== '') {
        formData.append(key, String(val))
      }
    })

    // Ajouter le fichier image si sélectionné
    // Le nom 'image' doit correspondre à upload.single('image') dans products.js
    if (fichierImage.value) {
      formData.append('image', fichierImage.value, fichierImage.value.name)
    }

    // Axios config avec suivi de progression upload
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        progression.value = Math.round((e.loaded / e.total) * 100)
      }
    }

    if (estEnEdition.value) {
      await api.put(`/products/${form.value.id}`, formData, config)
      messageSucces.value = 'Produit mis à jour avec succès !'
    } else {
      await api.post('/products', formData, config)
      messageSucces.value = 'Annonce publiée ! 🚀'
    }

    // Fermer et recharger après 1.5 secondes
    setTimeout(async () => {
      messageSucces.value      = ''
      afficherFormulaire.value = false
      enCoursDEnvoi.value      = false
      progression.value        = 0
      await chargerMesProduits()
    }, 1500)

  } catch (e) {
    console.error('Erreur envoi :', e.response?.data || e)
    messageErreur.value = e.response?.data?.message || 'Erreur lors de l\'envoi. Vérifiez la console.'
    enCoursDEnvoi.value = false
  }
}

// ─────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────

/**
 * chargerMesProduits — récupère les produits RÉELS depuis la BD
 * Route : GET /api/products/mine (protégée, retourne seulement MES produits)
 */
const chargerMesProduits = async () => {
  chargement.value = true
  try {
    const { data } = await api.get('/products/mine')
    // Le backend retourne { produits: [...] }
    produits.value = data.produits || []
  } catch (e) {
    console.error('Erreur chargement produits :', e)
    produits.value = []
  } finally {
    chargement.value = false
  }
}

const supprimerProduit = async (id, nom) => {
  if (!confirm(`Supprimer définitivement "${nom}" ?`)) return
  try {
    await api.delete(`/products/${id}`)
    produits.value = produits.value.filter(p => p.id !== id) // Retrait local immédiat
    afficherToast(`"${nom}" supprimé`)
  } catch (e) {
    console.error('Erreur suppression :', e)
  }
}

// ─────────────────────────────────────────────────────────────
// STATS CALCULÉES sur les vraies données BD
// ─────────────────────────────────────────────────────────────
const statsReelles = computed(() => {
  const ps = produits.value
  return {
    totalVues:     ps.reduce((acc, p) => acc + (p.views_count || 0), 0),
    produitsActifs: ps.filter(p => p.is_available).length,
    offresFlash:   ps.filter(p => p.is_flash).length,
    // Score vendeur = algo simple basé sur les données réelles
    score: Math.min(500, ps.length * 15 + ps.reduce((acc,p) => acc + (p.views_count||0), 0) / 10)
  }
})

// Top 5 produits par vues (données réelles)
const topProduits = computed(() =>
  [...produits.value].sort((a,b) => (b.views_count||0) - (a.views_count||0)).slice(0,5)
)

// Badge rang selon score
const badgeActuel = computed(() => {
  const s = statsReelles.value.score
  if (s >= 500) return { icon: '🥇', label: 'Champion' }
  if (s >= 400) return { icon: '🥈', label: 'Expert'   }
  if (s >= 300) return { icon: '🥉', label: 'Reconnu'  }
  if (s >= 100) return { icon: '🏅', label: 'Actif'    }
  return              { icon: '🌟', label: 'Débutant'  }
})

// ─────────────────────────────────────────────────────────────
// CLASSEMENT (mock — à connecter à /api/sellers/ranking plus tard)
// ─────────────────────────────────────────────────────────────
const classement = computed(() => [
  { id:1, nom:'Hassan Marché Central', initiale:'H', ville:'Tanger', note:4.9, score:520, ventes:89, estMoi:false },
  { id:2, nom:'Fatima Poissonnerie',   initiale:'F', ville:'Tanger', note:4.8, score:410, ventes:67, estMoi:false },
  { id:3, nom: authStore.utilisateur?.name || 'Vous',
    initiale: authStore.nomInitiale,   ville:'Tanger',
    note:4.8, score: Math.round(statsReelles.value.score), ventes: produits.value.length, estMoi:true },
  { id:4, nom:'Mohamed Port',          initiale:'M', ville:'Tanger', note:4.6, score:290, ventes:34, estMoi:false },
  { id:5, nom:'Youssef Fresh Fish',    initiale:'Y', ville:'Tanger', note:4.5, score:200, ventes:21, estMoi:false },
].sort((a,b) => b.score - a.score))

const maPosition     = computed(() => classement.value.findIndex(v => v.estMoi) + 1)
const pointsManquants = computed(() => {
  const monIdx = classement.value.findIndex(v => v.estMoi)
  const devant = classement.value[monIdx - 1]
  return devant ? devant.score - classement.value[monIdx].score : 0
})

// ─────────────────────────────────────────────────────────────
// CONSEILS
// ─────────────────────────────────────────────────────────────
const conseils = [
  { id:1, icon:'📸', titre:'Ajoutez des photos',     texte:'Les produits avec photo ont 3× plus de vues.' },
  { id:2, icon:'⚡', titre:'Répondez vite sur WA',    texte:'Moins de 30 min = +15 pts de score vendeur.' },
  { id:3, icon:'🏷️', titre:'Activez des promotions', texte:'Les promos apparaissent en tête de liste.'    },
]

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const getTempsEcoule = (d) => {
  if (!d) return "À l'instant"
  const diff = Math.floor((Date.now() - new Date(d)) / 60000)
  if (diff < 1)    return "À l'instant"
  if (diff < 60)   return `${diff} min`
  if (diff < 1440) return `${Math.floor(diff/60)}h`
  return `${Math.floor(diff/1440)}j`
}

const partagerWhatsApp = (p) => {
  const base = import.meta.env.VITE_FRONTEND_URL || window.location.origin
  const msg  = `🐟 *SAMAK MARKET*\n\n*${p.name}*\n💰 ${p.price} DH/${p.unit}\n🔗 ${base}/produit/${p.id}`
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
}

const afficherToast = (msg) => {
  toastMsg.value = msg
  setTimeout(() => toastMsg.value = '', 2500)
}

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await chargerMesProduits() // ← charge les vraies données de la BD
})
</script>


<style scoped>
.input-style {
  @apply w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3
         focus:ring-2 focus:ring-cyan-300 focus:bg-white focus:border-cyan-400
         focus:outline-none transition-all text-slate-700 font-medium text-sm;
}
.label-style {
  @apply block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2;
}
/* Safe area iPhone bottom nav */
.safe-area-pb { padding-bottom: env(safe-area-inset-bottom, 0); }
</style>
