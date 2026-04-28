<template>
  <div class="mp-page">
    <header class="mp-head">
      <div>
        <h1 class="mp-title">My catalogue</h1>
        <p class="mp-sub">
          {{ products.length === 0
            ? 'No products yet — add your first one to get started.'
            : `${products.length} product${products.length === 1 ? '' : 's'} in your catalogue.` }}
        </p>
      </div>
      <div class="mp-head__actions">
        <AkButton outlined symbol="magic" @click="goImport">Import in bulk</AkButton>
        <AkButton color="primary" symbol="plus-circle" @click="openDrawer">Add a product</AkButton>
      </div>
    </header>

    <section v-if="products.length > 0" class="mp-table">
      <div class="mp-table__head">
        <div class="mp-th mp-th--img"></div>
        <div class="mp-th">Product</div>
        <div class="mp-th">Category</div>
        <div class="mp-th mp-th--num">SKU</div>
        <div class="mp-th mp-th--num">Stock</div>
        <div class="mp-th mp-th--num">Retail</div>
        <div class="mp-th mp-th--num">Wholesale</div>
        <div class="mp-th mp-th--num">Margin</div>
        <div class="mp-th">Tags</div>
        <div class="mp-th">Status</div>
      </div>
      <div
        v-for="p in products"
        :key="p.id"
        class="mp-row"
        :class="{ 'mp-row--new': isNew(p) }"
      >
        <div class="mp-td mp-td--img">
          <div class="mp-thumb-wrap">
            <div class="mp-thumb" :style="{ background: p.images[0] }"></div>
            <span v-if="p.images.length > 1" class="mp-thumb-count">+{{ p.images.length - 1 }}</span>
          </div>
        </div>
        <div class="mp-td">
          <div class="mp-name">{{ p.name }}</div>
          <span v-if="p.variants > 0" class="mp-flag">
            <AkIcon symbol="grid-3x3" size="xs" /> {{ p.variants }} variants
          </span>
        </div>
        <div class="mp-td mp-td--soft">{{ p.category }}</div>
        <div class="mp-td mp-td--num mp-td--mono">{{ p.sku }}</div>
        <div class="mp-td mp-td--num">{{ p.stock }}</div>
        <div class="mp-td mp-td--num">€{{ p.retail }}</div>
        <div class="mp-td mp-td--num mp-td--strong">€{{ p.wholesale }}</div>
        <div class="mp-td mp-td--num mp-td--soft">
          {{ Math.round((p.wholesale / p.retail) * 100) }}%
        </div>
        <div class="mp-td">
          <div class="mp-tags">
            <span v-for="t in p.tags.slice(0, 2)" :key="t" class="mp-tag">{{ t }}</span>
            <span v-if="p.tags.length > 2" class="mp-tag mp-tag--more">+{{ p.tags.length - 2 }}</span>
          </div>
        </div>
        <div class="mp-td">
          <AkBadge
            v-if="isNew(p)"
            content="Just added"
            color="green"
            size="sm"
            symbol="check-circle"
          />
          <AkBadge v-else content="Live" color="green" size="sm" />
        </div>
      </div>
    </section>

    <section v-else class="mp-empty">
      <div class="mp-empty__icon"><AkIcon symbol="box-seam" /></div>
      <h2 class="mp-empty__title">Your catalogue is empty</h2>
      <p class="mp-empty__text">
        Add your products one by one, or import them in bulk from your existing shop.
      </p>
      <div class="mp-empty__actions">
        <AkButton color="primary" symbol="plus-circle" @click="openDrawer">Add a product</AkButton>
        <AkButton outlined symbol="magic" @click="goImport">Import in bulk</AkButton>
      </div>
    </section>

    <AddProductDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'
import AddProductDrawer from '@/components/AddProductDrawer.vue'

const router = useRouter()
const route = useRoute()
const { state } = useBrandStore()

const products = computed(() => state.products)
const drawerOpen = ref(false)

onMounted(() => {
  if (route.query.openDrawer === '1') drawerOpen.value = true
})

const sessionStart = Date.now()

function isNew(p: { createdAt: number }) {
  return Date.now() - p.createdAt < 30_000 || p.createdAt >= sessionStart
}

function openDrawer() { drawerOpen.value = true }
function goImport() { router.push('/mvp/catalogue-import') }
</script>

<style scoped>
.mp-page {
  padding: var(--space-5) var(--space-6);
  background: var(--warm-white, #FBF8F3);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.mp-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.mp-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 var(--space-2);
}

.mp-sub {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
}

.mp-head__actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

/* Table */
.mp-table {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.mp-table__head,
.mp-row {
  display: grid;
  grid-template-columns: 70px 2fr 130px 120px 70px 80px 100px 80px 1.4fr 110px;
  align-items: center;
}

.mp-table__head {
  background: var(--neutral-100);
  padding: var(--space-2) 0;
}

.mp-th {
  font-size: 11px;
  font-weight: 700;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: var(--space-2) var(--space-3);
}

.mp-th--num { text-align: right; }
.mp-th--img { padding: var(--space-2) 0 var(--space-2) var(--space-3); }

.mp-row {
  border-top: 1px solid var(--color-border-light);
  padding: var(--space-3) 0;
  transition: background 200ms ease;
}

.mp-row:hover { background: var(--warm-white, #FBF8F3); }

.mp-row--new {
  background: #FBFEF4;
  animation: highlight-new 1.6s ease;
}

@keyframes highlight-new {
  0% { background: #F8FCE9; }
  100% { background: #FBFEF4; }
}

.mp-td { padding: 0 var(--space-3); font-size: 13px; color: var(--primary); }
.mp-td--num { text-align: right; }
.mp-td--mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 12px; }
.mp-td--soft { color: var(--neutral-700); }
.mp-td--strong { font-weight: 700; }
.mp-td--img { padding: 0 0 0 var(--space-3); }

.mp-name { font-weight: 600; color: var(--primary); }

.mp-thumb-wrap { position: relative; width: 48px; height: 48px; }

.mp-thumb {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
}

.mp-thumb-count {
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

.mp-flag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  padding: 2px 8px;
  background: #EEF2FF;
  color: var(--info-700);
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  width: fit-content;
}

.mp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.mp-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  background: var(--neutral-100);
  color: var(--primary);
  border-radius: 999px;
}

.mp-tag--more { background: var(--white); border: 1px solid var(--color-border-light); color: var(--neutral-700); }

/* Empty state */
.mp-empty {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
  max-width: 540px;
  margin: 0 auto;
}

.mp-empty__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: 28px;
}

.mp-empty__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.mp-empty__text {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
  max-width: 380px;
}

.mp-empty__actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-3);
}
</style>
