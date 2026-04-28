<template>
  <div class="store">
    <div class="store__back">
      <AkButton outlined symbol="chevron-left" size="sm" @click="backToDashboard">
        Back to dashboard
      </AkButton>
    </div>

    <div class="store__heading">
      <div>
        <h1 class="store__title">Personalize your store</h1>
        <p class="store__subtitle">
          Add images and a store description to showcase your brand identity to retailers.
        </p>
      </div>
      <AkButton outlined symbol="box-arrow-up-right" @click="viewShop">View shop</AkButton>
    </div>

    <!-- Card 1: Your store page -->
    <section class="store__card">
      <div class="store__card-head">
        <h2 class="store__card-title">Your store page</h2>
        <p class="store__card-subtitle">Add images and a store description to personalize your store.</p>
      </div>

      <div class="store__banner">
        <button class="store__chip store__chip--tl" type="button">
          <AkIcon symbol="pencil" size="xs" /> Edit logo image
        </button>
        <div class="store__logo">
          <span>{{ brandLetter }}</span>
        </div>
        <button class="store__chip store__chip--br" type="button">
          <AkIcon symbol="pencil" size="xs" /> Edit cover image
        </button>
      </div>

      <h3 class="store__brand-name">{{ brandName }}</h3>

      <div class="store__about">
        <div class="store__about-col">
          <h4 class="store__about-title">About {{ brandName }}</h4>
          <ul class="store__about-list">
            <li>Since —</li>
            <li>Brand location —</li>
            <li>Distribution —</li>
          </ul>
        </div>
        <div class="store__about-col">
          <h4 class="store__about-title">Our story</h4>
          <p class="store__about-text">
            Tell retailers who you are, what you stand for, and why your brand is a great fit for their store.
            A strong story helps retailers connect with your brand.
          </p>
          <AkButton outlined size="sm" symbol="pencil">Edit brand story</AkButton>
        </div>
      </div>
    </section>

    <!-- Card 2: Introduction video -->
    <section class="store__card">
      <div class="store__card-head">
        <h2 class="store__card-title">
          Add an introduction video
          <span class="store__optional">Optional</span>
        </h2>
        <p class="store__card-subtitle">
          A short video helps retailers quickly understand who you are, what you stand for, and why your brand fits their store.
        </p>
      </div>

      <div class="store__video-row">
        <AkInput
          v-model="videoUrl"
          label="YouTube video link"
          placeholder="Paste YouTube URL here"
          type="url"
        />
        <AkButton outlined>Add video</AkButton>
      </div>
    </section>

    <!-- Card 3: Brand tile -->
    <section class="store__card">
      <div class="store__card-head">
        <h2 class="store__card-title">Brand tile</h2>
        <p class="store__card-subtitle">
          Your brand tile appears in category pages and search results. It should reflect your brand identity
          without using a logo or text.
        </p>
      </div>

      <div class="store__tiles">
        <div class="store__tile">
          <div class="store__tile-img store__tile-img--banner">
            <div class="store__tile-logo"><span>{{ brandLetter }}</span></div>
            <button class="store__chip store__chip--tl store__chip--sm" type="button">
              <AkIcon symbol="pencil" size="xs" /> Edit image
            </button>
          </div>
          <p class="store__tile-name">{{ brandName }}</p>
        </div>

        <div v-for="sample in sampleTiles" :key="sample.name" class="store__tile">
          <div class="store__tile-img" :class="`store__tile-img--${sample.style}`"></div>
          <p class="store__tile-name">{{ sample.name }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'

const router = useRouter()
const { state, markTaskComplete, setCurrentService } = useBrandStore()

const videoUrl = ref('')

const brandName = computed(() => state.brand.name || 'Your brand')
const brandLetter = computed(() => (state.brand.name || 'A').charAt(0).toUpperCase())

const sampleTiles = [
  { name: 'ZenArome', style: 'zenarome' },
  { name: 'Bacanha', style: 'bacanha' },
  { name: 'Juste', style: 'juste' },
  { name: 'Hindbag', style: 'hindbag' },
]

function backToDashboard() {
  markTaskComplete('store')
  setCurrentService('marketplace')
  router.push('/')
}

function viewShop() {
  router.push('/preview-launch')
}
</script>

<style scoped>
.store {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--warm-white, #FBF8F3);
  min-height: 100%;
}

.store__back { align-self: flex-start; }

.store__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.store__title {
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  color: var(--primary);
  margin: 0;
}

.store__subtitle {
  font-size: 14px;
  line-height: 20px;
  color: var(--neutral-900);
  margin: 4px 0 0;
}

.store__card {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.store__card-head { display: flex; flex-direction: column; gap: 4px; }

.store__card-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: var(--primary);
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.store__optional {
  font-weight: 400;
  font-size: 13px;
  color: var(--neutral-700);
}

.store__card-subtitle {
  font-size: 14px;
  line-height: 20px;
  color: var(--neutral-900);
  margin: 0;
}

.store__banner {
  position: relative;
  height: 260px;
  border-radius: 8px;
  overflow: hidden;
  background:
    radial-gradient(circle at 16% 30%, rgba(255, 195, 110, 0.55) 0%, transparent 5%),
    radial-gradient(circle at 78% 62%, rgba(255, 220, 130, 0.48) 0%, transparent 7%),
    radial-gradient(circle at 62% 28%, rgba(255, 170, 100, 0.42) 0%, transparent 4%),
    radial-gradient(circle at 34% 78%, rgba(150, 195, 255, 0.38) 0%, transparent 6%),
    radial-gradient(circle at 88% 20%, rgba(120, 160, 255, 0.32) 0%, transparent 5%),
    radial-gradient(circle at 48% 50%, rgba(200, 170, 140, 0.22) 0%, transparent 8%),
    linear-gradient(135deg, #0a1530 0%, #1a2550 50%, #0a152c 100%);
}

.store__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(20, 6, 10, 0.08);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  backdrop-filter: blur(4px);
  cursor: pointer;
  font-family: inherit;
  transition: background 120ms ease, transform 120ms ease;
}
.store__chip:hover { background: var(--white); transform: translateY(-0.5px); }

.store__chip--tl { position: absolute; top: 16px; left: 16px; }
.store__chip--br { position: absolute; bottom: 16px; right: 16px; }
.store__chip--sm { height: 26px; padding: 0 10px; font-size: 11px; top: 10px; left: 10px; }

.store__logo {
  position: absolute;
  top: 50%;
  left: 64px;
  transform: translateY(-50%);
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid var(--white);
  box-shadow: var(--shadow-lg);
}
.store__logo span {
  font-family: 'Work Sans', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 48px;
  color: var(--white);
  line-height: 1;
}

.store__brand-name {
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: var(--primary);
  margin: 0;
}

.store__about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 767px) {
  .store__about { grid-template-columns: 1fr; }
}

.store__about-col { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }

.store__about-title {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--primary);
  margin: 0;
}

.store__about-list {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--neutral-900);
}

.store__about-text {
  font-size: 14px;
  line-height: 22px;
  color: var(--neutral-900);
  margin: 0;
}

.store__video-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: end;
  max-width: 600px;
}

.store__tiles {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

@media (max-width: 1023px) {
  .store__tiles { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 767px) {
  .store__tiles { grid-template-columns: repeat(2, 1fr); }
}

.store__tile { display: flex; flex-direction: column; gap: 10px; }

.store__tile-img {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: 8px;
  overflow: hidden;
  background: var(--neutral-100);
}

.store__tile-img--banner {
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 195, 110, 0.45) 0%, transparent 30%),
    linear-gradient(135deg, #0a1530 0%, #1a2550 50%, #0a152c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.store__tile-logo {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2.5px solid var(--white);
  box-shadow: var(--shadow-md);
}
.store__tile-logo span {
  font-family: 'Work Sans', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 28px;
  color: var(--white);
  line-height: 1;
}

.store__tile-img--zenarome {
  background:
    radial-gradient(circle at 30% 70%, rgba(180, 210, 170, 0.3) 0%, transparent 40%),
    linear-gradient(160deg, #1a2820 0%, #2d4435 45%, #1a2820 100%);
}
.store__tile-img--bacanha {
  background:
    radial-gradient(circle at 70% 30%, rgba(255, 180, 160, 0.35) 0%, transparent 45%),
    linear-gradient(135deg, #e8a89a 0%, #d88877 55%, #c46f5d 100%);
}
.store__tile-img--juste {
  background:
    radial-gradient(circle at 50% 60%, rgba(235, 215, 190, 0.4) 0%, transparent 40%),
    linear-gradient(135deg, #e8dcc8 0%, #d4c2a8 55%, #bfa98a 100%);
}
.store__tile-img--hindbag {
  background:
    radial-gradient(circle at 40% 40%, rgba(230, 160, 110, 0.3) 0%, transparent 45%),
    linear-gradient(160deg, #d08a5e 0%, #b56d42 55%, #8f5230 100%);
}

.store__tile-name {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: var(--primary);
  margin: 0;
}
</style>
