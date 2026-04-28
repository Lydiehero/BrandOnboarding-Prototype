<template>
  <div class="preview">
    <!-- Preview mode banner -->
    <div class="preview__banner">
      <div class="preview__banner-info">
        <AkIcon symbol="eye" />
        <span class="preview__banner-label">Preview mode</span>
        <span class="preview__banner-sep">·</span>
        <span class="preview__banner-hint">This is how retailers will see your store</span>
      </div>
      <div class="preview__banner-actions">
        <AkButton outlined size="sm" symbol="arrow-left" @click="goBack">
          Back to editor
        </AkButton>
        <AkButton color="primary" size="sm" symbol="rocket-takeoff" @click="launch">
          Launch my store
        </AkButton>
      </div>
    </div>

    <!-- Retailer view -->
    <div class="preview__body">
      <div class="preview__crumb">
        Ankorstore / Home &amp; Decoration / <span class="preview__crumb-here">{{ brandName }}</span>
      </div>

      <div class="preview__cover"></div>

      <div class="preview__brand-row">
        <div class="preview__avatar"><span>{{ brandLetter }}</span></div>

        <div class="preview__brand-info">
          <div class="preview__title-row">
            <h1 class="preview__brand-title">{{ brandName }}</h1>
            <AkBadge content="First order" color="blue" size="md" symbol="star" />
            <AkBadge content="New on Ankorstore" color="purple" size="md" />
          </div>
          <div class="preview__rating">
            <span class="preview__stars">★★★★★</span>
            <span class="preview__rating-label">No reviews yet</span>
            <span class="preview__sep">·</span>
            <span class="preview__new">New brand</span>
          </div>
        </div>
      </div>

      <div class="preview__about">
        <div>
          <h2 class="preview__h2">About {{ brandName }}</h2>
          <ul class="preview__about-list">
            <li>Brand location — Paris, France</li>
            <li>Since 2020</li>
            <li>Distribution — Boutiques &amp; online</li>
          </ul>
          <div class="preview__social">
            <AkIcon symbol="instagram" />
            <a href="#" @click.prevent>@{{ insta }}</a>
            <span class="preview__sep">·</span>
            <span>10.5k followers</span>
          </div>
          <div class="preview__tags">
            <AkBadge content="Made in France" color="grey" size="sm" />
            <AkBadge content="Made in Portugal" color="grey" size="sm" />
          </div>
        </div>

        <div class="preview__desc">
          <p>
            <strong>{{ brandName }}</strong> is a home &amp; decoration label designing objects for everyday rituals.
            From hand-poured soy candles and stoneware mugs to raw silk cushions, every piece is produced in small batches
            with natural materials and long-lasting craftsmanship in mind.
          </p>
          <p class="preview__desc-muted">
            We work with independent ateliers — supporting traditional techniques while bringing contemporary shapes to your retail shelves.
          </p>
          <a href="#" @click.prevent class="preview__read-more">Read more</a>
        </div>
      </div>

      <section class="preview__products">
        <div class="preview__products-head">
          <h2 class="preview__h2">Products <span class="preview__muted">· {{ sampleProducts.length }}</span></h2>
          <AkSelect
            v-model="sortBy"
            :options="[{ label: 'Recommended', value: 'recommended' }, { label: 'Price: low to high', value: 'asc' }, { label: 'Price: high to low', value: 'desc' }]"
            size="sm"
          />
        </div>

        <div class="preview__grid">
          <div v-for="p in sampleProducts" :key="p.name" class="prod-tile">
            <div class="prod-tile__thumb">{{ p.emoji }}</div>
            <p class="prod-tile__name">{{ p.name }}</p>
            <p class="prod-tile__price">{{ p.price }}</p>
            <p class="prod-tile__retail">{{ p.retail }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Success overlay -->
    <div v-if="launched" class="preview__overlay">
      <div class="preview__overlay-inner">
        <div class="preview__success-circle">
          <AkIcon symbol="check-lg" />
        </div>

        <p class="preview__success-eyebrow">You're live</p>
        <h1 class="preview__success-title">Congratulations, {{ brandName }}!</h1>
        <p class="preview__success-text">
          Your store is now live on Ankorstore. Over <strong>40,000 retailers</strong> across Europe can discover your products today.
        </p>

        <div class="preview__next-cards">
          <button class="next-card" @click="copyLink">
            <div class="next-card__icon"><AkIcon symbol="share" /></div>
            <p class="next-card__title">Share your store</p>
            <p class="next-card__desc">
              {{ copied ? '✓ Link copied!' : `ankorstore.com/${slug}` }}
            </p>
          </button>
          <button class="next-card" @click="goToDashboard">
            <div class="next-card__icon"><AkIcon symbol="house" /></div>
            <p class="next-card__title">Monitor orders</p>
            <p class="next-card__desc">Track traffic, sales and inventory from your dashboard.</p>
          </button>
          <button class="next-card" @click="goToDashboard">
            <div class="next-card__icon"><AkIcon symbol="send" /></div>
            <p class="next-card__title">Launch a campaign</p>
            <p class="next-card__desc">Send your first promo to 40k+ retailers.</p>
          </button>
        </div>

        <AkButton color="primary" size="lg" symbol="arrow-right" @click="goToDashboard">
          Go to my dashboard
        </AkButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'
import { SAMPLE_PRODUCTS } from '@/data/products'

const router = useRouter()
const { state, markTaskComplete, setCurrentService } = useBrandStore()

const sortBy = ref('recommended')
const launched = ref(false)
const copied = ref(false)

const brandName = computed(() => state.brand.name || 'Your brand')
const brandLetter = computed(() => (state.brand.name || 'A').charAt(0).toUpperCase())
const slug = computed(() =>
  (state.brand.name || 'your-brand').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
)
const insta = computed(() => slug.value.replace(/-/g, ''))

const sampleProducts = SAMPLE_PRODUCTS

function launch() {
  launched.value = true
  markTaskComplete('store')
  markTaskComplete('products')
  markTaskComplete('shipping')
  markTaskComplete('preview')
  setCurrentService('marketplace')
}

function goBack() {
  router.push('/shop')
}

function goToDashboard() {
  router.push('/')
}

function copyLink() {
  const url = `https://ankorstore.com/${slug.value}`
  try {
    navigator.clipboard.writeText(url)
  } catch (e) {}
  copied.value = true
  setTimeout(() => { copied.value = false }, 2200)
}
</script>

<style scoped>
.preview {
  background: var(--white);
  color: var(--primary);
  min-height: 100vh;
}

.preview__banner {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 40;
  height: 52px;
  background: var(--primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.preview__banner-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.preview__banner-info :deep(svg) { color: #D5FC52; }

.preview__banner-label { font-weight: 500; color: var(--white); }
.preview__banner-sep { color: rgba(255, 255, 255, 0.6); }
.preview__banner-hint { color: rgba(255, 255, 255, 0.8); }

.preview__banner-actions { display: flex; gap: 10px; }

.preview__body {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px 64px;
}

.preview__crumb {
  padding: 24px 0 16px;
  font-size: 14px;
  color: var(--neutral-900);
}
.preview__crumb-here { color: var(--neutral-500); }

.preview__cover {
  height: 206px;
  border-radius: 8px;
  overflow: hidden;
  background:
    radial-gradient(circle at 14% 30%, rgba(255, 195, 110, 0.55) 0%, transparent 5%),
    radial-gradient(circle at 78% 62%, rgba(255, 220, 130, 0.48) 0%, transparent 7%),
    radial-gradient(circle at 62% 28%, rgba(255, 170, 100, 0.42) 0%, transparent 4%),
    radial-gradient(circle at 34% 78%, rgba(150, 195, 255, 0.38) 0%, transparent 6%),
    radial-gradient(circle at 88% 20%, rgba(120, 160, 255, 0.32) 0%, transparent 5%),
    linear-gradient(135deg, #0a1530 0%, #1a2550 50%, #0a152c 100%);
}

.preview__brand-row {
  margin-top: -54px;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding-top: 24px;
}

.preview__avatar {
  width: 104px;
  height: 104px;
  min-width: 104px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--white);
  box-shadow: var(--shadow-lg);
}
.preview__avatar span {
  font-family: 'Work Sans', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 42px;
  color: var(--white);
  line-height: 1;
}

.preview__brand-info { display: flex; flex-direction: column; gap: 8px; }

.preview__title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.preview__brand-title {
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
  color: var(--primary);
  margin: 0;
}

.preview__rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--neutral-900);
}

.preview__stars { color: #E6E6E6; font-size: 18px; letter-spacing: 2px; }
.preview__rating-label { color: var(--neutral-900); }
.preview__sep { color: var(--neutral-500); }
.preview__new { color: var(--accent, #517070); font-weight: 500; }

.preview__about {
  padding: 32px 0;
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 48px;
}

@media (max-width: 1023px) {
  .preview__about { grid-template-columns: 1fr; }
}

.preview__h2 {
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: var(--primary);
  margin: 0 0 14px;
}

.preview__about-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--primary);
}
.preview__about-list li::before { content: '▪ '; color: var(--neutral-500); }

.preview__social {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--neutral-900);
  margin-bottom: 12px;
}
.preview__social a {
  color: var(--primary);
  text-decoration: underline;
}

.preview__tags { display: flex; gap: 6px; flex-wrap: wrap; }

.preview__desc { display: flex; flex-direction: column; gap: 10px; font-size: 14px; line-height: 22px; }
.preview__desc p { margin: 0; color: var(--primary); }
.preview__desc-muted { color: var(--neutral-900) !important; }
.preview__read-more {
  color: var(--primary);
  text-decoration: underline;
  align-self: flex-start;
}

.preview__products {
  padding: 24px 0 64px;
  border-top: 1px solid var(--color-border-light);
}

.preview__products-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.preview__muted { color: var(--neutral-500); font-weight: 400; }

.preview__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}
@media (max-width: 1023px) { .preview__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) { .preview__grid { grid-template-columns: repeat(2, 1fr); } }

.prod-tile { background: var(--white); border-radius: 8px; }
.prod-tile__thumb {
  aspect-ratio: 1;
  background: var(--neutral-100);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}
.prod-tile__name { font-size: 13px; color: var(--primary); margin: 10px 0 2px; line-height: 18px; }
.prod-tile__price { font-weight: 600; font-size: 14px; color: var(--primary); margin: 2px 0; }
.prod-tile__retail { font-size: 11px; color: var(--neutral-700); margin: 2px 0; }

/* Success overlay */
.preview__overlay {
  position: fixed;
  inset: 0;
  background: var(--warm-white, #FBF8F3);
  z-index: 100;
  overflow-y: auto;
}

.preview__overlay-inner {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 24px;
  max-width: 640px;
  margin: 0 auto;
}

.preview__success-circle {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: #D5FC52;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 52px;
  margin-bottom: 32px;
}

.preview__success-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #517070);
  margin: 0 0 12px;
}

.preview__success-title {
  font-weight: 600;
  font-size: 44px;
  line-height: 52px;
  letter-spacing: -0.02em;
  color: var(--primary);
  margin: 0 0 12px;
}

.preview__success-text {
  font-size: 16px;
  line-height: 24px;
  color: var(--neutral-900);
  margin: 0 0 40px;
  max-width: 480px;
}

.preview__next-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  margin-bottom: 40px;
}
@media (max-width: 767px) { .preview__next-cards { grid-template-columns: 1fr; } }

.next-card {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 14px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.next-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.next-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 10px;
}

.next-card__title {
  font-weight: 600;
  font-size: 13px;
  color: var(--primary);
  margin: 0 0 2px;
}

.next-card__desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--neutral-700);
  margin: 0;
}
</style>
