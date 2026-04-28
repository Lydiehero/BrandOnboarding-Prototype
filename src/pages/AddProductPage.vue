<template>
  <div class="ap-page">
    <header class="ap-top">
      <button class="ap-back" @click="goBack">
        <AkIcon symbol="chevron-left" size="sm" />
        Back to catalogue
      </button>
      <span class="ap-counter">{{ savedCount > 0 ? `${savedCount} added so far` : '' }}</span>
    </header>

    <main class="ap-main">
      <div class="ap-intro">
        <h1 class="ap-title">Add a product</h1>
        <p class="ap-subtitle">
          Fill in the details below. You can save and add another, or save and go back to your dashboard.
        </p>
      </div>

      <!-- Photos card -->
      <section class="ap-card">
        <div class="ap-card__head">
          <h2 class="ap-card__title">Photos</h2>
          <span class="ap-card__hint">Up to 8 · main shown first · drag to reorder</span>
        </div>
        <div class="ap-gallery">
          <div
            v-for="(img, i) in form.images"
            :key="i"
            class="ap-gallery__item"
            :class="{ 'ap-gallery__item--main': i === 0 }"
            :style="{ background: img }"
          >
            <span v-if="i === 0" class="ap-gallery__badge">Main</span>
            <button class="ap-gallery__remove" @click="removeImage(i)">×</button>
          </div>
          <button v-if="form.images.length < 8" class="ap-gallery__add" @click="addPlaceholderPhoto">
            <AkIcon symbol="cloud-upload" />
            <span>Upload photo</span>
          </button>
        </div>
      </section>

      <!-- Basic info -->
      <section class="ap-card">
        <div class="ap-card__head">
          <h2 class="ap-card__title">Basic info</h2>
        </div>
        <div class="ap-grid">
          <div class="ap-field ap-field--full">
            <AkInput v-model="form.name" label="Product name" placeholder="e.g. Linen tablecloth · Cream" />
          </div>
          <div class="ap-field ap-field--full">
            <label class="ap-label">Description</label>
            <textarea
              v-model="form.description"
              class="ap-textarea"
              placeholder="A short, vivid description — what makes this product special?"
              rows="3"
            ></textarea>
          </div>
          <div class="ap-field">
            <AkSelect
              v-model="form.category"
              :options="categoryOptions"
              label="Category"
              placeholder="Pick a category"
            />
          </div>
          <div class="ap-field">
            <AkInput v-model="form.madeIn" label="Made in" placeholder="e.g. France" />
          </div>
          <div class="ap-field">
            <AkInput v-model="form.sku" label="SKU" placeholder="e.g. TC-001-CR" />
          </div>
          <div class="ap-field">
            <AkInput v-model.number="form.stock" label="Stock" type="number" placeholder="0" />
          </div>
        </div>
      </section>

      <!-- Pricing -->
      <section class="ap-card">
        <div class="ap-card__head">
          <h2 class="ap-card__title">Pricing</h2>
          <span class="ap-card__hint">Wholesale = what retailers pay you · Margin shown live</span>
        </div>
        <div class="ap-grid">
          <div class="ap-field">
            <AkInput v-model.number="form.retail" label="Retail price (€)" type="number" placeholder="0" />
          </div>
          <div class="ap-field">
            <AkSelect
              v-model.number="form.vat"
              :options="vatOptions"
              label="VAT (%)"
            />
          </div>
          <div class="ap-field">
            <label class="ap-label">Wholesale price (€)</label>
            <div class="ap-wholesale">
              <button
                v-if="!form.wholesale && form.retail"
                class="ap-wholesale__tick"
                :title="`Apply suggested €${suggested} · ${suggestedPct}% margin`"
                @click="acceptSuggestion"
              >
                <AkIcon symbol="magic" size="xs" />
              </button>
              <input
                v-model.number="form.wholesale"
                type="number"
                class="ap-input"
                :class="{ 'ap-input--missing': !form.wholesale, 'ap-input--has-tick': !form.wholesale && form.retail }"
                :placeholder="form.retail ? suggested.toString() : '0'"
                @focus="seedWholesale"
                @mousedown="seedWholesale"
                @keydown="onWholesaleKeydown"
              />
            </div>
            <div v-if="!form.wholesale && form.retail" class="ap-hint">
              Suggested · {{ suggestedPct }}% margin for {{ form.category || 'this category' }}
            </div>
            <div v-if="form.wholesale && form.retail" class="ap-hint ap-hint--ok">
              {{ Math.round((form.wholesale / form.retail) * 100) }}% margin
            </div>
          </div>
        </div>
      </section>

      <!-- Variants -->
      <section class="ap-card">
        <div class="ap-card__head">
          <h2 class="ap-card__title">Variants</h2>
          <label class="ap-toggle">
            <input type="checkbox" v-model="form.hasVariants" />
            This product has variants (size, colour…)
          </label>
        </div>

        <div v-if="form.hasVariants">
          <div class="ap-variants">
            <div class="ap-variants__head">
              <div>Size / option</div>
              <div>Colour</div>
              <div>SKU</div>
              <div>Stock</div>
              <div>Retail €</div>
              <div>Wholesale €</div>
              <div></div>
            </div>
            <div v-for="(v, i) in form.variants" :key="i" class="ap-variants__row">
              <input v-model="v.option" class="ap-input ap-input--bordered" placeholder="Small" />
              <input v-model="v.colour" class="ap-input ap-input--bordered" placeholder="Cream" />
              <input v-model="v.sku" class="ap-input ap-input--bordered ap-input--mono" placeholder="SKU-VAR" />
              <input v-model.number="v.stock" type="number" class="ap-input ap-input--bordered" placeholder="0" />
              <input v-model.number="v.retail" type="number" class="ap-input ap-input--bordered" placeholder="0" />
              <input v-model.number="v.wholesale" type="number" class="ap-input ap-input--bordered" placeholder="0" />
              <button class="ap-variants__remove" @click="removeVariant(i)">×</button>
            </div>
          </div>
          <button class="ap-variants__add" @click="addVariant">
            <AkIcon symbol="plus" /> Add variant
          </button>
        </div>
      </section>

      <!-- Tags -->
      <section class="ap-card">
        <div class="ap-card__head">
          <h2 class="ap-card__title">Tags</h2>
          <span class="ap-card__hint">Helps retailers filter and find you · {{ form.tags.length }} selected</span>
        </div>
        <div class="ap-tags">
          <button
            v-for="t in AVAILABLE_TAGS"
            :key="t"
            class="ap-tag"
            :class="{ 'ap-tag--active': form.tags.includes(t) }"
            @click="toggleTag(t)"
          >
            <AkIcon :symbol="form.tags.includes(t) ? 'check-lg' : 'plus'" size="xs" />
            {{ t }}
          </button>
        </div>
      </section>
    </main>

    <!-- Sticky bottom bar -->
    <footer class="ap-bottombar">
      <div class="ap-bottombar__info">
        <span v-if="!canSave">Fill in name, category, retail and wholesale to save</span>
        <span v-else><strong>Looks good</strong> — ready to add to your catalogue</span>
      </div>
      <div class="ap-bottombar__actions">
        <AkButton outlined @click="goBack">Cancel</AkButton>
        <AkButton outlined symbol="plus-circle" :disabled="!canSave" @click="saveAndAddAnother">
          Save & add another
        </AkButton>
        <AkButton color="primary" symbol="check-lg" :disabled="!canSave" @click="saveAndDone">
          Save & finish
        </AkButton>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const CATEGORIES = [
  'Home & Living',
  'Beauty & Wellbeing',
  'Food & Drinks',
  'Fashion & Accessories',
  'Kids',
  'Stationery',
  'Jewellery',
]

const SUGGESTED_BY_CATEGORY: Record<string, number> = {
  'Home & Living': 50,
  'Beauty & Wellbeing': 45,
  'Food & Drinks': 60,
  'Fashion & Accessories': 50,
  Kids: 50,
  Stationery: 50,
  Jewellery: 40,
}

const AVAILABLE_TAGS = [
  'Organic', 'Handmade', 'Eco-Friendly', 'Zero waste', 'Cruelty free',
  'Bestseller', 'Vegan', 'Contains alcohol', 'Made in France',
  'Limited edition', 'Award winning', 'GOTS certified',
]

const categoryOptions = CATEGORIES.map(c => ({ label: c, value: c }))
const vatOptions = [
  { label: '20%', value: 20 },
  { label: '10%', value: 10 },
  { label: '5.5%', value: 5.5 },
  { label: '0%', value: 0 },
]

interface Variant {
  option: string
  colour: string
  sku: string
  stock: number
  retail: number
  wholesale: number | null
}

interface ProductForm {
  images: string[]
  name: string
  description: string
  category: string
  madeIn: string
  sku: string
  stock: number
  retail: number
  vat: number
  wholesale: number | null
  hasVariants: boolean
  variants: Variant[]
  tags: string[]
}

const emptyForm = (): ProductForm => ({
  images: [],
  name: '',
  description: '',
  category: '',
  madeIn: '',
  sku: '',
  stock: 0,
  retail: 0,
  vat: 20,
  wholesale: null,
  hasVariants: false,
  variants: [],
  tags: [],
})

const form = reactive<ProductForm>(emptyForm())
const savedCount = ref(0)

// ── Wholesale logic ──
const suggestedPct = computed(() => SUGGESTED_BY_CATEGORY[form.category] ?? 50)
const suggested = computed(() =>
  form.retail ? Math.round(form.retail * (suggestedPct.value / 100)) : 0,
)

function acceptSuggestion() {
  form.wholesale = suggested.value
}

function seedWholesale() {
  if ((form.wholesale === null || form.wholesale === undefined || (form.wholesale as unknown as string) === '') && form.retail) {
    form.wholesale = suggested.value
  }
}

function onWholesaleKeydown(e: KeyboardEvent) {
  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !form.wholesale && form.retail) {
    e.preventDefault()
    form.wholesale = suggested.value + (e.key === 'ArrowUp' ? 1 : -1)
  }
}

// ── Photos ──
const PLACEHOLDER_GRADS = [
  'linear-gradient(135deg,#e8e4de,#c8bdb0)',
  'linear-gradient(135deg,#d4cdc4,#a89e91)',
  'linear-gradient(135deg,#f0ece6,#c8bdb0)',
  'linear-gradient(135deg,#b8a890,#7a6e62)',
]

function addPlaceholderPhoto() {
  const grad = PLACEHOLDER_GRADS[form.images.length % PLACEHOLDER_GRADS.length]
  form.images.push(grad)
}

function removeImage(i: number) {
  form.images.splice(i, 1)
}

// ── Variants ──
function addVariant() {
  form.variants.push({ option: '', colour: '', sku: '', stock: 0, retail: form.retail, wholesale: null })
}
function removeVariant(i: number) {
  form.variants.splice(i, 1)
}

// ── Tags ──
function toggleTag(t: string) {
  const i = form.tags.indexOf(t)
  if (i === -1) form.tags.push(t)
  else form.tags.splice(i, 1)
}

// ── Save ──
const canSave = computed(() =>
  !!form.name && !!form.category && form.retail > 0 && (form.wholesale ?? 0) > 0,
)

function resetForm() {
  Object.assign(form, emptyForm())
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function saveAndAddAnother() {
  savedCount.value += 1
  resetForm()
}

function saveAndDone() {
  savedCount.value += 1
  router.push('/mvp/dashboard')
}

function goBack() {
  router.push('/mvp/dashboard')
}
</script>

<style scoped>
.ap-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  flex-direction: column;
}

.ap-top {
  background: var(--white);
  border-bottom: 1px solid var(--color-border-light);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
}

.ap-back {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  padding: var(--space-2);
}

.ap-counter {
  font-size: 13px;
  color: var(--success);
  font-weight: 600;
}

.ap-main {
  flex: 1;
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-6);
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ap-intro { margin-bottom: var(--space-2); }

.ap-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 var(--space-2);
}

.ap-subtitle {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
}

/* Cards */
.ap-card {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ap-card__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.ap-card__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.ap-card__hint {
  font-size: 12px;
  color: var(--neutral-700);
}

/* Grid */
.ap-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.ap-field--full { grid-column: 1 / -1; }

.ap-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 6px;
}

.ap-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background: var(--white);
  font-family: inherit;
  font-size: 14px;
  color: var(--primary);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.ap-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06);
}

.ap-input--bordered { background: var(--white); }
.ap-input--mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }
.ap-input--has-tick { padding-left: 36px; }

.ap-input--missing {
  background: #FEF2F2;
  border-color: var(--error);
}

.ap-input--missing::placeholder {
  color: var(--error);
  font-weight: 600;
}

.ap-textarea {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background: var(--white);
  font-family: inherit;
  font-size: 14px;
  color: var(--primary);
  resize: vertical;
  outline: none;
  line-height: 1.5;
}

.ap-textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06);
}

/* Wholesale cell */
.ap-wholesale {
  position: relative;
  display: flex;
  align-items: center;
}

.ap-wholesale__tick {
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent, #517070);
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: transform 150ms ease, background 150ms ease;
}

.ap-wholesale__tick:hover {
  background: var(--primary);
  transform: translateY(-50%) scale(1.08);
}

.ap-hint {
  font-size: 11px;
  color: var(--neutral-700);
  margin-top: 4px;
  font-weight: 600;
}

.ap-hint--ok { color: var(--accent, #517070); }

/* Gallery */
.ap-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.ap-gallery__item {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.ap-gallery__item--main {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.ap-gallery__badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: var(--primary);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ap-gallery__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  color: var(--neutral-700);
  font-size: 14px;
  cursor: pointer;
  line-height: 1;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ap-gallery__remove:hover { color: var(--error); border-color: var(--error); }

.ap-gallery__add {
  width: 110px;
  height: 110px;
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border-light);
  background: var(--warm-white, #FBF8F3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-700);
  cursor: pointer;
  font-family: inherit;
}

.ap-gallery__add:hover { border-color: var(--primary); color: var(--primary); }

/* Variants */
.ap-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
  font-weight: 600;
}

.ap-toggle input { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }

.ap-variants {
  background: var(--neutral-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ap-variants__head,
.ap-variants__row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr 80px 100px 110px 32px;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2) var(--space-3);
}

.ap-variants__head {
  font-size: 11px;
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border-light);
}

.ap-variants__row { border-top: 1px solid var(--color-border-light); background: var(--white); }
.ap-variants__row:first-of-type { border-top: none; }

.ap-variants__remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border-light);
  color: var(--neutral-700);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}

.ap-variants__remove:hover { color: var(--error); border-color: var(--error); }

.ap-variants__add {
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px dashed var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  width: fit-content;
}

.ap-variants__add:hover { border-color: var(--primary); }

/* Tags */
.ap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.ap-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
  transition: background 150ms ease, border-color 150ms ease;
}

.ap-tag:hover { border-color: var(--primary); }

.ap-tag--active {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

/* Bottom bar */
.ap-bottombar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--white);
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-3) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  z-index: var(--z-sticky);
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
}

.ap-bottombar__info {
  font-size: 13px;
  color: var(--neutral-700);
}

.ap-bottombar__info strong { color: var(--success); }

.ap-bottombar__actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
</style>
