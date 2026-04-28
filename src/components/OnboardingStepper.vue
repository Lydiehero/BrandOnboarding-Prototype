<template>
  <div class="os-wrap">
    <nav class="os-navbar">
      <span class="os-logo">ankorstore</span>
      <div class="os-right">
        <AkBadge content="Store is offline" color="red" size="sm" />
        <AkIcon symbol="bell" />
        <div class="os-avatar">Ta</div>
      </div>
    </nav>

    <div class="os-stepper">
      <template v-for="(s, i) in steps" :key="s.key">
        <div
          class="os-step"
          :class="{ 'os-step--active': s.key === current, 'os-step--done': isDone(s.key) }"
          @click="go(s)"
        >
          <span class="os-num">{{ isDone(s.key) ? '✓' : i + 1 }}</span>
          {{ s.label }}
        </div>
        <div
          v-if="i < steps.length - 1"
          class="os-line"
          :class="{ 'os-line--done': isDone(s.key) }"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

type Step = { key: string; label: string; path: string }

const props = defineProps<{ current: string }>()
const router = useRouter()

const steps: Step[] = [
  { key: 'company', label: 'Company', path: '/company-details' },
  { key: 'brand', label: 'Brand', path: '/personalize' },
  { key: 'shipping', label: 'Shipping', path: '/shipping' },
]

const order = ['company', 'brand', 'shipping']

function currentIdx() {
  return order.indexOf(props.current)
}

function isDone(key: string) {
  return order.indexOf(key) < currentIdx()
}

function go(s: Step) {
  router.push(s.path)
}
</script>

<style scoped>
.os-wrap {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--white);
}

.os-navbar {
  background: var(--white);
  border-bottom: 1px solid var(--color-border-light);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
}

.os-logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--primary);
}

.os-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.os-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--neutral-500);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--white);
}

.os-stepper {
  background: var(--white);
  border-bottom: 1px solid var(--color-border-light);
  padding: 0 var(--space-5);
  height: 54px;
  display: flex;
  align-items: center;
  gap: 0;
}

.os-step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 7px 14px 7px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--neutral-700);
  cursor: pointer;
  white-space: nowrap;
}

.os-step--active {
  border: 1.5px solid var(--primary);
  color: var(--primary);
}

.os-step--done { color: var(--success); }

.os-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--neutral-100);
  color: var(--neutral-700);
  flex-shrink: 0;
}

.os-step--done .os-num { background: var(--success); color: var(--white); }
.os-step--active .os-num { background: var(--primary); color: var(--white); }

.os-line {
  flex: 1;
  height: 1.5px;
  background: var(--color-border-light);
  min-width: 24px;
  max-width: 60px;
}

.os-line--done { background: var(--success); }
</style>
