<template>
  <Transition name="drawer">
    <div v-if="open" class="apd" @click.self="$emit('close')">
      <Transition name="panel">
        <aside v-if="open" class="apd__panel" role="dialog" aria-modal="true">
          <header class="apd__top">
            <div>
              <h2 class="apd__title">Add a product</h2>
              <p class="apd__subtitle">
                <span v-if="savedCount === 0">Fill in the details below.</span>
                <span v-else><strong>{{ savedCount }} added</strong> · keep going or finish</span>
              </p>
            </div>
            <button class="apd__close" @click="$emit('close')" aria-label="Close">
              <AkIcon symbol="x-lg" />
            </button>
          </header>

          <main class="apd__main">
            <!-- Photos -->
            <section class="apd__card">
              <div class="apd__card-head">
                <h3 class="apd__card-title">Photos</h3>
                <span class="apd__card-hint">Up to 8 · main shown first</span>
              </div>
              <div class="apd__gallery">
                <div
                  v-for="(img, i) in form.images"
                  :key="i"
                  class="apd__photo"
                  :class="{ 'apd__photo--main': i === 0 }"
                  :style="{ background: img }"
                >
                  <span v-if="i === 0" class="apd__photo-badge">Main</span>
                  <button class="apd__photo-x" @click="removeImage(i)">×</button>
                </div>
                <button v-if="form.images.length < 8" class="apd__photo-add" @click="addPlaceholderPhoto">
                  <AkIcon symbol="cloud-upload" />
                  <span>Upload</span>
                </button>
              </div>
            </section>

            <!-- Basic info -->
            <section class="apd__card">
              <div class="apd__card-head">
                <h3 class="apd__card-title">Basic info</h3>
              </div>
              <div class="apd__grid">
                <div class="apd__field apd__field--full">
                  <AkInput v-model="form.name" label="Product name" placeholder="e.g. Linen tablecloth · Cream" />
                </div>
                <div class="apd__field apd__field--full">
                  <label class="apd__label">Description</label>
                  <textarea
                    v-model="form.description"
                    class="apd__textarea"
                    placeholder="Short, vivid — what makes this special?"
                    rows="3"
                  ></textarea>
                </div>
                <div class="apd__field">
                  <AkSelect
                    v-model="form.category"
                    :options="categoryOptions"
                    label="Category"
                    placeholder="Pick a category"
                  />
                </div>
                <div class="apd__field">
                  <AkInput v-model="form.madeIn" label="Made in" placeholder="e.g. France" />
                </div>
                <div class="apd__field">
                  <AkInput v-model="form.sku" label="SKU" placeholder="e.g. TC-001-CR" />
                </div>
                <div class="apd__field">
                  <AkInput v-model.number="form.stock" label="Stock" type="number" placeholder="0" />
                </div>
              </div>
            </section>

            <!-- Pricing -->
            <section class="apd__card">
              <div class="apd__card-head">
                <h3 class="apd__card-title">Pricing</h3>
              </div>
              <div class="apd__grid">
                <div class="apd__field">
                  <AkInput v-model.number="form.retail" label="Retail price (€)" type="number" placeholder="0" />
                </div>
                <div class="apd__field">
                  <AkSelect v-model.number="form.vat" :options="vatOptions" label="VAT (%)" />
                </div>
                <div class="apd__field apd__field--full">
                  <label class="apd__label">Wholesale price (€)</label>
                  <div class="apd__wholesale">
                    <button
                      v-if="!form.wholesale && form.retail"
                      class="apd__tick"
                      :title="`Apply suggested €${suggested} · ${suggestedPct}% margin`"
                      @click="acceptSuggestion"
                    >
                      <AkIcon symbol="magic" size="xs" />
                    </button>
                    <input
                      v-model.number="form.wholesale"
                      type="number"
                      class="apd__input"
                      :class="{ 'apd__input--missing': !form.wholesale, 'apd__input--has-tick': !form.wholesale && form.retail }"
                      :placeholder="form.retail ? suggested.toString() : '0'"
                      @focus="seedWholesale"
                      @mousedown="seedWholesale"
                      @keydown="onWholesaleKeydown"
                    />
                  </div>
                  <div v-if="!form.wholesale && form.retail" class="apd__hint">
                    Suggested · {{ suggestedPct }}% margin
                  </div>
                  <div v-if="form.wholesale && form.retail" class="apd__hint apd__hint--ok">
                    {{ Math.round((form.wholesale / form.retail) * 100) }}% margin
                  </div>
                </div>
              </div>
            </section>

            <!-- Variants -->
            <section class="apd__card">
              <div class="apd__card-head">
                <h3 class="apd__card-title">Variants</h3>
                <label class="apd__toggle">
                  <input type="checkbox" v-model="form.hasVariants" />
                  Has variants
                </label>
              </div>

              <div v-if="form.hasVariants">
                <div v-for="(v, i) in form.variants" :key="i" class="apd__variant">
                  <input v-model="v.option" class="apd__input apd__input--bordered" placeholder="Size" />
                  <input v-model="v.colour" class="apd__input apd__input--bordered" placeholder="Colour" />
                  <input v-model="v.sku" class="apd__input apd__input--bordered apd__input--mono" placeholder="SKU" />
                  <input v-model.number="v.stock" type="number" class="apd__input apd__input--bordered" placeholder="Stock" />
                  <button class="apd__variant-x" @click="removeVariant(i)">×</button>
                </div>
                <button class="apd__variant-add" @click="addVariant">
                  <AkIcon symbol="plus" /> Add variant
                </button>
              </div>
            </section>

            <!-- Tags -->
            <section class="apd__card">
              <div class="apd__card-head">
                <h3 class="apd__card-title">Tags</h3>
                <span class="apd__card-hint">{{ form.tags.length }} selected</span>
              </div>
              <div class="apd__tags">
                <button
                  v-for="t in AVAILABLE_TAGS"
                  :key="t"
                  class="apd__tag"
                  :class="{ 'apd__tag--active': form.tags.includes(t) }"
                  @click="toggleTag(t)"
                >
                  <AkIcon :symbol="form.tags.includes(t) ? 'check-lg' : 'plus'" size="xs" />
                  {{ t }}
                </button>
              </div>
            </section>
          </main>

          <footer class="apd__bottom">
            <div class="apd__bottom-info">
              <span v-if="!canSave">Fill in name, category, retail and wholesale to save</span>
              <span v-else><strong>Looks good</strong> — ready to add</span>
            </div>
            <div class="apd__bottom-actions">
              <AkButton outlined @click="$emit('close')">Cancel</AkButton>
              <AkButton outlined symbol="plus-circle" :disabled="!canSave" @click="saveAndAddAnother">
                Save & add another
              </AkButton>
              <AkButton color="primary" symbol="check-lg" :disabled="!canSave" @click="saveAndDone">
                Save & view catalogue
              </AkButton>
            </div>
          </footer>
        </aside>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const router = useRouter()
const { addProduct } = useBrandStore()

const CATEGORIES = [
  'Home & Living', 'Beauty & Wellbeing', 'Food & Drinks',
  'Fashion & Accessories', 'Kids', 'Stationery', 'Jewellery',
]

const SUGGESTED_BY_CATEGORY: Record<string, number> = {
  'Home & Living': 50, 'Beauty & Wellbeing': 45, 'Food & Drinks': 60,
  'Fashion & Accessories': 50, Kids: 50, Stationery: 50, Jewellery: 40,
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

interface Form {
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

const empty = (): Form => ({
  images: [], name: '', description: '', category: '', madeIn: '',
  sku: '', stock: 0, retail: 0, vat: 20, wholesale: null,
  hasVariants: false, variants: [], tags: [],
})

const form = reactive<Form>(empty())
const savedCount = ref(0)

watch(() => props.open, (o) => {
  if (o) { Object.assign(form, empty()); savedCount.value = 0 }
})

const suggestedPct = computed(() => SUGGESTED_BY_CATEGORY[form.category] ?? 50)
const suggested = computed(() =>
  form.retail ? Math.round(form.retail * (suggestedPct.value / 100)) : 0,
)

function acceptSuggestion() { form.wholesale = suggested.value }

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

const PLACEHOLDER_GRADS = [
  'linear-gradient(135deg,#e8e4de,#c8bdb0)',
  'linear-gradient(135deg,#d4cdc4,#a89e91)',
  'linear-gradient(135deg,#f0ece6,#c8bdb0)',
  'linear-gradient(135deg,#b8a890,#7a6e62)',
]

function addPlaceholderPhoto() {
  form.images.push(PLACEHOLDER_GRADS[form.images.length % PLACEHOLDER_GRADS.length])
}
function removeImage(i: number) { form.images.splice(i, 1) }

function addVariant() {
  form.variants.push({ option: '', colour: '', sku: '', stock: 0, retail: form.retail, wholesale: null })
}
function removeVariant(i: number) { form.variants.splice(i, 1) }

function toggleTag(t: string) {
  const i = form.tags.indexOf(t)
  if (i === -1) form.tags.push(t); else form.tags.splice(i, 1)
}

const canSave = computed(() =>
  !!form.name && !!form.category && form.retail > 0 && (form.wholesale ?? 0) > 0,
)

function commit() {
  addProduct({
    name: form.name,
    category: form.category,
    sku: form.sku || `SKU-${Date.now().toString(36).toUpperCase()}`,
    stock: form.stock,
    retail: form.retail,
    wholesale: form.wholesale ?? 0,
    vat: form.vat,
    madeIn: form.madeIn,
    description: form.description,
    images: form.images.length > 0 ? form.images : [PLACEHOLDER_GRADS[0]],
    tags: [...form.tags],
    variants: form.hasVariants ? form.variants.length : 0,
  })
  savedCount.value += 1
}

function saveAndAddAnother() {
  commit()
  Object.assign(form, empty())
}

function saveAndDone() {
  commit()
  emit('close')
  router.push('/mvp/products')
}
</script>

<style scoped>
.apd {
  position: fixed;
  inset: 0;
  background: rgba(20, 6, 10, 0.4);
  z-index: var(--z-modal-backdrop);
  display: flex;
  justify-content: flex-end;
}

.apd__panel {
  width: min(680px, 100%);
  height: 100%;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.08);
  z-index: var(--z-modal);
}

.apd__top {
  background: var(--white);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  flex-shrink: 0;
}

.apd__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.apd__subtitle {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 4px 0 0;
}

.apd__subtitle strong { color: var(--success); }

.apd__close {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-family: inherit;
}

.apd__close:hover { background: var(--neutral-100); }

.apd__main {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Cards */
.apd__card {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.apd__card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.apd__card-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.apd__card-hint {
  font-size: 12px;
  color: var(--neutral-700);
}

/* Grid */
.apd__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.apd__field--full { grid-column: 1 / -1; }

.apd__label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 6px;
}

.apd__input {
  width: 100%;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background: var(--white);
  font-family: inherit;
  font-size: 13px;
  color: var(--primary);
  outline: none;
}

.apd__input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06); }
.apd__input--bordered { background: var(--white); }
.apd__input--mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }
.apd__input--has-tick { padding-left: 36px; }

.apd__input--missing {
  background: #FEF2F2;
  border-color: var(--error);
}

.apd__input--missing::placeholder { color: var(--error); font-weight: 600; }

.apd__textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  background: var(--white);
  font-family: inherit;
  font-size: 13px;
  color: var(--primary);
  resize: vertical;
  outline: none;
  line-height: 1.5;
}

.apd__textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06); }

/* Wholesale */
.apd__wholesale {
  position: relative;
  display: flex;
  align-items: center;
}

.apd__tick {
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
}

.apd__tick:hover { background: var(--primary); }

.apd__hint {
  font-size: 11px;
  color: var(--neutral-700);
  margin-top: 4px;
  font-weight: 600;
}

.apd__hint--ok { color: var(--accent, #517070); }

/* Photos */
.apd__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.apd__photo {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.apd__photo--main { outline: 2px solid var(--primary); outline-offset: 2px; }

.apd__photo-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: var(--primary);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.apd__photo-x {
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

.apd__photo-add {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border-light);
  background: var(--warm-white, #FBF8F3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--neutral-700);
  cursor: pointer;
  font-family: inherit;
}

.apd__photo-add:hover { border-color: var(--primary); color: var(--primary); }

/* Variants */
.apd__toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
  font-weight: 600;
}

.apd__toggle input { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }

.apd__variant {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 80px 32px;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.apd__variant-x {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border-light);
  color: var(--neutral-700);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  align-self: center;
}

.apd__variant-x:hover { color: var(--error); border-color: var(--error); }

.apd__variant-add {
  margin-top: var(--space-2);
  padding: 8px 12px;
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

/* Tags */
.apd__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.apd__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
}

.apd__tag:hover { border-color: var(--primary); }

.apd__tag--active {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

/* Bottom */
.apd__bottom {
  background: var(--white);
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-3) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.apd__bottom-info {
  font-size: 12px;
  color: var(--neutral-700);
}

.apd__bottom-info strong { color: var(--success); }

.apd__bottom-actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Transitions */
.drawer-enter-active, .drawer-leave-active { transition: opacity 220ms ease; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }

.panel-enter-active, .panel-leave-active { transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1); }
.panel-enter-from, .panel-leave-to { transform: translateX(100%); }
</style>
