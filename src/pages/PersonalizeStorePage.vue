<template>
  <div class="pz-page">
    <OnboardingStepper current="brand" />

    <div class="pz-header">
      <h1>Brand</h1>
      <p>Add images and a description to showcase your brand identity to retailers.</p>
    </div>

    <div class="pz-content">
      <div class="pz-card">
        <h2 class="pz-card__title">Your store page</h2>
        <p class="pz-card__sub">Add images and a store description to personalize your store.</p>
        <div class="pz-media">
          <div class="pz-logo-area">
            <div class="pz-logo-circle"></div>
            <AkButton color="primary" size="sm" symbol="pencil">Edit logo image</AkButton>
          </div>
          <div class="pz-cover-area">
            <span class="pz-cover-label">Cover image</span>
            <AkButton color="primary" symbol="upload">Add cover image</AkButton>
          </div>
        </div>
      </div>

      <div class="pz-card">
        <h2 class="pz-brand-name">Tonio's amazing stuff</h2>
        <div class="pz-brand-grid">
          <div>
            <p class="pz-sub-title">About Tonio's amazing stuff</p>
            <ul class="pz-about">
              <li>Paris, France</li>
              <li>Since 2020</li>
            </ul>
            <div class="pz-ig-field">
              <AkInput v-model="instagram" label="Instagram username" placeholder="@yourbrand" />
            </div>
          </div>
          <div>
            <p class="pz-sub-title">Share your brand story</p>
            <textarea
              v-model="story"
              class="pz-textarea"
              placeholder="Write about your brand story here: origins, mission, values..."
            ></textarea>
            <div class="pz-story-footer">
              <AkButton outlined :disabled="!story">Save brand story</AkButton>
            </div>
          </div>
        </div>
      </div>

      <div class="pz-card">
        <h2 class="pz-card__title">
          Add an introduction video
          <span class="pz-optional">Optional</span>
        </h2>
        <p class="pz-card__sub">A short video helps retailers quickly understand who you are, what you stand for, and why your brand fits their store.</p>
        <div class="pz-video-row">
          <div style="flex:1">
            <AkInput v-model="videoUrl" label="YouTube video link" type="url" placeholder="Paste YouTube URL here" />
          </div>
          <AkButton outlined>Add video</AkButton>
        </div>
      </div>

      <div class="pz-card">
        <h2 class="pz-card__title">Brand tile</h2>
        <p class="pz-card__sub">Your brand tile appears in category pages and search results. It should reflect your brand identity without using a logo or text.</p>
        <div class="pz-tile-grid">
          <div class="pz-tile pz-tile--empty">
            <div class="pz-tile__img">
              <AkButton color="primary" size="sm" symbol="upload">Upload image</AkButton>
            </div>
            <div class="pz-tile__name">Tonio's amazing stuff</div>
          </div>
          <div v-for="b in exampleBrands" :key="b.name" class="pz-tile">
            <div class="pz-tile__img" :style="{ background: b.bg }"></div>
            <div class="pz-tile__name">{{ b.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="pz-bottom">
      <AkButton outlined @click="back">Previous</AkButton>
      <AkButton color="primary" @click="next">Next</AkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OnboardingStepper from '@/components/OnboardingStepper.vue'

const router = useRouter()
const story = ref('')
const videoUrl = ref('')
const instagram = ref('toniostuff')

const exampleBrands = [
  { name: 'ZenArome', bg: 'linear-gradient(160deg, #e8e4de 0%, #d0cac2 100%)' },
  { name: 'Bacanha', bg: 'linear-gradient(160deg, #2a2420 0%, #3a3028 100%)' },
  { name: 'Juste', bg: 'linear-gradient(160deg, #e8e4de 0%, #d8d4ce 100%)' },
  { name: 'Hindbag', bg: 'linear-gradient(160deg, #d4c8bc 0%, #b8a898 100%)' },
]

function back() { router.push('/company-details') }
function next() { router.push('/shipping') }
</script>

<style scoped>
.pz-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
}

.pz-header {
  text-align: center;
  padding: var(--space-6) var(--space-6) var(--space-5);
}

.pz-header h1 {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.pz-header p {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
}

.pz-content {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 var(--space-6) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.pz-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.pz-card__title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.pz-card__sub {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0 0 var(--space-5);
}

.pz-optional {
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
  margin-left: var(--space-2);
}

.pz-media {
  display: flex;
  gap: 0;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  min-height: 240px;
}

.pz-logo-area {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-5);
  gap: var(--space-3);
  border-right: 1px solid var(--color-border-light);
}

.pz-logo-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8bdb0 0%, #8a7e74 50%, #4a4038 100%);
}

.pz-cover-area {
  flex: 1;
  background: var(--neutral-100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
}

.pz-cover-label {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
}

.pz-brand-name {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 var(--space-5);
  color: var(--primary);
}

.pz-brand-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: var(--space-7);
}

@media (max-width: 768px) {
  .pz-brand-grid { grid-template-columns: 1fr; gap: var(--space-5); }
}

.pz-sub-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 var(--space-3);
  color: var(--primary);
}

.pz-about {
  list-style: disc;
  padding-left: 18px;
  margin: 0 0 var(--space-4);
  font-size: 14px;
  color: var(--primary);
  line-height: 1.8;
}

.pz-ig-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--primary);
}

.pz-ig-row a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
}

.pz-textarea {
  width: 100%;
  height: 160px;
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--white);
  font-family: inherit;
  font-size: 14px;
  color: var(--primary);
  resize: vertical;
  outline: none;
}

.pz-textarea:focus {
  border-color: var(--primary);
}

.pz-story-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-3);
}

.pz-video-row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
}

.pz-tile-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .pz-tile-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 640px) {
  .pz-tile-grid { grid-template-columns: repeat(2, 1fr); }
}

.pz-tile {
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  background: var(--white);
}

.pz-tile__img {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-100);
}

.pz-tile--empty .pz-tile__img { background: var(--neutral-100); }

.pz-tile__name {
  padding: var(--space-3);
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}

.pz-bottom {
  max-width: 1240px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6) var(--space-7);
  display: flex;
  gap: var(--space-3);
}
</style>
