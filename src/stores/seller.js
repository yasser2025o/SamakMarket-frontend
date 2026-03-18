// =============================================================
// src/stores/seller.js
// Store Pinia vendeur — cache 1 minute + Promise.all
// =============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

const CACHE_MS = 60 * 1000 // 1 minute

export const useSellerStore = defineStore('seller', () => {

  // ── State ──────────────────────────────────────────────────
  const mesProduits   = ref([])
  const profil        = ref(null)
  const stats         = ref({ produits: 0, promos: 0, vues: 0 })
  const chargement    = ref(false)
  const erreur        = ref(null)
  const lastFetch     = ref(null)

  // ── Getters ────────────────────────────────────────────────
  const cacheValide = computed(() =>
    lastFetch.value && Date.now() - lastFetch.value < CACHE_MS
  )

  const produitsActifs = computed(() =>
    mesProduits.value.filter(p => p.is_available)
  )

  const produitsEnPromo = computed(() =>
    mesProduits.value.filter(p => p.is_promo)
  )

  const produitsFlash = computed(() =>
    mesProduits.value.filter(p => p.is_flash)
  )

  // ── Action principale ──────────────────────────────────────
  const charger = async (forcer = false) => {
    if (!forcer && cacheValide.value) return

    chargement.value = true
    erreur.value     = null

    try {
      // Charge profil + produits en parallèle
      const [resProfil, resProduits] = await Promise.all([
        api.get('/auth/me'),
        api.get('/products/mine'),
      ])

      profil.value      = resProfil.data.user
      mesProduits.value = resProduits.data.produits || resProduits.data

      stats.value = {
        produits: mesProduits.value.length,
        promos:   mesProduits.value.filter(p => p.is_promo).length,
        vues:     mesProduits.value.reduce((acc, p) => acc + (p.views || 0), 0),
      }

      lastFetch.value = Date.now()
    } catch (e) {
      erreur.value = 'Erreur chargement données vendeur'
      console.error(e)
    } finally {
      chargement.value = false
    }
  }

  // ── Actions CRUD ───────────────────────────────────────────

  const creerProduit = async (donnees) => {
    try {
      const { data } = await api.post('/products', donnees)
      mesProduits.value.unshift(data.produit)
      stats.value.produits++
      return { succes: true, produit: data.produit }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const modifierProduit = async (id, donnees) => {
    try {
      const { data } = await api.put(`/products/${id}`, donnees)
      const index = mesProduits.value.findIndex(p => p.id === id)
      if (index !== -1) mesProduits.value[index] = { ...mesProduits.value[index], ...donnees }
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const supprimerProduit = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      mesProduits.value = mesProduits.value.filter(p => p.id !== id)
      stats.value.produits--
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const togglePromo = async (id, valeur) => {
    try {
      await api.patch(`/products/${id}`, { is_promo: valeur })
      const p = mesProduits.value.find(p => p.id === id)
      if (p) {
        p.is_promo = valeur
        stats.value.promos += valeur ? 1 : -1
      }
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const invaliderCache = () => { lastFetch.value = null }

  return {
    // State
    mesProduits, profil, stats, chargement, erreur,
    // Getters
    cacheValide, produitsActifs, produitsEnPromo, produitsFlash,
    // Actions
    charger, creerProduit, modifierProduit,
    supprimerProduit, togglePromo, invaliderCache,
  }
})
