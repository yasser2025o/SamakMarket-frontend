<template>
  <section class="grillade-section" aria-label="Poisson Grillade — La Tradition Marocaine">
    <div class="grillade-container">
      
      <div class="grillade-header">
        <div class="mascot-grill-icon">
          <span class="gold-text">🔥</span>
        </div>
        <h2 class="grillade-title">
          La Tradition <span class="hero-accent">Grillade</span>
        </h2>
        <p class="grillade-subtitle">Sardines, Daurades et Espadon — Grillés au charbon de bois</p>
       

      <div class="grillade-grid">
        
        <div class="grill-card glass-effect">
          <div class="card-img-wrap">
            <img :src="grilledSardinePhoto" alt="Gourmet Grilled Sardines" class="grill-photo" />
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 class="product-title">Sardines Atlantique</h3>
            <p class="product-desc">Cumin, citron vert & persil frais.</p>
            <div class="product-footer">
              <span class="product-price">25 DH <span class="per-unit">/ p</span></span>
              <button class="sb-btn grill-btn">Commander</button>
            </div>
          </div>
        </div>

        <div class="grill-card glass-effect">
          <div class="card-img-wrap">
            <img :src="grilledDauradePhoto" alt="Gourmet Grilled Daurade" class="grill-photo" />
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 class="product-title">Daurade Royale</h3>
            <p class="product-desc">Herbes de l'Atlas & huile d'olive.</p>
            <div class="product-footer">
              <span class="product-price">110 DH <span class="per-unit">/ kg</span></span>
              <button class="sb-btn grill-btn">Commander</button>
            </div>
          </div>
        </div>
        </div>
     </div>
    </div>
  </section>
</template>
<script setup>

</script>


<style scoped>  
/* ── Grillade Section ─────────────────────────────────────── */
.grillade-section {
  padding: 80px 24px;
  background: transparent; /* Letting the default.png texture show through */
}

.grillade-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* ── Header ──────────────────────────────────────────────────── */
.grillade-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.mascot-grill-icon {
  font-size: 2rem;
  padding: 10px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 50%;
}

.grillade-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 700;
  color: #fff;
  text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
}

.grillade-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.1em;
}

/* ── Product Grid & Cards (Gilded Glass) ──────────────────── */
.grillade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.grill-card {
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.grill-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4) !important;
}

.card-img-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.grill-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.grill-card:hover .grill-photo {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.5));
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-family: 'Playfair Display', serif;
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 5px;
}

.product-desc {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  line-height: 1.4;
  margin-bottom: 20px;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.product-price {
  font-family: 'Montserrat', sans-serif;
  color: #f59e0b;
  font-size: 1.2rem;
  font-weight: 700;
}

.per-unit {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.grill-btn {
  font-size: 0.7rem;
  padding: 8px 15px;
  background: #f59e0b;
  color: #1a0e00;
  border-radius: 8px;
}
</style>
