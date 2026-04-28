<template>
  <div class="dashboard">
    <h1 class="dashboard__heading">
      <template v-if="brand.name">Welcome to Ankorstore, {{ brand.name }}</template>
      <template v-else>Welcome back John</template>
    </h1>

    <h2 v-if="tasks.completed.length === 0" class="dashboard__question">
      Which service do you want to onboard?
    </h2>

    <section class="dashboard__cards">
      <!-- Factoring -->
      <article
        class="svc-card"
        :class="{ 'svc-card--selected': tasks.currentService === 'factoring', 'svc-card--active': isServiceComplete('factoring') }"
        @click="openService('factoring')"
      >
        <div class="svc-card__head">
          <div class="svc-card__icon"><AkIcon symbol="credit-card-2-back" /></div>
          <AkBadge v-if="isServiceComplete('factoring')" content="Active" color="green" size="sm" symbol="check-circle" />
        </div>
        <h3 class="svc-card__title">Factoring</h3>
        <p class="svc-card__desc">
          Offer payment terms to your direct clients — we pay you upfront and collect from them.
        </p>
        <div class="svc-card__progress">
          <div class="svc-card__progress-meta">
            <span class="svc-card__progress-label">Onboarding</span>
            <span class="svc-card__progress-count">{{ serviceProgress('factoring').done }} of {{ serviceProgress('factoring').total }}</span>
          </div>
          <div class="svc-card__progress-bar">
            <div class="svc-card__progress-fill" :style="{ width: serviceProgress('factoring').pct + '%' }"></div>
          </div>
        </div>
        <div class="svc-card__footer">
          <span class="svc-card__cta">
            {{ isServiceComplete('factoring') ? 'Manage my service' : 'Onboard to the service' }}
          </span>
          <AkIcon symbol="chevron-right" size="sm" />
        </div>
      </article>

      <!-- Marketplace -->
      <article
        class="svc-card"
        :class="{ 'svc-card--selected': tasks.currentService === 'marketplace', 'svc-card--active': isServiceComplete('marketplace') }"
        @click="openService('marketplace')"
      >
        <div class="svc-card__head">
          <div class="svc-card__icon"><AkIcon symbol="shop-window" /></div>
          <span v-if="isServiceComplete('marketplace')" class="svc-card__live">
            <span class="svc-card__live-dot"></span> Live
          </span>
        </div>
        <h3 class="svc-card__title">Marketplace</h3>

        <template v-if="!isServiceComplete('marketplace')">
          <p class="svc-card__desc">
            Sell, receive orders and reach new customers across 40&thinsp;000+ European retailers.
          </p>
          <div class="svc-card__progress">
            <div class="svc-card__progress-meta">
              <span class="svc-card__progress-label">Onboarding</span>
              <span class="svc-card__progress-count">{{ serviceProgress('marketplace').done }} of {{ serviceProgress('marketplace').total }}</span>
            </div>
            <div class="svc-card__progress-bar">
              <div class="svc-card__progress-fill" :style="{ width: serviceProgress('marketplace').pct + '%' }"></div>
            </div>
          </div>
        </template>

        <div v-else class="svc-card__stats">
          <div class="svc-card__stat">
            <div class="svc-card__stat-num">15</div>
            <div class="svc-card__stat-label">products live</div>
          </div>
          <div class="svc-card__stat">
            <div class="svc-card__stat-num">0</div>
            <div class="svc-card__stat-label">orders</div>
          </div>
        </div>

        <div class="svc-card__footer">
          <span class="svc-card__cta">
            {{ isServiceComplete('marketplace') ? 'Manage my service' : 'Onboard to the service' }}
          </span>
          <AkIcon symbol="chevron-right" size="sm" />
        </div>
      </article>

      <!-- Fulfillment (contact-only) -->
      <article class="svc-card svc-card--static">
        <div class="svc-card__head">
          <div class="svc-card__icon"><AkIcon symbol="truck" /></div>
        </div>
        <h3 class="svc-card__title">Fulfillment</h3>
        <p class="svc-card__desc">
          Store and ship your products from our warehouse. We handle logistics so you can focus on making.
        </p>
        <div class="svc-card__footer">
          <a href="mailto:hello@example.com" class="svc-card__link">
            Get in touch with our team
            <AkIcon symbol="box-arrow-up-right" size="xs" />
          </a>
        </div>
      </article>
    </section>

    <!-- Task table (revealed when a service is picked) -->
    <section v-if="activeTasks.length > 0" class="dashboard__tasks">
      <div class="dashboard__tasks-head">
        <div class="dashboard__tasks-title">
          <AkIcon symbol="clock-history" size="sm" />
          <h2>{{ serviceTitle }}</h2>
        </div>
        <div class="dashboard__tasks-progress">
          <span>{{ completedInService }} of {{ activeTasks.length }} completed</span>
          <div class="dashboard__tasks-bar">
            <div class="dashboard__tasks-bar-fill" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>
      </div>

      <AkTable
        :columns="taskColumns"
        :data="taskRows"
        :border="true"
        :rowStyles="['hover']"
      >
        <template #item.task="{ item }">
          <div class="task-cell">
            <AkIcon :symbol="item.icon" size="sm" />
            <span>{{ item.label }}</span>
          </div>
        </template>

        <template #item.description="{ item }">
          <span v-html="item.desc"></span>
        </template>

        <template #item.priority="{ item }">
          <AkBadge
            v-if="item.done"
            content="Done"
            color="green"
            size="sm"
            symbol="check-circle"
          />
          <AkBadge
            v-else
            :content="item.priority"
            :color="item.priorityVariant === 'error' ? 'red' : 'blue'"
            size="sm"
          />
        </template>

        <template #item.action="{ item }">
          <AkButton
            v-if="!item.done"
            outlined
            size="sm"
            :symbol="item.actionIcon"
            @click="handleAction(item)"
          >
            {{ item.action }}
          </AkButton>
        </template>
      </AkTable>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBrandStore } from '@/data/brand-store'

const router = useRouter()
const { state, setCurrentService } = useBrandStore()

const brand = state.brand
const tasks = state.tasks

interface TaskDef {
  key: string
  icon: string
  label: string
  desc: string
  priority: string
  priorityVariant: 'error' | 'info'
  action: string
  actionIcon: string
  href?: string
}

const SERVICE_TASKS: Record<string, { title: string; tasks: TaskDef[] }> = {
  marketplace: {
    title: 'Marketplace tasks',
    tasks: [
      { key: 'store', icon: 'shop-window', label: 'Store page',
        desc: 'Customize your <strong>brand story</strong> and visuals',
        priority: 'Required', priorityVariant: 'error',
        action: 'Set up store page', actionIcon: 'shop-window', href: '/shop' },
      { key: 'products', icon: 'box-seam', label: 'Catalogue',
        desc: 'Add at least <strong>10 products</strong> to go live',
        priority: 'Required', priorityVariant: 'error',
        action: 'Add products', actionIcon: 'plus-circle', href: '/products' },
      { key: 'shipping', icon: 'truck', label: 'Shipping',
        desc: 'Set <strong>rates</strong> and <strong>minimum order amount</strong>',
        priority: 'Required', priorityVariant: 'error',
        action: 'Configure shipping', actionIcon: 'gear' },
      { key: 'preview', icon: 'rocket-takeoff', label: 'Preview & Launch',
        desc: 'Review your store and <strong>go live on Ankorstore</strong>',
        priority: 'Final step', priorityVariant: 'info',
        action: 'Preview & launch', actionIcon: 'eye', href: '/preview-launch' },
    ],
  },
  factoring: {
    title: 'Factoring tasks',
    tasks: [
      { key: 'aria_verif', icon: 'shield-check', label: 'Aria verification',
        desc: 'Complete <strong>identity verification</strong> with our partner Aria',
        priority: 'Required', priorityVariant: 'error',
        action: 'Start verification', actionIcon: 'arrow-right' },
      { key: 'aria_tc', icon: 'file-text', label: 'Sign T&C',
        desc: 'Review and sign the <strong>Aria terms &amp; conditions</strong>',
        priority: 'Required', priorityVariant: 'error',
        action: 'Sign T&C', actionIcon: 'pencil' },
      { key: 'create_order', icon: 'cart', label: 'Create order',
        desc: 'Generate your <strong>first factoring order</strong> to activate payouts',
        priority: 'Final step', priorityVariant: 'info',
        action: 'Create order', actionIcon: 'plus-circle' },
    ],
  },
}

function openService(key: string) {
  setCurrentService(tasks.currentService === key ? null : key)
}

function serviceProgress(key: string) {
  const def = SERVICE_TASKS[key]
  if (!def) return { done: 0, total: 0, pct: 0 }
  const total = def.tasks.length
  const done = def.tasks.filter(t => tasks.completed.includes(t.key)).length
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

function isServiceComplete(key: string) {
  const p = serviceProgress(key)
  return p.total > 0 && p.done === p.total
}

const activeTasks = computed(() => {
  if (!tasks.currentService) return []
  return SERVICE_TASKS[tasks.currentService]?.tasks || []
})

const serviceTitle = computed(() => {
  if (!tasks.currentService) return ''
  return SERVICE_TASKS[tasks.currentService]?.title || ''
})

const completedInService = computed(() =>
  activeTasks.value.filter(t => tasks.completed.includes(t.key)).length,
)

const progressPct = computed(() =>
  activeTasks.value.length === 0 ? 0 : Math.round((completedInService.value / activeTasks.value.length) * 100),
)

const taskColumns = [
  { name: 'task', label: 'Category', width: '220px' },
  { name: 'description', label: 'Task description' },
  { name: 'priority', label: 'Priority', width: '160px' },
  { name: 'action', label: 'Next step', width: '220px', align: 'right' as const },
]

const taskRows = computed(() =>
  activeTasks.value.map(t => ({
    ...t,
    done: tasks.completed.includes(t.key),
  })),
)

function handleAction(item: TaskDef) {
  if (item.href) {
    router.push(item.href)
  }
}
</script>

<style scoped>
.dashboard {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--warm-white, #FBF8F3);
  min-height: 100%;
}

.dashboard__heading {
  font-weight: 600;
  font-size: 28px;
  line-height: 36px;
  color: var(--primary);
  margin: 0;
}

.dashboard__question {
  font-weight: 600;
  font-size: 18px;
  line-height: 26px;
  color: var(--primary);
  margin: 0;
}

.dashboard__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1023px) {
  .dashboard__cards { grid-template-columns: 1fr; }
}

.svc-card {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 208px;
  cursor: pointer;
  transition: border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
  position: relative;
}

.svc-card:not(.svc-card--static):hover {
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.svc-card--static { cursor: default; }

.svc-card--selected {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}

.svc-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.svc-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--warm-white, #FBF8F3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}
.svc-card--active .svc-card__icon { background: #D5FC52; }

.svc-card__title {
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: var(--primary);
  margin: 0;
}

.svc-card__desc {
  font-size: 13px;
  line-height: 20px;
  color: var(--neutral-900);
  margin: 0;
}

.svc-card__progress { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }

.svc-card__progress-meta { display: flex; justify-content: space-between; align-items: center; }

.svc-card__progress-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--neutral-700);
  font-weight: 600;
}

.svc-card__progress-count {
  font-size: 11px;
  color: var(--neutral-900);
  font-weight: 600;
}

.svc-card__progress-bar {
  width: 100%;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 999px;
  overflow: hidden;
}

.svc-card__progress-fill {
  height: 100%;
  background: var(--accent, #517070);
  border-radius: 999px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.svc-card--active .svc-card__progress-fill { background: #D5FC52; }

.svc-card__footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.svc-card__cta {
  font-weight: 600;
  font-size: 12px;
  color: var(--primary);
}
.svc-card--active .svc-card__cta { color: var(--accent, #517070); }
.svc-card--active .svc-card__cta::before { content: '✓ '; }

.svc-card__link {
  font-weight: 500;
  font-size: 13px;
  color: var(--primary);
  text-decoration: underline;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.svc-card__link:hover { text-decoration: none; }

.svc-card__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.svc-card__stat {
  background: var(--warm-white, #FBF8F3);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 10px;
  padding: 10px 12px;
}

.svc-card__stat-num {
  font-weight: 600;
  font-size: 22px;
  line-height: 26px;
  color: var(--primary);
}

.svc-card__stat-label {
  font-size: 11px;
  line-height: 14px;
  color: var(--neutral-900);
  margin-top: 2px;
}

.svc-card__live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary);
}

.svc-card__live-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.12);
  animation: live-pulse 1.8s ease-in-out infinite;
}

@keyframes live-pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(20, 6, 10, 0.12); }
  50% { box-shadow: 0 0 0 5px rgba(20, 6, 10, 0.06); }
}

.dashboard__tasks {
  background: var(--white);
  border: 1px solid var(--neutral-300, #E6E6E6);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dashboard__tasks-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard__tasks-title {
  display: flex;
  align-items: center;
  gap: 4px;
}
.dashboard__tasks-title h2 {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--primary);
  margin: 0;
}

.dashboard__tasks-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  line-height: 16px;
  color: var(--neutral-700);
}

.dashboard__tasks-bar {
  width: 140px;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 999px;
  overflow: hidden;
}

.dashboard__tasks-bar-fill {
  height: 100%;
  background: var(--accent, #517070);
  border-radius: 999px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.task-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
}
</style>
