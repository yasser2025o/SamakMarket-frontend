// =============================================================
// src/stores/admin.js
// Store Pinia admin — cache 2 minutes + Promise.all
// =============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

const CACHE_MS = 2 * 60 * 1000 // 2 minutes

export const useAdminStore = defineStore('admin', () => {

  // ── State ──────────────────────────────────────────────────
  const vendeurs      = ref([])
  const produits      = ref([])
  const flashActives  = ref([])
  const stats         = ref({ vendeurs: 0, produits: 0, villes: 0 })
  const chargement    = ref(false)
  const erreur        = ref(null)
  const lastFetch     = ref(null)

  // ── Getters ────────────────────────────────────────────────
  const cacheValide = computed(() =>
    lastFetch.value && Date.now() - lastFetch.value < CACHE_MS
  )

  const vendeursActifs = computed(() =>
    vendeurs.value.filter(v => v.role === 'seller')
  )

  const produitsEnPromo = computed(() =>
    produits.value.filter(p => p.is_promo)
  )

  // ── Action principale — charge tout en parallèle ───────────
  // const charger = async (forcer = false) => {
  //   // Ne recharge pas si cache encore valide
  //   if (!forcer && cacheValide.value) return

  //   chargement.value = true
  //   erreur.value     = null

  //   try {
  //     // Promise.all = toutes les requêtes en même temps
  //     const [resVendeurs, resProduits, resFlash] = await Promise.all([
  //       api.get('/admin/vendeurs'),
  //       api.get('/admin/produits'),
  //       api.get('/flash/active').catch(() => ({ data: [] })), // optionnel
  //     ])

  //     vendeurs.value     = resVendeurs.data
  //     produits.value     = resProduits.data
  //     flashActives.value = resFlash.data

  //     // Calcul stats
  //     const villes = [...new Set(resVendeurs.data.map(v => v.city).filter(Boolean))]
  //     stats.value = {
  //       vendeurs: resVendeurs.data.filter(v => v.role === 'seller').length,
  //       produits: resProduits.data.length,
  //       villes:   villes.length,
  //     }

  //     lastFetch.value = Date.now()
  //   } catch (e) {
  //     erreur.value = 'Erreur chargement données admin'
  //     console.error(e)
  //   } finally {
  //     chargement.value = false
  //   }
  // }

const charger = async (forcer = false) => {
if (!forcer && cacheValide.value) return
chargement.value = true
erreur.value = null
try {
const [resVendeurs, resProduits, resFlash] = await Promise.all([
api.get('/admin/vendeurs'),
api.get('/admin/produits'),
api.get('/flash/active').catch(() => ({ data: [] })),
])
vendeurs.value = resVendeurs.data
produits.value = resProduits.data
flashActives.value = resFlash.data
lastFetch.value = Date.now()
} catch (e) {
// Ne bloque pas la page si erreur
console.warn('Admin store:', e.message)
} finally {
chargement.value = false // ← toujours false même si erreur
}
}

  // ── Actions CRUD — mettent à jour le cache local ───────────

  const supprimerVendeur = async (id) => {
    try {
      await api.delete(`/admin/vendeurs/${id}`)
      vendeurs.value = vendeurs.value.filter(v => v.id !== id)
      stats.value.vendeurs--
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const supprimerProduit = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      produits.value = produits.value.filter(p => p.id !== id)
      stats.value.produits--
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const togglePromo = async (id, valeur) => {
    try {
      await api.patch(`/products/${id}`, { is_promo: valeur })
      const p = produits.value.find(p => p.id === id)
      if (p) p.is_promo = valeur
      return { succes: true }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  const resetPassword = async (vendeurId) => {
    try {
      const { data } = await api.post(`/admin/vendeurs/${vendeurId}/reset-password`)
      return { succes: true, ...data }
    } catch (e) {
      return { succes: false, message: e.response?.data?.message || 'Erreur' }
    }
  }

  // Invalider le cache (forcer rechargement au prochain appel)
  const invaliderCache = () => { lastFetch.value = null }

  return {
    // State
    vendeurs, produits, flashActives, stats, chargement, erreur,
    // Getters
    cacheValide, vendeursActifs, produitsEnPromo,
    // Actions
    charger, supprimerVendeur, supprimerProduit,
    togglePromo, resetPassword, invaliderCache,
  }
})
