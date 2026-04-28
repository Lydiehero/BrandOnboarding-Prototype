<template>
  <div class="catalogue">
    <div class="catalogue__back">
      <AkButton outlined symbol="chevron-left" size="sm" @click="backToDashboard">
        Back to dashboard
      </AkButton>
    </div>

    <!-- EMPTY STATE -->
    <section v-if="view === 'empty'" class="catalogue__empty">
      <div class="catalogue__empty-intro">
        <p class="catalogue__eyebrow">Catalogue · Step 2 of 4</p>
        <h1 class="catalogue__empty-title">Bring your products in.</h1>
        <p class="catalogue__empty-subtitle">
          It doesn't matter where your catalogue lives today. Drop it in — any format, any source — and we'll handle the rest.
        </p>
      </div>

      <div class="catalogue__methods">
        <button v-for="m in methods" :key="m.key" class="method-card" @click="pickMethod(m.key)">
          <AkBadge v-if="m.chip" :content="m.chip" :color="m.chipColor" size="sm" />
          <div class="method-card__icon">{{ m.emoji }}</div>
          <div>
            <p class="method-card__title">{{ m.title }}</p>
            <p class="method-card__desc">{{ m.desc }}</p>
          </div>
        </button>
      </div>

      <div class="catalogue__empty-skip">
        <AkButton outlined size="sm" @click="showTable">Already imported? Skip to my catalogue →</AkButton>
      </div>
    </section>

    <!-- TABLE VIEW -->
    <section v-if="view === 'table'" class="catalogue__table-view">
      <div class="catalogue__heading">
        <div>
          <h1 class="catalogue__title">Catalogue</h1>
          <p class="catalogue__subtitle">
            {{ products.length }} products · {{ variantCount }} variants · last synced just now
          </p>
        </div>
        <div class="catalogue__heading-actions">
          <AkButton outlined symbol="clock-history" @click="showEmpty">Import history</AkButton>
          <AkButton color="primary" symbol="plus-circle" @click="showEmpty">Add or update catalogue</AkButton>
        </div>
      </div>

      <AkAlert v-if="showImportBanner" type="success" title="8 products imported from your website">
        Review each product below and activate it to publish on Ankorstore.
      </AkAlert>

      <div class="catalogue__toolbar">
        <AkInput
          v-model="searchQuery"
          placeholder="Search products, SKU, category…"
          iconLeft="search"
        />
        <div class="catalogue__filters">
          <AkButton
            v-for="f in filters"
            :key="f.key"
            :outlined="activeFilter !== f.key"
            :color="activeFilter === f.key ? 'primary' : undefined"
            size="sm"
            @click="activeFilter = f.key"
          >
            {{ f.label }} <span class="catalogue__count">·{{ f.count }}</span>
          </AkButton>
        </div>
      </div>

      <AkTable
        :columns="columns"
        :data="filteredProducts"
        :border="true"
        :rowStyles="['hover']"
      >
        <template #item.emoji="{ item }">
          <div class="catalogue__thumb">{{ item.emoji }}</div>
        </template>

        <template #item.name="{ item }">
          <div class="catalogue__name">
            <div class="catalogue__name-main">{{ item.name }}</div>
            <div v-if="item.variants.length" class="catalogue__name-variants">
              {{ item.variants.length }} variant{{ item.variants.length > 1 ? 's' : '' }}
            </div>
          </div>
        </template>

        <template #item.stock="{ item }">
          <span v-if="item.stock === 0" class="catalogue__stock catalogue__stock--out">Out of stock</span>
          <span v-else-if="item.stock <= 15" class="catalogue__stock catalogue__stock--low">{{ item.stock }} in stock</span>
          <span v-else>{{ item.stock }}</span>
        </template>

        <template #item.status="{ item }">
          <AkBadge
            :content="statusLabel(item.status)"
            :color="statusColor(item.status)"
            size="sm"
          />
        </template>

        <template #item.actions="{ item }">
          <AkButton outlined size="sm" symbol="pencil" @click="() => {}">Edit</AkButton>
        </template>
      </AkTable>

      <div v-if="filteredProducts.length === 0" class="catalogue__no-results">
        <AkAlert type="info" title="No results">No products match your filters.</AkAlert>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { PRODUCTS } from '@/data/products'
import type { Product } from '@/data/products'
import { useBrandStore } from '@/data/brand-store'

const router = useRouter()
const { state, markTaskComplete, setCurrentService } = useBrandStore()

const products = ref<Product[]>([...PRODUCTS])
const view = ref<'empty' | 'table'>(state.tasks.autoImport ? 'table' : 'empty')
const searchQuery = ref('')
const activeFilter = ref('all')

const showImportBanner = computed(() => state.tasks.autoImport && view.value === 'table')

const methods = [
  { key: 'csv', emoji: '📊', title: 'Spreadsheet', desc: 'CSV, Excel, Google Sheets — we auto-map columns.', chip: 'Most used', chipColor: 'blue' },
  { key: 'pdf', emoji: '📄', title: 'PDF catalogue', desc: 'Price lists or line sheets. Our AI extracts every product.', chip: 'AI', chipColor: 'purple' },
  { key: 'url', emoji: '🌐', title: 'From a website', desc: 'Paste your shop URL. We crawl every product page.', chip: 'AI', chipColor: 'purple' },
  { key: 'platform', emoji: '🔄', title: 'Connect your store', desc: 'Shopify, WooCommerce, Prestashop — always in sync.', chip: 'Live sync', chipColor: 'green' },
  { key: 'photos', emoji: '🖼️', title: 'Product photos', desc: 'Drag photos in. AI writes the name, category, description.', chip: 'AI', chipColor: 'purple' },
  { key: 'manual', emoji: '✏️', title: 'Add one by one', desc: 'Full control — add a product manually with our form.', chip: '', chipColor: 'grey' },
]

const columns = [
  { name: 'emoji', label: '', width: '60px' },
  { name: 'name', label: 'Product' },
  { name: 'sku', label: 'SKU', width: '140px' },
  { name: 'stock', label: 'Stock', width: '140px' },
  { name: 'status', label: 'Status', width: '130px' },
  { name: 'actions', label: '', width: '120px', align: 'right' as const },
]

const variantCount = computed(() => products.value.reduce((n, p) => n + p.variants.length, 0))

const filterDefs = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'online', label: 'Online', match: (p: Product) => p.status === 'online' },
  { key: 'offline', label: 'Offline', match: (p: Product) => p.status === 'offline' },
  { key: 'low', label: 'Low stock', match: (p: Product) => p.stock > 0 && p.stock <= 15 },
  { key: 'out', label: 'Out of stock', match: (p: Product) => p.stock === 0 },
  { key: 'variants', label: 'Has variants', match: (p: Product) => p.variants.length > 0 },
]

const filters = computed(() =>
  filterDefs.map(f => ({ ...f, count: products.value.filter(f.match).length })),
)

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const filterFn = filterDefs.find(f => f.key === activeFilter.value)?.match || (() => true)
  return products.value.filter(p => {
    if (!filterFn(p)) return false
    if (q && !(`${p.name} ${p.sku}`.toLowerCase().includes(q))) return false
    return true
  })
})

function statusLabel(s: string) {
  if (s === 'online') return 'Online'
  if (s === 'offline') return 'Offline'
  return 'Pending review'
}

function statusColor(s: string) {
  if (s === 'online') return 'green'
  if (s === 'offline') return 'grey'
  return 'orange'
}

function pickMethod(_key: string) {
  view.value = 'table'
}

function showTable() {
  view.value = 'table'
}

function showEmpty() {
  view.value = 'empty'
}

function backToDashboard() {
  markTaskComplete('products')
  setCurrentService('marketplace')
  router.push('/')
}
</script>

<style scoped>
.catalogue {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--warm-white, #FBF8F3);
  min-height: 100%;
}

.catalogue__back { align-self: flex-start; }

.catalogue__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  padding: var(--space-5) 0 var(--space-6);
}

.catalogue__empty-intro {
  max-width: 760px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.catalogue__eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #517070);
  margin: 0;
}

.catalogue__empty-title {
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: -0.02em;
  color: var(--primary);
  margin: 0;
}

.catalogue__empty-subtitle {
  font-size: 15px;
  line-height: 24px;
  color: var(--neutral-900);
  max-width: 560px;
  margin: 0;
}

.catalogue__methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 960px;
}

@media (max-width: 1023px) { .catalogue__methods { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .catalogue__methods { grid-template-columns: 1fr; } }

.method-card {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  position: relative;
}

.method-card:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.method-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: var(--primary);
}

.method-card__title {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--primary);
  margin: 0 0 2px;
}

.method-card__desc {
  font-size: 12px;
  line-height: 18px;
  color: var(--neutral-700);
  margin: 0;
}

.catalogue__empty-skip {
  margin-top: 16px;
}

.catalogue__table-view {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.catalogue__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.catalogue__heading-actions { display: flex; gap: 8px; }

.catalogue__title {
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  color: var(--primary);
  margin: 0;
}

.catalogue__subtitle {
  font-size: 14px;
  line-height: 20px;
  color: var(--neutral-900);
  margin: 4px 0 0;
}

.catalogue__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.catalogue__toolbar > :first-child {
  flex: 1;
  max-width: 400px;
  min-width: 220px;
}

.catalogue__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.catalogue__count {
  opacity: 0.6;
  margin-left: 2px;
}

.catalogue__thumb {
  font-size: 28px;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-100);
  border-radius: 8px;
}

.catalogue__name-main { color: var(--primary); font-weight: 500; }
.catalogue__name-variants { font-size: 12px; color: var(--neutral-700); }

.catalogue__stock--low { color: var(--warning); font-weight: 500; }
.catalogue__stock--out { color: var(--error); font-weight: 500; }

.catalogue__no-results { margin-top: 24px; }
</style>
