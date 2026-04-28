<template>
  <div class="onboarding">
    <div class="onboarding__progress" :style="{ width: progressPct + '%' }"></div>

    <header class="onboarding__header">
      <span class="onboarding__logo">ankorstore</span>
      <button class="onboarding__save-exit" @click="saveAndExit">Save &amp; exit</button>
    </header>

    <main class="onboarding__main">
      <!-- STEP 1: Country + registration -->
      <section v-if="step === 1" class="onboarding__step">
        <div class="onboarding__intro">
          <p class="onboarding__eyebrow">Step 1 of 4</p>
          <h1 class="onboarding__title">Let's find your brand.</h1>
          <p class="onboarding__subtitle">
            Enter your registration number and we'll pull your details from the public registry &mdash; no paperwork needed.
          </p>
        </div>

        <div class="onboarding__field-wrap">
          <AkSelect
            v-model="selectedCountry"
            :options="countryOptions"
            label="Country"
          />
        </div>

        <div class="onboarding__field-wrap">
          <AkInput
            v-model="regNumber"
            :label="currentCountry.label"
            :placeholder="currentCountry.placeholder"
            :hint="currentCountry.help"
            @input="onIdInput"
          />
        </div>

        <div v-if="looking" class="onboarding__looking">
          <span class="onboarding__spinner"></span>
          <span>Checking {{ currentCountry.source }}&hellip;</span>
        </div>

        <div v-if="brand.name && !looking" class="onboarding__result">
          <div class="onboarding__result-head">
            <AkBadge content="Verified" color="green" size="sm" symbol="check-circle" />
            <span class="onboarding__result-source">{{ currentCountry.source }}</span>
          </div>
          <h2 class="onboarding__result-name">{{ brand.name }}</h2>
          <p class="onboarding__result-legal">{{ brand.legalForm }} · {{ brand.id }}</p>
          <div class="onboarding__result-address">
            {{ brand.street }}<br />
            {{ brand.postal }} {{ brand.city }}, {{ brand.country }}
          </div>
        </div>

        <div class="onboarding__actions">
          <AkButton color="primary" size="lg" :disabled="!brand.name" @click="goStep(2)">
            Continue
          </AkButton>
          <AkButton outlined size="md" @click="goManual">Enter details manually instead</AkButton>
        </div>
      </section>

      <!-- STEP 2: Review details -->
      <section v-if="step === 2" class="onboarding__step onboarding__step--wide">
        <div class="onboarding__intro">
          <p class="onboarding__eyebrow">Step 2 of 4</p>
          <h1 class="onboarding__title">Everything correct?</h1>
          <p class="onboarding__subtitle">Review and tweak your details before continuing.</p>
        </div>

        <div class="onboarding__review">
          <AkInput v-model="brand.name" label="Brand name" />
          <AkSelect v-model="brand.legalForm" :options="legalFormOptions" label="Legal form" />
          <AkInput v-model="brand.id" label="Registration number" />
          <AkInput v-model="brand.vat" label="VAT number" />
          <AkInput v-model="brand.street" label="Street address" />
          <div class="onboarding__review-row">
            <AkInput v-model="brand.postal" label="Postal code" />
            <AkInput v-model="brand.city" label="City" />
          </div>
          <AkInput v-model="brand.country" label="Country" />
          <AkSelect v-model="brand.industry" :options="industryOptions" label="Industry" />
          <AkInput v-model="brand.website" label="Website" placeholder="https://yourbrand.com" />
        </div>

        <div class="onboarding__actions onboarding__actions--split">
          <AkButton outlined symbol="chevron-left" @click="goStep(1)">Back</AkButton>
          <AkButton color="primary" @click="goStep(3)">Looks good, continue</AkButton>
        </div>
      </section>

      <!-- STEP 3: Shop URL / auto import -->
      <section v-if="step === 3" class="onboarding__step">
        <div class="onboarding__intro">
          <p class="onboarding__eyebrow">Step 3 of 4</p>
          <h1 class="onboarding__title">Do you already sell online?</h1>
          <p class="onboarding__subtitle">
            If you have an online shop, we can import your products automatically &mdash; no spreadsheets, no copy-paste. Fastest way to fill your catalogue.
          </p>
        </div>

        <div class="onboarding__field-wrap">
          <AkInput
            v-model="shopUrl"
            label="Your shop URL"
            type="url"
            placeholder="https://www.yourshop.com"
            hint="Shopify, WooCommerce, Prestashop, custom sites — we detect it all."
          />
        </div>

        <div class="onboarding__actions">
          <AkButton color="primary" size="lg" symbol="stars" :disabled="!shopUrl" @click="chooseAutoImport">
            Auto-import my products
          </AkButton>
          <AkButton outlined @click="skipImport">Skip — I'll add products manually</AkButton>
        </div>
      </section>

      <!-- STEP 4: Success -->
      <section v-if="step === 4" class="onboarding__step onboarding__step--center">
        <div class="onboarding__success-circle">
          <AkIcon symbol="check-lg" />
        </div>
        <p class="onboarding__eyebrow">Step 4 of 4</p>
        <h1 class="onboarding__title">Welcome to Ankorstore<span v-if="brand.name">, {{ brand.name }}</span>.</h1>
        <p class="onboarding__subtitle onboarding__subtitle--center">
          Your brand is set up. Jump into your dashboard — you'll find a few tasks waiting for you.
        </p>
        <AkButton color="primary" size="lg" @click="goToDashboard">
          Go to my dashboard
        </AkButton>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore, COUNTRIES, MOCK_REGISTRY, INDUSTRIES, LEGAL_FORMS } from '@/data/brand-store'

const router = useRouter()
const { state, setBrand, resetBrand, setAutoImport } = useBrandStore()

resetBrand()

const step = ref(1)
const selectedCountry = ref('FR')
const regNumber = ref('')
const shopUrl = ref('')
const looking = ref(false)
let lookupTimer: ReturnType<typeof setTimeout> | null = null

const brand = state.brand

const countryOptions = COUNTRIES.map(c => ({ label: `${c.flag}  ${c.name}`, value: c.code }))
const legalFormOptions = LEGAL_FORMS.map(v => ({ label: v, value: v }))
const industryOptions = INDUSTRIES.map(v => ({ label: v, value: v }))

const currentCountry = computed(() => COUNTRIES.find(c => c.code === selectedCountry.value) || COUNTRIES[0])

const progressPct = computed(() => (step.value / 4) * 100)

function onIdInput() {
  const raw = regNumber.value.replace(/[\s.-]/g, '')
  if (lookupTimer) clearTimeout(lookupTimer)
  setBrand({ name: '' })
  if (raw.length < 5) {
    looking.value = false
    return
  }
  looking.value = true
  lookupTimer = setTimeout(() => performLookup(raw), 700)
}

function performLookup(raw: string) {
  const hit = MOCK_REGISTRY[raw]
  const cfg = currentCountry.value
  if (hit) {
    setBrand(hit)
  } else {
    setBrand({
      name: selectedCountry.value === 'FR' ? 'Atelier Parisien' : selectedCountry.value === 'GB' ? 'Camden Makers Ltd' : 'Mustermann GmbH',
      legalForm: selectedCountry.value === 'GB' ? 'Ltd' : selectedCountry.value === 'DE' ? 'GmbH' : 'SAS',
      id: raw,
      vat: cfg.code + raw,
      street: '24 Rue de Turenne',
      postal: '75003',
      city: 'Paris',
      country: cfg.name,
      industry: 'Home & Decoration',
      website: '',
    })
  }
  looking.value = false
}

function goManual() {
  resetBrand()
  const cfg = currentCountry.value
  setBrand({ country: cfg.name, legalForm: 'SAS', industry: 'Home & Decoration' })
  goStep(2)
}

function goStep(n: number) {
  step.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function chooseAutoImport() {
  setAutoImport(true, shopUrl.value)
  goStep(4)
}

function skipImport() {
  setAutoImport(false)
  goStep(4)
}

function saveAndExit() {
  router.push('/')
}

function goToDashboard() {
  router.push('/')
}
</script>

<style scoped>
.onboarding {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
  color: var(--primary);
  position: relative;
}

.onboarding__progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--primary);
  z-index: 100;
  transition: width 500ms cubic-bezier(0.65, 0, 0.35, 1);
}

.onboarding__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px 20px;
}

.onboarding__logo {
  font-family: 'Work Sans', 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.02em;
  color: var(--primary);
  user-select: none;
}

.onboarding__save-exit {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 13px;
  color: var(--neutral-700);
  cursor: pointer;
  transition: color 150ms ease;
}
.onboarding__save-exit:hover { color: var(--primary); }

.onboarding__main {
  display: flex;
  justify-content: center;
  padding: 48px 24px 120px;
}

.onboarding__step {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.onboarding__step--wide { max-width: 560px; }
.onboarding__step--center { max-width: 480px; align-items: center; text-align: center; }

.onboarding__intro { margin-bottom: var(--space-4); }

.onboarding__eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #517070);
  margin-bottom: 16px;
}

.onboarding__title {
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: -0.02em;
  color: var(--primary);
  margin: 0 0 12px;
}

.onboarding__subtitle {
  font-size: 15px;
  line-height: 24px;
  color: var(--neutral-900);
  margin: 0;
}

.onboarding__subtitle--center { max-width: 400px; margin: 0 auto 32px; }

.onboarding__field-wrap { display: flex; flex-direction: column; }

.onboarding__looking {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--neutral-700);
  font-size: 14px;
}

.onboarding__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid var(--neutral-300, #E6E6E6);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: onboarding-spin 0.7s linear infinite;
}
@keyframes onboarding-spin {
  to { transform: rotate(360deg); }
}

.onboarding__result {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.onboarding__result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.onboarding__result-source {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--neutral-500);
}

.onboarding__result-name {
  font-weight: 600;
  font-size: 22px;
  line-height: 30px;
  color: var(--primary);
  margin: 0;
}

.onboarding__result-legal {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
}

.onboarding__result-address {
  padding-top: 16px;
  margin-top: 8px;
  border-top: 1px solid var(--color-border-light);
  font-size: 13px;
  color: var(--primary);
  line-height: 20px;
}

.onboarding__review {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 16px;
  padding: 24px;
}

.onboarding__review-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-3);
}

.onboarding__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.onboarding__actions--split {
  flex-direction: row;
  justify-content: space-between;
}

.onboarding__success-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #F8FCE9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent, #517070);
  font-size: 42px;
  margin-bottom: var(--space-5);
}
</style>
