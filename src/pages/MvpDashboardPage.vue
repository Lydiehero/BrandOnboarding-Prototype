<template>
  <div class="dashboard">
    <!-- Hero journey card -->
    <section class="journey">
      <div class="journey__head">
        <p class="journey__eyebrow">🎉 Your account is ready</p>
        <h1 class="journey__title">
          You're {{ remainingSteps }} step{{ remainingSteps === 1 ? '' : 's' }} away from
          <span class="journey__accent">your first order</span>.
        </h1>
        <p class="journey__sub">
          Let's guide you through the few things that make brands succeed on Ankorstore.
        </p>
      </div>

      <div class="journey__progress">
        <span class="journey__progress-label">{{ doneCount }} of {{ tasks.length }} done</span>
        <div class="journey__progress-bar">
          <div class="journey__progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
      </div>
    </section>

    <!-- Tasks -->
    <section class="tasks">
      <article
        v-for="(t, i) in tasks"
        :key="t.key"
        class="task"
        :class="{
          'task--done': t.done,
          'task--active': activeKey === t.key && !t.done,
          'task--locked': isLocked(i),
        }"
        @click="toggle(t, i)"
      >
        <div class="task__head">
          <div class="task__num">
            <AkIcon v-if="t.done" symbol="check-lg" size="sm" />
            <template v-else>{{ i + 1 }}</template>
          </div>
          <div class="task__head-text">
            <h3 class="task__title">
              {{ t.label }}
              <AkBadge
                v-if="t.badge"
                :content="t.badge.label"
                :color="t.badge.color"
                size="sm"
              />
            </h3>
            <p class="task__desc">{{ t.shortDesc }}</p>
          </div>
          <AkIcon
            class="task__chevron"
            :symbol="activeKey === t.key ? 'chevron-up' : 'chevron-down'"
            size="sm"
          />
        </div>

        <!-- Expanded body -->
        <div v-if="activeKey === t.key" class="task__body" @click.stop>
          <p class="task__message" v-html="t.message"></p>

          <!-- Boost actions (only on visibility task) -->
          <div v-if="t.boosts" class="boosts">
            <article
              v-for="b in t.boosts"
              :key="b.key"
              class="boost"
              @click="handleBoost(b)"
            >
              <div class="boost__icon"><AkIcon :symbol="b.icon" /></div>
              <div class="boost__body">
                <h4 class="boost__title">{{ b.title }}</h4>
                <p class="boost__desc">{{ b.desc }}</p>
              </div>
              <AkIcon class="boost__arrow" symbol="chevron-right" size="sm" />
            </article>
          </div>

          <div v-if="!t.boosts" class="task__action">
            <AkButton color="primary" :symbol="t.actionIcon" @click="handleAction(t)">
              {{ t.cta }}
            </AkButton>
            <AkButton
              v-if="t.secondaryCta"
              outlined
              :symbol="t.secondaryIcon"
              @click.stop="handleSecondary(t)"
            >
              {{ t.secondaryCta }}
            </AkButton>
            <AkButton v-if="t.key !== 'catalogue'" outlined size="md" @click.stop="markDone(t)">
              Mark as done
            </AkButton>
          </div>
        </div>
      </article>
    </section>

    <AddProductDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AddProductDrawer from '@/components/AddProductDrawer.vue'
import { useBrandStore } from '@/data/brand-store'

const { state, markTaskComplete } = useBrandStore()
const drawerOpen = ref(false)

interface Boost {
  key: string
  icon: string
  title: string
  desc: string
  href?: string
}

interface Task {
  key: string
  label: string
  shortDesc: string
  message: string
  cta?: string
  actionIcon?: string
  href?: string
  secondaryCta?: string
  secondaryIcon?: string
  secondaryHref?: string
  secondaryAction?: 'open-drawer'
  doneHref?: string
  done: boolean
  badge?: { label: string; color: string }
  boosts?: Boost[]
}

const router = useRouter()

const tasks = ref<Task[]>([
  {
    key: 'catalogue',
    label: 'Add your catalogue',
    shortDesc: 'We spotted your shop — we can pull your products in one go.',
    message:
      "We detected your <strong>Magento store</strong> at <strong>yourshop.com</strong>. We can pull your products straight from there in one go — or you can add them one by one.",
    cta: "Let's add your catalogue",
    actionIcon: 'magic',
    href: '/mvp/products',
    doneHref: '/mvp/products',
    done: false,
  },
  {
    key: 'live',
    label: 'Push your store live',
    shortDesc: 'New brands get a 30-day boost on the marketplace.',
    message:
      "Going live unlocks a 30-day highlight on Ankorstore — your store appears in retailer feeds, search, and category pages. Don't miss this window: brands that go live in their first 2 weeks get 4× more first orders.",
    cta: 'Preview & launch',
    actionIcon: 'rocket-takeoff',
    href: '/mvp/preview-launch',
    done: false,
    badge: { label: '30-day highlight', color: 'green' },
  },
  {
    key: 'visibility',
    label: 'Boost your visibility',
    shortDesc: 'Pick the action that fits you best.',
    message:
      'Once your store is live, these are the highest-leverage moves to land your first order. Pick the one that fits your brand — you can always come back for the others.',
    done: false,
    boosts: [
      {
        key: 'volume-offer',
        icon: 'tag',
        title: 'Set up a volume offer',
        desc: 'Reward larger orders with a discount — proven to convert hesitant retailers.',
      },
      {
        key: 'b2b-link',
        icon: 'link-45deg',
        title: 'Add your B2B link to your B2C eshop',
        desc: 'Let the retailers visiting your D2C site find your wholesale page in one click.',
      },
      {
        key: 'campaign',
        icon: 'send',
        title: 'Send your first campaign',
        desc: 'Tell your network you\'re on Ankorstore — add contacts and prospects in 5 min.',
      },
    ],
  },
])

const stats = [
  { icon: 'eye', label: 'Store views', value: '—' },
  { icon: 'people', label: 'Retailer clicks', value: '—' },
  { icon: 'heart', label: 'Favourites', value: '—' },
  { icon: 'cart', label: 'Orders', value: '0' },
]

const activeKey = ref<string | null>('catalogue')

const doneCount = computed(() => tasks.value.filter(t => t.done).length)
const remainingSteps = computed(() => tasks.value.length - doneCount.value)
const progressPct = computed(() =>
  Math.round((doneCount.value / tasks.value.length) * 100),
)

function isLocked(index: number) {
  if (index === 0) return false
  return !tasks.value[index - 1].done
}

function toggle(t: Task, index: number) {
  if (isLocked(index) && !t.done) return
  if (t.done && t.doneHref) {
    router.push(t.doneHref)
    return
  }
  // If the task has a single primary action (a route), the whole card behaves as the CTA.
  if (t.href && !t.boosts) {
    router.push(t.href)
    return
  }
  activeKey.value = activeKey.value === t.key ? null : t.key
}

function handleAction(t: Task) {
  if (t.href) router.push(t.href)
}

function handleSecondary(t: Task) {
  if (t.secondaryAction === 'open-drawer') {
    drawerOpen.value = true
    return
  }
  if (t.secondaryHref) router.push(t.secondaryHref)
}

function handleBoost(b: Boost) {
  if (b.href) router.push(b.href)
}

function markDone(t: Task) {
  t.done = true
  markTaskComplete(t.key)
  const next = tasks.value.find(x => !x.done)
  activeKey.value = next ? next.key : null
}

// Sync dashboard tasks with the brand store (e.g. after publishing the catalogue)
watch(
  () => [...state.tasks.completed],
  (done) => {
    let advanced = false
    tasks.value.forEach(t => {
      if (done.includes(t.key) && !t.done) {
        t.done = true
        advanced = true
      }
    })
    if (advanced) {
      const next = tasks.value.find(x => !x.done)
      activeKey.value = next ? next.key : null
    }
  },
  { immediate: true },
)
</script>

<style scoped>
.dashboard {
  padding: var(--space-5) var(--space-6) var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--warm-white, #FBF8F3);
  min-height: 100%;
}

/* ── Journey hero ── */
.journey {
  background: linear-gradient(135deg, var(--white) 0%, #F8FCE9 100%);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.journey__eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
  margin: 0 0 var(--space-2);
}

.journey__title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.journey__accent {
  color: var(--accent, #517070);
}

.journey__sub {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
  max-width: 540px;
}

.journey__stepper {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.jstep {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 14px 8px 8px;
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--color-border-light);
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
}

.jstep--active {
  border-color: var(--primary);
  color: var(--primary);
}

.jstep--done {
  background: #F8FCE9;
  border-color: #D5FC52;
  color: var(--accent, #517070);
}

.jstep__num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--neutral-100);
  color: var(--neutral-700);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jstep--active .jstep__num {
  background: var(--primary);
  color: var(--white);
}

.jstep--done .jstep__num {
  background: #D5FC52;
  color: var(--primary);
}

.journey__progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.journey__progress-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--neutral-700);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.journey__progress-bar {
  height: 6px;
  background: var(--color-border-light);
  border-radius: 999px;
  overflow: hidden;
}

.journey__progress-fill {
  height: 100%;
  background: var(--accent, #517070);
  border-radius: 999px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ── Stats ── */
.stats {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.stats__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.stats__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
}

.stats__hint {
  font-size: 12px;
  color: var(--neutral-700);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
}

@media (max-width: 768px) {
  .stats__grid { grid-template-columns: repeat(2, 1fr); }
}

.stat {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  background: var(--warm-white, #FBF8F3);
}

.stat__icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.stat__num {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1.1;
}

.stat__label {
  font-size: 12px;
  color: var(--neutral-700);
  margin-top: 2px;
}

/* ── Tasks ── */
.tasks {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.task {
  position: relative;
  background: #F9F9F9;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-5) var(--space-5) calc(var(--space-5) + 6px);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: border-color 150ms ease, box-shadow 200ms ease, transform 200ms ease;
}

.task::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, #7A9590 0%, #557570 100%);
  opacity: 0.85;
}

.task:hover:not(.task--locked) {
  border-color: #E8C9A3;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.task--active {
  border-color: #A8C0BB;
  box-shadow: var(--shadow-md);
  background: #F9F9F9;
}

.task--done {
  background: #F9F9F9;
  border-color: #E2EFC0;
}

.task--done::before {
  background: linear-gradient(180deg, #D5FC52 0%, #A9C932 100%);
}

.task--locked {
  opacity: 0.55;
  cursor: not-allowed;
}

.task__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.task__num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--white);
  color: #557570;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid #D4E0DD;
  box-shadow: var(--shadow-xs);
}

.task--active .task__num {
  background: linear-gradient(135deg, #7A9590 0%, #557570 100%);
  color: var(--white);
  border-color: transparent;
}

.task--done .task__num {
  background: #D5FC52;
  color: var(--primary);
}

.task__head-text {
  flex: 1;
}

.task__title {
  font-size: 17px;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  letter-spacing: -0.01em;
}

.task__desc {
  font-size: 14px;
  color: #6B5A4B;
  margin: 0;
  line-height: 1.45;
}

.task__chevron {
  color: var(--neutral-700);
  flex-shrink: 0;
}

.task__body {
  padding-top: var(--space-4);
  margin-top: var(--space-4);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.task__message {
  font-size: 14px;
  line-height: 1.6;
  color: var(--primary);
  margin: 0;
}

.task__action {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

/* ── Boosts ── */
.boosts {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.boost {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--warm-white, #FBF8F3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color 150ms ease, transform 150ms ease;
}

.boost:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.boost__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.boost__body {
  flex: 1;
}

.boost__title {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 var(--space-1);
}

.boost__desc {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
}

.boost__arrow {
  color: var(--neutral-700);
  flex-shrink: 0;
}
</style>
