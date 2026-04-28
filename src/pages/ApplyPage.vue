<template>
  <div class="apply-page">
    <header class="apply-hero">
      <h1 class="apply-hero__title">
        The success of <span class="apply-hero__accent">your brand</span> starts here
      </h1>
      <p class="apply-hero__subtitle">Fill in the form below so we can review your application.</p>
    </header>

    <section class="apply-card">
      <div class="apply-card__header">
        <h2 class="apply-card__title">Apply to sell on Ankorstore</h2>
        <p class="apply-card__note">All fields are mandatory. Your data is confidential and will not be shared with third parties.</p>
      </div>

      <div class="apply-form">
        <div class="row row--two">
          <AkInput v-model="firstName" label="First name" placeholder="Your first name" />
          <AkInput v-model="lastName" label="Last name" placeholder="Your last name" />
        </div>

        <div class="row row--two">
          <AkInput v-model="email" label="E-mail" type="email" placeholder="Your email address" />
          <AkInput v-model="phone" label="Phone number" type="tel" placeholder="0121 234 5678" />
        </div>

        <AkInput v-model="address" label="Address" placeholder="Select your address from the dropdown" />

        <hr class="divider" />

        <div class="row row--two">
          <AkInput v-model="brandName" label="Brand name" placeholder="Your brand name" />
          <AkInput v-model="brandWebsite" label="Brand website" type="url" placeholder="Enter the URL" />
        </div>

        <div class="row row--two">
          <AkSelect v-model="category" :options="categoryOptions" label="Category" placeholder="Select an option" />
          <AkSelect v-model="subcategory" :options="subcategoryOptions" label="Subcategory" placeholder="Select an option" />
        </div>

        <div class="row row--two">
          <AkSelect v-model="turnover" :options="turnoverOptions" label="Annual turnover" placeholder="Select an option" />
          <AkSelect v-model="shipping" :options="shippingOptions" label="Shipping lead time" placeholder="Select an option" />
        </div>

        <AkInput v-model="skus" label="How many Wholesale references does your catalogue include?" type="number" placeholder="Include all product variations: sizes, colours, etc. (1 variation = 1 SKU)" />
        <AkSelect v-model="retailers" :options="retailersOptions" label="How many independent retailers are you currently working with?" placeholder="Select an option" />
        <AkSelect v-model="objective" :options="objectiveOptions" label="What is your main objective in joining Ankorstore?" placeholder="Select an option" />
        <AkSelect v-model="source" :options="sourceOptions" label="How did you hear about Ankorstore?" placeholder="Select an option" />

        <div class="actions">
          <AkButton color="primary" size="lg" @click="submit">Apply</AkButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')
const brandName = ref('')
const brandWebsite = ref('')
const category = ref('')
const subcategory = ref('')
const turnover = ref('')
const shipping = ref('')
const skus = ref('')
const retailers = ref('')
const objective = ref('')
const source = ref('')

const subcategoryMap: Record<string, string[]> = {
  'Home & Living': ['Decoration', 'Kitchen', 'Textile', 'Furniture'],
  'Food & Drinks': ['Sweet', 'Savoury', 'Drinks', 'Epicerie'],
  'Beauty & Wellbeing': ['Skincare', 'Haircare', 'Makeup', 'Wellness'],
  'Fashion & Accessories': ['Clothing', 'Bags', 'Shoes', 'Accessories'],
  Kids: ['Toys', 'Clothing', 'Books', 'Nursery'],
  Stationery: ['Notebooks', 'Cards', 'Writing', 'Gifts'],
  Jewellery: ['Necklaces', 'Earrings', 'Rings', 'Bracelets'],
}

const toOpts = (arr: string[]) => arr.map(v => ({ label: v, value: v }))

const categoryOptions = toOpts(Object.keys(subcategoryMap))
const subcategoryOptions = computed(() => toOpts(subcategoryMap[category.value] || []))
const turnoverOptions = toOpts(['Less than €50,000', '€50,000 - €250,000', '€250,000 - €1,000,000', '€1,000,000 - €5,000,000', 'More than €5,000,000'])
const shippingOptions = toOpts(['1-3 days', '4-7 days', '1-2 weeks', 'More than 2 weeks'])
const retailersOptions = toOpts(['None yet', '1 - 10', '11 - 50', '51 - 200', 'More than 200'])
const objectiveOptions = toOpts(['Acquire new retailers', 'Expand internationally', 'Digitise my wholesale business', 'Test a new market'])
const sourceOptions = toOpts(['Search engine', 'Social media', 'A friend / colleague', 'Event / Trade show', 'Press / Article', 'Other'])

function submit() {
  router.push('/signup')
}
</script>

<style scoped>
.apply-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px 96px;
  background: var(--warm-white, #FBF8F3);
  min-height: 100vh;
}

.apply-hero {
  text-align: center;
  margin-bottom: var(--space-6);
}

.apply-hero__title {
  font-size: clamp(28px, 3.8vw, 48px);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 var(--space-3);
  color: var(--primary);
}

.apply-hero__accent {
  color: var(--warning);
}

.apply-hero__subtitle {
  color: var(--neutral-700);
  font-size: 17px;
  margin: 0;
}

.apply-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-7) clamp(24px, 6vw, 88px);
  box-shadow: var(--shadow-sm);
}

.apply-card__header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.apply-card__title {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.apply-card__note {
  color: var(--neutral-700);
  font-size: 14px;
  margin: 0;
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.row--two {
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 680px) {
  .row--two { grid-template-columns: 1fr; }
}

.divider {
  border: 0;
  border-top: 1px solid var(--color-border-light);
  margin: var(--space-2) 0;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: var(--space-3);
}
</style>
