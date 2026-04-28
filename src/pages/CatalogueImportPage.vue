<template>
  <div class="ci-page">
    <header class="ci-top">
      <button class="ci-back" @click="goBack">
        <AkIcon symbol="chevron-left" size="sm" />
        Back to dashboard
      </button>
    </header>

    <main class="ci-main" :class="{ 'ci-main--wide': step === 3, 'ci-main--center': step === 2 || step === 4 }">
      <!-- ── STEP 1: Confirm detection ── -->
      <section v-if="step === 1" class="ci-section">
        <div class="ci-section__intro">
          <h1 class="ci-title">Let's import your catalogue</h1>
          <p class="ci-subtitle">
            We checked the website you gave us during signup. Pick the path that fits.
          </p>
        </div>

        <div class="ci-demo-switch">
          <span class="ci-demo-switch__label">Select option:</span>
          <button
            v-for="opt in detectionStates"
            :key="opt.key"
            class="ci-demo-switch__btn"
            :class="{ 'ci-demo-switch__btn--active': detectionState === opt.key }"
            @click="detectionState = opt.key"
          >
            {{ opt.label }}
          </button>
        </div>

        <article v-if="detectionState === 'guide'" class="ci-detect ci-detect--info">
          <div class="ci-detect__head">
            <div class="ci-detect__logo ci-detect__logo--magento">M</div>
            <div>
              <p class="ci-detect__eyebrow">Detected provider</p>
              <h2 class="ci-detect__title">Magento</h2>
              <p class="ci-detect__url">{{ websiteUrl }}</p>
            </div>
            <AkBadge content="Manual export" color="blue" size="sm" />
          </div>
          <p class="ci-detect__note">
            We can't connect directly to Magento, but here's how to export your products in 3 steps:
          </p>
          <ol class="ci-steps-list">
            <li>Open your Magento admin → <strong>Catalog</strong> → <strong>Products</strong></li>
            <li>Click <strong>Export</strong> and choose <strong>CSV</strong> format</li>
            <li>Upload the file below — we'll handle the rest</li>
          </ol>
          <div class="ci-upload">
            <AkIcon symbol="cloud-upload" />
            <p class="ci-upload__title">Drop your CSV file here</p>
            <p class="ci-upload__sub">or <a href="#" @click.prevent>browse files</a> · CSV, XLS, XLSX</p>
          </div>
          <div class="ci-detect__actions">
            <AkButton color="primary" symbol="magic" @click="startImport">
              Import my catalogue
            </AkButton>
            <AkButton outlined>Download our template instead</AkButton>
          </div>
        </article>

        <p class="ci-alt-link">
          Don't have many products? <a href="#" @click.prevent="goToManual">I'd rather add them one by one</a>
        </p>

        <article v-if="detectionState === 'unknown'" class="ci-detect">
          <div class="ci-detect__head">
            <div class="ci-detect__logo ci-detect__logo--unknown">?</div>
            <div>
              <p class="ci-detect__eyebrow">Couldn't detect a provider</p>
              <h2 class="ci-detect__title">Use our template</h2>
              <p class="ci-detect__url">{{ websiteUrl || 'No website on file' }}</p>
            </div>
          </div>
          <p class="ci-detect__note">
            No worries — download our spreadsheet template, fill it in, and upload it back.
            We'll auto-map everything for you.
          </p>
          <div class="ci-detect__actions">
            <AkButton color="primary" symbol="download">Download Ankorstore template</AkButton>
            <AkButton outlined symbol="magic" @click="startImport">Import my catalogue</AkButton>
          </div>
        </article>
      </section>

      <!-- ── STEP 2: Processing ── -->
      <section v-if="step === 2" class="ci-section ci-section--center">
        <div class="ci-processing">
          <div class="ci-processing__icon">
            <div class="ci-spinner"></div>
          </div>
          <p class="ci-processing__eyebrow">Working on it…</p>
          <h1 class="ci-processing__title">Importing your catalogue</h1>
          <p class="ci-processing__sub">
            Pulling your products from <strong>{{ websiteUrl }}</strong> — this usually takes
            <strong>{{ estimatedSeconds }} seconds</strong>. You can stay on this page or come back later.
          </p>

          <div class="ci-processing__stats">
            <div class="ci-pstat">
              <AkIcon symbol="box-seam" />
              <div>
                <div class="ci-pstat__num">{{ importedCount }} <span>/ {{ totalProducts }}</span></div>
                <div class="ci-pstat__label">products imported</div>
              </div>
            </div>
            <div class="ci-pstat">
              <AkIcon symbol="clock-history" />
              <div>
                <div class="ci-pstat__num">{{ remainingSeconds }}s</div>
                <div class="ci-pstat__label">remaining</div>
              </div>
            </div>
            <div class="ci-pstat">
              <AkIcon symbol="image" />
              <div>
                <div class="ci-pstat__num">{{ importedImages }}</div>
                <div class="ci-pstat__label">images downloaded</div>
              </div>
            </div>
          </div>

          <div class="ci-progress">
            <div class="ci-progress__bar" :style="{ width: progressPct + '%' }"></div>
          </div>

          <ul class="ci-checklist">
            <li :class="{ 'ci-check--done': progressPct > 5 }">
              <AkIcon :symbol="progressPct > 5 ? 'check-circle-fill' : 'circle'" />
              Reading your file
            </li>
            <li :class="{ 'ci-check--done': progressPct > 30, 'ci-check--active': progressPct > 5 && progressPct <= 30 }">
              <AkIcon :symbol="progressPct > 30 ? 'check-circle-fill' : 'circle'" />
              Extracting product details
            </li>
            <li :class="{ 'ci-check--done': progressPct > 65, 'ci-check--active': progressPct > 30 && progressPct <= 65 }">
              <AkIcon :symbol="progressPct > 65 ? 'check-circle-fill' : 'circle'" />
              Mapping fields to Ankorstore
            </li>
            <li :class="{ 'ci-check--done': progressPct >= 100, 'ci-check--active': progressPct > 65 && progressPct < 100 }">
              <AkIcon :symbol="progressPct >= 100 ? 'check-circle-fill' : 'circle'" />
              Downloading images
            </li>
          </ul>

          <div class="ci-tip">
            <AkIcon symbol="lightbulb" />
            <div>
              <strong>While you wait:</strong> Brands with photos and descriptions in their imports
              go live <strong>2× faster</strong>. Don't worry if some fields are missing — you'll
              fix them in the next step.
            </div>
          </div>
        </div>
      </section>

      <!-- ── STEP 3: Review (full page editable table) ── -->
      <section v-if="step === 3" class="ci-review">
        <div class="ci-review__head">
          <div>
            <h1 class="ci-title">Review your products</h1>
            <p class="ci-subtitle">
              We imported {{ products.length }} products. Click any cell to edit, or expand a row to manage photos, variants, and tags.
              Cells highlighted in red need your attention.
            </p>
          </div>
          <div class="ci-review__summary">
            <div class="ci-summary-stat">
              <span class="ci-summary-stat__num">{{ products.length }}</span>
              <span class="ci-summary-stat__label">total</span>
            </div>
            <div class="ci-summary-stat ci-summary-stat--ok">
              <span class="ci-summary-stat__num">{{ readyCount }}</span>
              <span class="ci-summary-stat__label">ready</span>
            </div>
            <div class="ci-summary-stat ci-summary-stat--warn">
              <span class="ci-summary-stat__num">{{ missingWholesaleCount }}</span>
              <span class="ci-summary-stat__label">need wholesale price</span>
            </div>
          </div>
        </div>

        <!-- Bulk edit toolbar -->
        <div class="ci-bulk">
          <div class="ci-bulk__left">
            <label class="ci-bulk__check">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate.prop="someSelected && !allSelected"
                @change="toggleSelectAll"
              />
              <span v-if="selectedIds.length === 0">Select products to bulk edit</span>
              <span v-else><strong>{{ selectedIds.length }}</strong> selected</span>
            </label>
            <button
              v-if="selectedIds.length === 0"
              class="ci-bulk__quick"
              @click="selectMissingWholesale"
            >
              Select {{ missingWholesaleCount }} missing wholesale prices
            </button>
          </div>

          <div v-if="selectedIds.length > 0" class="ci-bulk__actions">
            <span class="ci-bulk__label">Set wholesale at</span>
            <div class="ci-bulk__input-wrap">
              <input
                v-model.number="bulkPct"
                type="number"
                min="1"
                max="99"
                class="ci-bulk__input"
              />
              <span class="ci-bulk__suffix">% of retail</span>
            </div>
            <AkButton color="primary" size="sm" symbol="check-lg" @click="applyBulkWholesale">
              Apply to {{ selectedIds.length }}
            </AkButton>
            <button class="ci-bulk__clear" @click="selectedIds = []">Clear selection</button>
          </div>
        </div>

        <!-- Editable table -->
        <div class="ci-table">
          <div class="ci-table__head">
            <div class="ci-th ci-th--check"></div>
            <div class="ci-th ci-th--img"></div>
            <div class="ci-th">Product</div>
            <div class="ci-th">Category</div>
            <div class="ci-th ci-th--num">SKU</div>
            <div class="ci-th ci-th--num">Stock</div>
            <div class="ci-th ci-th--num">Retail €</div>
            <div class="ci-th ci-th--num">VAT %</div>
            <div class="ci-th ci-th--num ci-th--highlight">
              Wholesale €
              <span class="ci-th__hint">Suggested in placeholder</span>
            </div>
            <div class="ci-th ci-th--num">Margin</div>
            <div class="ci-th ci-th--chev"></div>
          </div>

          <template v-for="p in products" :key="p.id">
            <div
              class="ci-tr"
              :class="{
                'ci-tr--warn': hasMissing(p),
                'ci-tr--expanded': expanded === p.id,
                'ci-tr--selected': selectedIds.includes(p.id),
              }"
              @click="toggleExpand(p.id)"
            >
              <div class="ci-td ci-td--check" @click.stop>
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(p.id)"
                  @change="toggleSelect(p.id)"
                />
              </div>
              <div class="ci-td ci-td--img" @click.stop>
                <div class="ci-thumb-wrap">
                  <div class="ci-thumb" :style="{ background: p.images[0] }"></div>
                  <span v-if="p.images.length > 1" class="ci-thumb-count">+{{ p.images.length - 1 }}</span>
                </div>
              </div>
              <div class="ci-td" @click.stop>
                <input v-model="p.name" class="ci-input ci-input--bold" />
                <div class="ci-flags">
                  <span v-if="p.variants?.length" class="ci-flag ci-flag--info">
                    <AkIcon symbol="grid-3x3" size="xs" /> {{ p.variants.length }} variants
                  </span>
                  <span v-for="m in missingFlags(p)" :key="m" class="ci-flag ci-flag--error">
                    <AkIcon symbol="exclamation-circle-fill" size="xs" /> {{ m }}
                  </span>
                </div>
              </div>
              <div class="ci-td" @click.stop>
                <select v-model="p.category" class="ci-input">
                  <option v-for="c in CATEGORIES" :key="c">{{ c }}</option>
                </select>
              </div>
              <div class="ci-td ci-td--num" @click.stop>
                <input v-model="p.sku" class="ci-input ci-input--mono" />
              </div>
              <div class="ci-td ci-td--num" @click.stop>
                <input v-model.number="p.stock" type="number" class="ci-input" />
              </div>
              <div class="ci-td ci-td--num" @click.stop>
                <input v-model.number="p.retail" type="number" class="ci-input" />
              </div>
              <div class="ci-td ci-td--num" @click.stop>
                <select v-model.number="p.vat" class="ci-input">
                  <option :value="20">20</option>
                  <option :value="10">10</option>
                  <option :value="5.5">5.5</option>
                  <option :value="0">0</option>
                </select>
              </div>
              <div class="ci-td ci-td--num ci-td--highlight" @click.stop>
                <div class="ci-wholesale-cell">
                  <button
                    v-if="!p.wholesale"
                    class="ci-suggest-tick"
                    :title="`Apply suggested €${suggestedFor(p)} · ${SUGGESTED_BY_CATEGORY[p.category] ?? 50}% margin`"
                    @click.stop="acceptSuggestion(p)"
                  >
                    <AkIcon symbol="magic" size="xs" />
                  </button>
                  <input
                    v-model.number="p.wholesale"
                    type="number"
                    class="ci-input"
                    :class="{ 'ci-input--missing': !p.wholesale, 'ci-input--has-tick': !p.wholesale }"
                    :placeholder="suggestedFor(p).toString()"
                    @focus="seedWholesale(p)"
                    @mousedown="seedWholesale(p)"
                    @keydown="onWholesaleKeydown(p, $event)"
                  />
                </div>
                <div v-if="!p.wholesale" class="ci-cell-hint">
                  Suggested · {{ SUGGESTED_BY_CATEGORY[p.category] ?? 50 }}% margin
                </div>
              </div>
              <div class="ci-td ci-td--num ci-td--margin">
                {{ p.wholesale && p.retail ? Math.round((p.wholesale / p.retail) * 100) + '%' : '—' }}
              </div>
              <div class="ci-td ci-td--chev">
                <AkIcon :symbol="expanded === p.id ? 'chevron-up' : 'chevron-down'" size="sm" />
              </div>
            </div>

            <!-- Expanded panel -->
            <div v-if="expanded === p.id" class="ci-expand" @click.stop>
              <!-- Photos -->
              <div class="ci-expand__section">
                <div class="ci-expand__head">
                  <h4 class="ci-expand__title">Photos</h4>
                  <span class="ci-expand__count">{{ p.images.length }} imported · max 8</span>
                </div>
                <div class="ci-gallery">
                  <div
                    v-for="(img, i) in p.images"
                    :key="i"
                    class="ci-gallery__item"
                    :class="{ 'ci-gallery__item--main': i === 0 }"
                    :style="{ background: img }"
                  >
                    <span v-if="i === 0" class="ci-gallery__badge">Main</span>
                    <button class="ci-gallery__remove" @click="removeImage(p, i)">×</button>
                  </div>
                  <button v-if="p.images.length < 8" class="ci-gallery__add">
                    <AkIcon symbol="plus" />
                    Add photo
                  </button>
                </div>
                <p class="ci-expand__hint">
                  The first photo is the main one shown in search results. Drag to reorder.
                </p>
              </div>

              <!-- Description + Made in + VAT context -->
              <div class="ci-expand__row">
                <div class="ci-expand__col">
                  <div class="ci-expand__head">
                    <h4 class="ci-expand__title">Description</h4>
                  </div>
                  <textarea
                    v-model="p.description"
                    class="ci-textarea"
                    :class="{ 'ci-input--missing': !p.description }"
                    :placeholder="!p.description ? 'Add a description — required to publish' : ''"
                    rows="4"
                  ></textarea>
                </div>
                <div class="ci-expand__col ci-expand__col--narrow">
                  <div class="ci-expand__head">
                    <h4 class="ci-expand__title">Made in</h4>
                  </div>
                  <input
                    v-model="p.madeIn"
                    class="ci-input ci-input--bordered"
                    placeholder="e.g. France"
                  />
                  <p class="ci-expand__hint" style="margin-top: 8px;">
                    Often part of your import. Retailers filter by origin.
                  </p>
                </div>
              </div>

              <!-- Variants -->
              <div v-if="p.variants?.length" class="ci-expand__section">
                <div class="ci-expand__head">
                  <h4 class="ci-expand__title">Variants ({{ p.variants.length }})</h4>
                  <span class="ci-expand__count">Each variant has its own SKU and stock</span>
                </div>
                <div class="ci-variants">
                  <div class="ci-variants__head">
                    <div>Size / option</div>
                    <div>Colour</div>
                    <div>SKU</div>
                    <div>Stock</div>
                    <div>Retail €</div>
                    <div>Wholesale €</div>
                    <div></div>
                  </div>
                  <div v-for="(v, i) in p.variants" :key="i" class="ci-variants__row">
                    <input v-model="v.option" class="ci-input ci-input--bordered" />
                    <input v-model="v.colour" class="ci-input ci-input--bordered" />
                    <input v-model="v.sku" class="ci-input ci-input--bordered ci-input--mono" />
                    <input v-model.number="v.stock" type="number" class="ci-input ci-input--bordered" />
                    <input v-model.number="v.retail" type="number" class="ci-input ci-input--bordered" />
                    <input v-model.number="v.wholesale" type="number" class="ci-input ci-input--bordered" :class="{ 'ci-input--missing': !v.wholesale }" :placeholder="!v.wholesale ? 'Required' : ''" />
                    <button class="ci-variants__remove" @click="removeVariant(p, i)">×</button>
                  </div>
                </div>
                <button class="ci-variants__add" @click="addVariant(p)">
                  <AkIcon symbol="plus" /> Add variant
                </button>
              </div>

              <!-- Tags -->
              <div class="ci-expand__section">
                <div class="ci-expand__head">
                  <h4 class="ci-expand__title">Tags</h4>
                  <span class="ci-expand__count">
                    {{ p.tags.length }} selected · helps retailers find you
                  </span>
                </div>
                <div class="ci-tags">
                  <button
                    v-for="t in AVAILABLE_TAGS"
                    :key="t"
                    class="ci-tag"
                    :class="{ 'ci-tag--active': p.tags.includes(t) }"
                    @click="toggleTag(p, t)"
                  >
                    <AkIcon :symbol="p.tags.includes(t) ? 'check-lg' : 'plus'" size="xs" />
                    {{ t }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Sticky bottom bar -->
        <div class="ci-bottombar">
          <div class="ci-bottombar__info">
            <strong>{{ readyCount }} of {{ products.length }} products</strong> ready to publish.
            <span v-if="missingWholesaleCount > 0" class="ci-bottombar__warn">
              {{ missingWholesaleCount }} still need a wholesale price.
            </span>
          </div>
          <div class="ci-bottombar__actions">
            <AkButton outlined>Save as draft</AkButton>
            <AkButton
              color="primary"
              symbol="rocket-takeoff"
              :disabled="readyCount === 0"
              @click="publish"
            >
              Publish {{ readyCount }} products to my catalogue
            </AkButton>
          </div>
        </div>
      </section>

      <!-- ── STEP 4: Publishing ── -->
      <section v-if="step === 4" class="ci-section ci-section--center">
        <div class="ci-processing">
          <div class="ci-processing__icon">
            <div v-if="publishPct < 100" class="ci-spinner"></div>
            <AkIcon v-else symbol="check-lg" size="lg" />
          </div>
          <p class="ci-processing__eyebrow">{{ publishPct < 100 ? 'Saving…' : 'Saved!' }}</p>
          <h1 class="ci-processing__title">
            {{ publishPct < 100 ? 'Adding your products to your catalogue' : 'Your products are in your catalogue' }}
          </h1>
          <p class="ci-processing__sub">
            <template v-if="publishPct < 100">
              Adding <strong>{{ readyCount }} products</strong> to your catalogue —
              about <strong>{{ publishRemainingSeconds }} seconds</strong> left.
            </template>
            <template v-else>
              {{ readyCount }} products are saved. They'll be visible to retailers once you
              <strong>preview &amp; launch your store</strong> — that's the next step on your dashboard.
            </template>
          </p>

          <div class="ci-processing__stats">
            <div class="ci-pstat">
              <AkIcon symbol="box-seam" />
              <div>
                <div class="ci-pstat__num">{{ publishedCount }} <span>/ {{ readyCount }}</span></div>
                <div class="ci-pstat__label">added to catalogue</div>
              </div>
            </div>
            <div class="ci-pstat">
              <AkIcon symbol="clock-history" />
              <div>
                <div class="ci-pstat__num">{{ publishRemainingSeconds }}s</div>
                <div class="ci-pstat__label">remaining</div>
              </div>
            </div>
            <div class="ci-pstat">
              <AkIcon symbol="check-circle" />
              <div>
                <div class="ci-pstat__num">{{ publishPct }}%</div>
                <div class="ci-pstat__label">progress</div>
              </div>
            </div>
          </div>

          <div class="ci-progress">
            <div class="ci-progress__bar" :style="{ width: publishPct + '%' }"></div>
          </div>

          <ul class="ci-checklist">
            <li :class="{ 'ci-check--done': publishPct > 5 }">
              <AkIcon :symbol="publishPct > 5 ? 'check-circle-fill' : 'circle'" />
              Checking your products
            </li>
            <li :class="{ 'ci-check--done': publishPct > 35, 'ci-check--active': publishPct > 5 && publishPct <= 35 }">
              <AkIcon :symbol="publishPct > 35 ? 'check-circle-fill' : 'circle'" />
              Saving to your catalogue
            </li>
            <li :class="{ 'ci-check--done': publishPct > 70, 'ci-check--active': publishPct > 35 && publishPct <= 70 }">
              <AkIcon :symbol="publishPct > 70 ? 'check-circle-fill' : 'circle'" />
              Generating product pages
            </li>
            <li :class="{ 'ci-check--done': publishPct >= 100, 'ci-check--active': publishPct > 70 && publishPct < 100 }">
              <AkIcon :symbol="publishPct >= 100 ? 'check-circle-fill' : 'circle'" />
              Ready to preview
            </li>
          </ul>

          <div v-if="publishPct >= 100" class="ci-tip">
            <AkIcon symbol="lightbulb" />
            <div>
              <strong>Next up:</strong> head back to your dashboard and tackle
              <strong>step 2 — Push your store live</strong> to make these products visible
              to retailers and unlock your 30-day highlight.
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'

const router = useRouter()
const { state, markTaskComplete } = useBrandStore()

const websiteUrl = computed(() => state.brand.website || 'yourshop.com')

const step = ref(1)
const detectionState = ref<'guide' | 'unknown'>('guide')

const detectionStates: { key: 'guide' | 'unknown'; label: string }[] = [
  { key: 'guide', label: 'Magento (guide)' },
  { key: 'unknown', label: 'Unknown' },
]

// ── Processing ──
const totalProducts = 47
const estimatedSeconds = 30
const progressPct = ref(0)
let progressTimer: ReturnType<typeof setInterval> | null = null

const importedCount = computed(() => Math.min(totalProducts, Math.round((progressPct.value / 100) * totalProducts)))
const importedImages = computed(() => Math.min(totalProducts * 3, Math.round((progressPct.value / 100) * totalProducts * 3)))
const remainingSeconds = computed(() => Math.max(0, Math.ceil(estimatedSeconds * (1 - progressPct.value / 100))))

function startImport() {
  step.value = 2
  progressPct.value = 0
  if (progressTimer) clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    progressPct.value += 4
    if (progressPct.value >= 100) {
      progressPct.value = 100
      if (progressTimer) clearInterval(progressTimer)
      setTimeout(() => goStep(3), 600)
    }
  }, 250)
}

onUnmounted(() => {
  if (progressTimer) clearInterval(progressTimer)
  if (publishTimer) clearInterval(publishTimer)
})

// ── Categories & tags ──
const CATEGORIES = [
  'Home & Living',
  'Beauty & Wellbeing',
  'Food & Drinks',
  'Fashion & Accessories',
  'Kids',
  'Stationery',
  'Jewellery',
]

const AVAILABLE_TAGS = [
  'Organic',
  'Handmade',
  'Eco-Friendly',
  'Zero waste',
  'Cruelty free',
  'Bestseller',
  'Vegan',
  'Contains alcohol',
  'Made in France',
  'Limited edition',
  'Award winning',
  'GOTS certified',
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

// ── Products ──
interface Variant {
  option: string
  colour: string
  sku: string
  stock: number
  retail: number
  wholesale: number | null
}

interface Product {
  id: number
  images: string[]
  name: string
  category: string
  description: string
  sku: string
  stock: number
  retail: number
  vat: number
  wholesale: number | null
  madeIn: string
  variants: Variant[]
  tags: string[]
}

const grad = (a: string, b: string) => `linear-gradient(135deg,${a},${b})`

const products = ref<Product[]>([
  {
    id: 1,
    images: [grad('#e8e4de', '#c8bdb0'), grad('#d4cdc4', '#a89e91'), grad('#f0ece6', '#c8bdb0'), grad('#b8a890', '#7a6e62')],
    name: 'Linen tablecloth · Cream',
    category: 'Home & Living',
    description: 'Hand-loomed pure linen tablecloth, stonewashed for softness.',
    sku: 'TC-001-CR',
    stock: 24,
    retail: 85,
    vat: 20,
    wholesale: null,
    madeIn: 'Portugal',
    variants: [
      { option: 'Small (140×200)', colour: 'Cream', sku: 'TC-001-CR-S', stock: 8, retail: 75, wholesale: null },
      { option: 'Medium (180×260)', colour: 'Cream', sku: 'TC-001-CR-M', stock: 10, retail: 85, wholesale: null },
      { option: 'Large (220×320)', colour: 'Cream', sku: 'TC-001-CR-L', stock: 6, retail: 105, wholesale: null },
    ],
    tags: ['Handmade', 'GOTS certified'],
  },
  {
    id: 2,
    images: [grad('#3a3028', '#5a4c3e'), grad('#4a3c30', '#3a2c22'), grad('#5a4c3e', '#7a6e62')],
    name: 'Brass candle holder · Set of 3',
    category: 'Home & Living',
    description: 'Three solid brass candle holders, varied heights, hand-finished.',
    sku: 'CH-203',
    stock: 18,
    retail: 120,
    vat: 20,
    wholesale: null,
    madeIn: 'France',
    variants: [],
    tags: ['Handmade', 'Made in France'],
  },
  {
    id: 3,
    images: [grad('#d4c8bc', '#b8a898'), grad('#e0d8c8', '#c8bdb0'), grad('#b8a898', '#8a7e74'), grad('#c8bdb0', '#a89e91'), grad('#e8e4de', '#d8d4ce')],
    name: 'Ceramic vase · Earth tones',
    category: 'Home & Living',
    description: '',
    sku: 'VA-098',
    stock: 32,
    retail: 65,
    vat: 20,
    wholesale: null,
    madeIn: 'Spain',
    variants: [
      { option: 'Tall', colour: 'Terracotta', sku: 'VA-098-T-TR', stock: 12, retail: 65, wholesale: null },
      { option: 'Tall', colour: 'Sand', sku: 'VA-098-T-SD', stock: 8, retail: 65, wholesale: null },
      { option: 'Short', colour: 'Terracotta', sku: 'VA-098-S-TR', stock: 12, retail: 48, wholesale: null },
    ],
    tags: ['Handmade'],
  },
  {
    id: 4,
    images: [grad('#e8e4de', '#d8d4ce'), grad('#f0ece6', '#e0d8c8')],
    name: 'Hand-poured soy candle · Fig & Bergamot',
    category: 'Beauty & Wellbeing',
    description: 'Soy wax candle with notes of fig, cedar, and bergamot. 40h burn time.',
    sku: 'CD-440',
    stock: 56,
    retail: 28,
    vat: 20,
    wholesale: null,
    madeIn: 'France',
    variants: [],
    tags: ['Vegan', 'Cruelty free', 'Made in France'],
  },
  {
    id: 5,
    images: [grad('#c8bdb0', '#8a7e74'), grad('#b0a898', '#7a6e62'), grad('#d4c8bc', '#a89e91')],
    name: 'Linen napkin set · 4 pieces',
    category: 'Home & Living',
    description: 'Set of four matching linen napkins with mitred corners.',
    sku: 'NP-012',
    stock: 41,
    retail: 38,
    vat: 20,
    wholesale: null,
    madeIn: 'Portugal',
    variants: [],
    tags: ['Handmade', 'GOTS certified'],
  },
  {
    id: 6,
    images: [grad('#b0a898', '#7a6e62'), grad('#c8bdb0', '#8a7e74'), grad('#a89e91', '#5a4c3e'), grad('#d4cdc4', '#a89e91')],
    name: 'Wooden serving board · Olive',
    category: 'Food & Drinks',
    description: '',
    sku: 'SB-557',
    stock: 12,
    retail: 54,
    vat: 20,
    wholesale: null,
    madeIn: '',
    variants: [],
    tags: ['Handmade'],
  },
  {
    id: 7,
    images: [grad('#e0d8c8', '#b8a890'), grad('#c8bdb0', '#a89e91')],
    name: 'Cotton apron · Natural',
    category: 'Fashion & Accessories',
    description: 'Heavy cotton canvas apron with adjustable neck strap.',
    sku: 'AP-220',
    stock: 28,
    retail: 42,
    vat: 20,
    wholesale: null,
    madeIn: 'India',
    variants: [
      { option: 'One size', colour: 'Natural', sku: 'AP-220-NA', stock: 18, retail: 42, wholesale: null },
      { option: 'One size', colour: 'Charcoal', sku: 'AP-220-CH', stock: 10, retail: 42, wholesale: null },
    ],
    tags: ['Organic', 'GOTS certified'],
  },
  {
    id: 8,
    images: [grad('#5a4c3e', '#3a3028'), grad('#3a3028', '#1a1612'), grad('#7a6e62', '#5a4c3e')],
    name: 'Cast iron pan · 24cm',
    category: 'Home & Living',
    description: 'Pre-seasoned cast iron pan, oven-safe, lifetime guarantee.',
    sku: 'IP-024',
    stock: 15,
    retail: 95,
    vat: 20,
    wholesale: null,
    madeIn: 'Germany',
    variants: [],
    tags: ['Bestseller'],
  },
])

const expanded = ref<number | null>(null)
function toggleExpand(id: number) {
  expanded.value = expanded.value === id ? null : id
}

function hasMissing(p: Product) {
  return missingFlags(p).length > 0
}

function missingFlags(p: Product) {
  const out: string[] = []
  if (!p.description) out.push('Description missing')
  if (!p.madeIn) out.push('Made in missing')
  return out
}

const readyCount = computed(() => products.value.filter(p => !hasMissing(p)).length)
const missingWholesaleCount = computed(() => products.value.filter(p => !p.wholesale).length)

// ── Suggested price (per category) ──
function suggestedFor(p: Product) {
  const pct = SUGGESTED_BY_CATEGORY[p.category] ?? 50
  return Math.round(p.retail * (pct / 100))
}

function seedWholesale(p: Product) {
  if (p.wholesale === null || p.wholesale === undefined || (p.wholesale as unknown as string) === '') {
    p.wholesale = suggestedFor(p)
  }
}

function onWholesaleKeydown(p: Product, e: KeyboardEvent) {
  if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !p.wholesale) {
    e.preventDefault()
    p.wholesale = suggestedFor(p) + (e.key === 'ArrowUp' ? 1 : -1)
  }
}

function acceptSuggestion(p: Product) {
  p.wholesale = suggestedFor(p)
  p.variants.forEach(v => {
    if (!v.wholesale) {
      const pct = SUGGESTED_BY_CATEGORY[p.category] ?? 50
      v.wholesale = Math.round(v.retail * (pct / 100))
    }
  })
}

// ── Bulk selection ──
const selectedIds = ref<number[]>([])
const bulkPct = ref(50)

const allSelected = computed(() =>
  products.value.length > 0 && selectedIds.value.length === products.value.length,
)
const someSelected = computed(() => selectedIds.value.length > 0)

function toggleSelect(id: number) {
  const i = selectedIds.value.indexOf(id)
  if (i === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(i, 1)
}

function toggleSelectAll() {
  selectedIds.value = allSelected.value ? [] : products.value.map(p => p.id)
}

function selectMissingWholesale() {
  selectedIds.value = products.value.filter(p => !p.wholesale).map(p => p.id)
}

function applyBulkWholesale() {
  const ids = selectedIds.value.length > 0 ? selectedIds.value : products.value.map(p => p.id)
  products.value.forEach(p => {
    if (ids.includes(p.id)) {
      p.wholesale = Math.round(p.retail * (bulkPct.value / 100))
      p.variants.forEach(v => {
        v.wholesale = Math.round(v.retail * (bulkPct.value / 100))
      })
    }
  })
  selectedIds.value = []
}

// ── Tags ──
function toggleTag(p: Product, t: string) {
  const i = p.tags.indexOf(t)
  if (i === -1) p.tags.push(t)
  else p.tags.splice(i, 1)
}

// ── Photos ──
function removeImage(p: Product, i: number) {
  p.images.splice(i, 1)
}

// ── Variants ──
function addVariant(p: Product) {
  p.variants.push({ option: '', colour: '', sku: '', stock: 0, retail: p.retail, wholesale: null })
}
function removeVariant(p: Product, i: number) {
  p.variants.splice(i, 1)
}

// ── Navigation ──
function goStep(n: number) {
  step.value = n
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goBack() {
  router.push('/mvp/dashboard')
}

function goToManual() {
  router.push('/mvp/products?openDrawer=1')
}

// ── Publishing ──
const publishPct = ref(0)
const publishEstSeconds = 12
let publishTimer: ReturnType<typeof setInterval> | null = null

const publishedCount = computed(() => Math.min(readyCount.value, Math.round((publishPct.value / 100) * readyCount.value)))
const publishRemainingSeconds = computed(() => Math.max(0, Math.ceil(publishEstSeconds * (1 - publishPct.value / 100))))

function publish() {
  step.value = 4
  publishPct.value = 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (publishTimer) clearInterval(publishTimer)
  publishTimer = setInterval(() => {
    publishPct.value += 4
    if (publishPct.value >= 100) {
      publishPct.value = 100
      if (publishTimer) clearInterval(publishTimer)
      markTaskComplete('catalogue')
      setTimeout(() => router.push('/mvp/dashboard'), 1800)
    }
  }, 400)
}
</script>

<style scoped>
.ci-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  flex-direction: column;
}

.ci-top {
  background: var(--white);
  border-bottom: 1px solid var(--color-border-light);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
}

.ci-back {
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

.ci-main {
  flex: 1;
  max-width: 880px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-6);
}

.ci-main--wide {
  max-width: 1480px;
  padding-bottom: 120px;
}

.ci-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ci-section--center {
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.ci-section__intro { margin-bottom: var(--space-2); }

.ci-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.ci-subtitle {
  font-size: 15px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
}

/* Demo switch */
.ci-demo-switch {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--neutral-100);
  border-radius: var(--radius-md);
  font-size: 12px;
}

.ci-demo-switch__label {
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ci-demo-switch__btn {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
}

.ci-demo-switch__btn--active {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

/* Detection card */
.ci-detect {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ci-detect__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.ci-detect__logo {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: var(--white);
  flex-shrink: 0;
}

.ci-detect__logo--magento { background: #F26322; }
.ci-detect__logo--unknown { background: var(--neutral-500); color: var(--white); }

.ci-detect__eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 4px;
}

.ci-detect__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.ci-detect__url {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 4px 0 0;
}

.ci-detect__head > div:nth-child(2) { flex: 1; }

.ci-detect__note {
  font-size: 14px;
  line-height: 1.5;
  color: var(--primary);
  margin: 0;
}

.ci-detect__actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.ci-alt-link {
  text-align: center;
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
}

.ci-alt-link a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
}

.ci-steps-list {
  margin: 0;
  padding-left: var(--space-5);
  font-size: 14px;
  color: var(--primary);
  line-height: 1.7;
}

.ci-upload {
  border: 2px dashed var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  text-align: center;
  background: var(--warm-white, #FBF8F3);
}

.ci-upload__title {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary);
  margin: var(--space-2) 0 var(--space-1);
}

.ci-upload__sub {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
}

.ci-upload__sub a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
}

/* ── Processing ── */
.ci-processing {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  max-width: 640px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.ci-processing__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #F8FCE9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
}

.ci-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--neutral-100);
  border-top-color: var(--accent, #517070);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.ci-processing__eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.ci-processing__title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.ci-processing__sub {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.6;
  max-width: 480px;
}

.ci-processing__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-3);
}

.ci-pstat {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--warm-white, #FBF8F3);
  border-radius: var(--radius-md);
  text-align: left;
}

.ci-pstat__num {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.ci-pstat__num span {
  font-weight: 400;
  color: var(--neutral-700);
  font-size: 13px;
}

.ci-pstat__label {
  font-size: 11px;
  color: var(--neutral-700);
  margin-top: 2px;
}

.ci-progress {
  width: 100%;
  height: 8px;
  background: var(--neutral-100);
  border-radius: 999px;
  overflow: hidden;
}

.ci-progress__bar {
  height: 100%;
  background: var(--accent, #517070);
  border-radius: 999px;
  transition: width 250ms linear;
}

.ci-checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  text-align: left;
}

.ci-checklist li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--neutral-700);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
}

.ci-check--done { color: var(--success); }
.ci-check--active { background: var(--neutral-100); color: var(--primary); font-weight: 600; }

.ci-tip {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #FFF8F0;
  border: 1px solid #FCD8A8;
  border-radius: var(--radius-md);
  font-size: 13px;
  text-align: left;
  color: var(--primary);
  line-height: 1.5;
  width: 100%;
}

.ci-tip > svg { color: var(--warning); flex-shrink: 0; }

/* ── Review header ── */
.ci-review {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ci-review__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.ci-review__summary {
  display: flex;
  gap: var(--space-3);
}

.ci-summary-stat {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  display: flex;
  flex-direction: column;
  min-width: 110px;
}

.ci-summary-stat__num {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.ci-summary-stat__label {
  font-size: 12px;
  color: var(--neutral-700);
  margin-top: var(--space-1);
}

.ci-summary-stat--ok { border-color: #D5FC52; background: #FBFEF4; }
.ci-summary-stat--warn { border-color: #FCD8A8; background: #FFF8F0; }

/* ── Wholesale helper (category-aware) ── */
.ci-helper {
  background: linear-gradient(135deg, #F8FCE9 0%, var(--white) 100%);
  border: 1px solid #D5FC52;
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ci-helper__head {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.ci-helper__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent, #517070);
  flex-shrink: 0;
  font-size: 22px;
}

.ci-helper__title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 var(--space-1);
  color: var(--primary);
}

.ci-helper__sub {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
  max-width: 720px;
}

.ci-cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-3);
}

.ci-cat {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ci-cat__name {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
}

.ci-cat__count {
  font-size: 12px;
  color: var(--neutral-700);
  margin-top: 2px;
}

.ci-cat__controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.ci-cat__label {
  font-size: 13px;
  color: var(--primary);
}

.ci-cat__input-wrap {
  display: flex;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.ci-cat__input {
  width: 56px;
  height: 36px;
  border: none;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  text-align: right;
  outline: none;
  color: var(--primary);
}

.ci-cat__suffix {
  padding: 0 10px;
  height: 36px;
  display: flex;
  align-items: center;
  background: var(--neutral-100);
  font-size: 13px;
  color: var(--neutral-700);
}

.ci-cat__hint {
  font-size: 11px;
  color: var(--neutral-700);
}

.ci-helper__footer {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* ── Editable table ── */
.ci-table {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.ci-table__head,
.ci-tr {
  display: grid;
  grid-template-columns: 40px 70px 1.6fr 130px 120px 80px 90px 80px 140px 80px 40px;
  align-items: center;
}

.ci-th--check, .ci-td--check {
  display: flex;
  justify-content: center;
  padding: 0;
}

.ci-td--check input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

.ci-th--highlight {
  background: #FFF8F0;
  border-bottom: 2px solid #F26322;
}

.ci-th__hint {
  display: block;
  font-size: 9px;
  font-weight: 600;
  color: var(--warning);
  text-transform: none;
  letter-spacing: 0;
  margin-top: 2px;
}

.ci-td--highlight {
  background: #FFFBF7;
}

.ci-tr--selected,
.ci-tr--selected:hover { background: #F0F4FF; }
.ci-tr--selected.ci-tr--warn { background: #FFF5E8; }

.ci-wholesale-cell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
}

.ci-suggest-tick {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent, #517070);
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: inherit;
  z-index: 2;
  transition: transform 150ms ease, background 150ms ease;
}

.ci-suggest-tick:hover {
  background: var(--primary);
  transform: translateY(-50%) scale(1.08);
}

.ci-input--has-tick {
  padding-left: 32px !important;
}

.ci-cell-hint {
  font-size: 10px;
  color: var(--neutral-700);
  margin-top: 2px;
  text-align: right;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Bulk edit toolbar */
.ci-bulk {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.ci-bulk__left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.ci-bulk__check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;
}

.ci-bulk__check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

.ci-bulk__quick {
  background: var(--warm-white, #FBF8F3);
  border: 1px solid var(--color-border-light);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  font-family: inherit;
}

.ci-bulk__quick:hover { border-color: var(--primary); }

.ci-bulk__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.ci-bulk__label {
  font-size: 13px;
  color: var(--primary);
  font-weight: 600;
}

.ci-bulk__input-wrap {
  display: flex;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.ci-bulk__input {
  width: 56px;
  height: 36px;
  border: none;
  padding: 0 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  text-align: right;
  outline: none;
  color: var(--primary);
}

.ci-bulk__suffix {
  padding: 0 10px;
  height: 36px;
  display: flex;
  align-items: center;
  background: var(--neutral-100);
  font-size: 13px;
  color: var(--neutral-700);
}

.ci-bulk__clear {
  background: none;
  border: none;
  color: var(--neutral-700);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
}

.ci-table__head {
  background: var(--neutral-100);
  padding: var(--space-2) 0;
}

.ci-th {
  font-size: 11px;
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--space-2) var(--space-3);
}

.ci-th--num { text-align: right; }
.ci-th--img { padding: var(--space-2) 0 var(--space-2) var(--space-3); }

.ci-tr {
  border-top: 1px solid var(--color-border-light);
  transition: background 150ms ease;
  cursor: pointer;
}

.ci-tr:hover { background: var(--warm-white, #FBF8F3); }

.ci-tr--warn { background: #FFFAF5; }
.ci-tr--warn:hover { background: #FFF5E8; }

.ci-tr--expanded { background: var(--neutral-100); border-bottom: none; }

.ci-td {
  padding: var(--space-2) var(--space-3);
}

.ci-td--num { text-align: right; }
.ci-td--img { padding: var(--space-2) 0 var(--space-2) var(--space-3); }

.ci-td--margin {
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
}

.ci-td--chev {
  display: flex;
  justify-content: center;
  color: var(--neutral-700);
}

.ci-thumb-wrap {
  position: relative;
  width: 48px;
  height: 48px;
}

.ci-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
}

.ci-thumb-count {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--primary);
  color: var(--white);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 999px;
  border: 2px solid var(--white);
}

.ci-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.ci-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  width: fit-content;
}

.ci-flag--info {
  background: var(--info-50, #EEF2FF);
  color: var(--info-700);
}

.ci-flag--error {
  background: #FEF2F2;
  color: var(--error);
  border: 1px solid #FCA5A5;
}

.ci-input {
  width: 100%;
  border: 1px solid transparent;
  padding: 6px 8px;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  color: var(--primary);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 150ms ease, background 150ms ease;
}

.ci-td--num .ci-input { text-align: right; }
.ci-input--bold { font-weight: 600; }

.ci-input:hover { background: var(--white); border-color: var(--color-border-light); }
.ci-input:focus { background: var(--white); border-color: var(--primary); box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06); }

.ci-input--mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }

.ci-input--bordered {
  background: var(--white);
  border-color: var(--color-border-light);
}

.ci-input--missing {
  background: #FEF2F2;
  border-color: var(--error);
  color: var(--error);
}

.ci-input--missing::placeholder {
  color: var(--error);
  font-weight: 600;
}

.ci-input--missing:focus {
  background: var(--white);
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(212, 22, 70, 0.12);
}

/* Select looks like input */
select.ci-input {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><polyline fill='none' stroke='%23777272' stroke-width='1.6' points='1,1 5,5 9,1'/></svg>");
  background-repeat: no-repeat;
  background-position: right 6px center;
  padding-right: 22px;
}

/* ── Expanded row ── */
.ci-expand {
  grid-column: 1 / -1;
  background: var(--neutral-100);
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  padding: var(--space-5) var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.ci-expand__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.ci-expand__row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-5);
}

.ci-expand__col { display: flex; flex-direction: column; gap: var(--space-3); }

.ci-expand__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.ci-expand__title {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.ci-expand__count {
  font-size: 12px;
  color: var(--neutral-700);
}

.ci-expand__hint {
  font-size: 12px;
  color: var(--neutral-700);
  margin: 0;
}

/* Gallery */
.ci-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.ci-gallery__item {
  position: relative;
  width: 96px;
  height: 96px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.ci-gallery__item--main {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.ci-gallery__badge {
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

.ci-gallery__remove {
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

.ci-gallery__remove:hover { color: var(--error); border-color: var(--error); }

.ci-gallery__add {
  width: 96px;
  height: 96px;
  border-radius: var(--radius-md);
  border: 2px dashed var(--color-border-light);
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-700);
  cursor: pointer;
  font-family: inherit;
}

.ci-gallery__add:hover { border-color: var(--primary); color: var(--primary); }

/* Textarea */
.ci-textarea {
  width: 100%;
  padding: var(--space-3);
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 13px;
  color: var(--primary);
  outline: none;
  resize: vertical;
  line-height: 1.5;
}

.ci-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.06); }

/* Variants table */
.ci-variants {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.ci-variants__head,
.ci-variants__row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr 80px 100px 110px 32px;
  gap: var(--space-2);
  align-items: center;
  padding: var(--space-2) var(--space-3);
}

.ci-variants__head {
  background: var(--neutral-100);
  font-size: 11px;
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ci-variants__row {
  border-top: 1px solid var(--color-border-light);
}

.ci-variants__remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--color-border-light);
  color: var(--neutral-700);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ci-variants__remove:hover { color: var(--error); border-color: var(--error); }

.ci-variants__add {
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

.ci-variants__add:hover { border-color: var(--primary); }

/* Tags */
.ci-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.ci-tag {
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

.ci-tag:hover { border-color: var(--primary); }

.ci-tag--active {
  background: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

/* ── Sticky bottom bar ── */
.ci-bottombar {
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
}

.ci-bottombar__info {
  font-size: 14px;
  color: var(--primary);
}

.ci-bottombar__warn {
  color: var(--warning);
  margin-left: var(--space-2);
}

.ci-bottombar__actions {
  display: flex;
  gap: var(--space-3);
}
</style>
