<template>
  <div class="hub">
    <header class="hub__header">
      <span class="hub__logo">ankorstore</span>
      <span class="hub__tag">Prototype hub</span>
    </header>

    <main class="hub__main">
      <section class="hub__intro">
        <p class="hub__eyebrow">Internal · Design prototypes</p>
        <h1 class="hub__title">Brand onboarding prototypes</h1>
        <p class="hub__subtitle">
          Browse every flow and page in this prototype. Click any card to jump in.
        </p>
      </section>

      <section v-for="group in groups" :key="group.title" class="hub__group">
        <div class="hub__group-head">
          <h2 class="hub__group-title">{{ group.title }}</h2>
          <p class="hub__group-sub">{{ group.description }}</p>
        </div>

        <div class="hub__grid">
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="hub__card"
          >
            <div class="hub__card-top">
              <span class="hub__step" v-if="item.step">{{ item.step }}</span>
              <AkBadge
                v-if="item.badge"
                :content="item.badge.label"
                :color="item.badge.color"
                size="sm"
              />
            </div>
            <h3 class="hub__card-title">{{ item.title }}</h3>
            <p class="hub__card-desc">{{ item.description }}</p>
            <div class="hub__card-footer">
              <span class="hub__card-path">{{ item.path }}</span>
              <span class="hub__card-arrow">→</span>
            </div>
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
type Badge = { label: string; color: string }
type Item = {
  title: string
  description: string
  path: string
  step?: string
  badge?: Badge
}

type Group = {
  title: string
  description: string
  items: Item[]
}

const groups: Group[] = [
  {
    title: 'Legacy onboarding flow',
    description: 'Full application and store setup journey, rebuilt with the design system.',
    items: [
      {
        step: '1',
        title: 'Apply to sell',
        description: 'Application form covering brand, category, turnover and retail network.',
        path: '/apply',
        badge: { label: 'Entry point', color: 'green' },
      },
      {
        step: '2',
        title: 'Sign up',
        description: 'Account creation with email, password and T&Cs.',
        path: '/signup',
      },
      {
        step: '3',
        title: 'Company details',
        description: 'Registration number, legal form, addresses and VAT details.',
        path: '/company-details',
      },
      {
        step: '4',
        title: 'Personalize your store',
        description: 'Logo, cover, brand story, intro video and brand tile.',
        path: '/personalize',
      },
      {
        step: '5',
        title: 'Shipping',
        description: 'Delivery zones, minimum order, shipping fees and lead times.',
        path: '/shipping',
      },
    ],
  },
  {
    title: 'MVP — catalogue',
    description: 'The post-onboarding experience for brands who just finished setup.',
    items: [
      {
        title: 'Dashboard (journey)',
        description: 'Post-onboarding home with first-order journey: 3 tasks (catalogue, go live, boost visibility).',
        path: '/mvp/dashboard',
        badge: { label: 'New', color: 'green' },
      },
      {
        title: 'Import catalogue',
        description: '3-step flow: detect provider from website URL, map columns, review & publish.',
        path: '/mvp/catalogue-import',
        badge: { label: 'New', color: 'green' },
      },
      {
        title: 'My catalogue (after import)',
        description: 'Products list shown after manual entry — opens an Add Product side drawer.',
        path: '/mvp/products',
        badge: { label: 'New', color: 'green' },
      },
      {
        title: 'Preview & launch (MVP)',
        description: 'Dedicated preview/launch flow connected to the dashboard "Push your store live" task.',
        path: '/mvp/preview-launch',
        badge: { label: 'New', color: 'green' },
      },
    ],
  },
  {
    title: 'New onboarding flow',
    description: 'The streamlined 4-step wizard with country + registration lookup.',
    items: [
      {
        title: 'Brand setup wizard',
        description: 'Country + registration lookup, review, shop URL, success.',
        path: '/onboarding',
        badge: { label: 'New', color: 'green' },
      },
    ],
  },
  {
    title: 'Backoffice pages',
    description: 'Authenticated brand workspace.',
    items: [
      {
        title: 'Dashboard',
        description: 'Home screen after login.',
        path: '/',
      },
      {
        title: 'Edit my shop',
        description: 'Shop page editor.',
        path: '/shop',
      },
      {
        title: 'Catalogue',
        description: 'Product list and management.',
        path: '/products',
      },
      {
        title: 'Preview & Launch',
        description: 'Final review before going live.',
        path: '/preview-launch',
      },
      {
        title: 'Orders',
        description: 'Order list with filters.',
        path: '/orders',
      },
    ],
  },
  {
    title: 'Design tokens',
    description: 'Reference pages for colors, typography and spacing.',
    items: [
      { title: 'Colors', description: 'All DS color tokens.', path: '/showcase/colors' },
      { title: 'Typography', description: 'Font sizes and weights.', path: '/showcase/typography' },
      { title: 'Spacing & Radius', description: 'Spacing scale and border radius.', path: '/showcase/spacing' },
    ],
  },
]
</script>

<style scoped>
.hub {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
  color: var(--primary);
}

.hub__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--color-border-light);
  background: var(--white);
}

.hub__logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hub__tag {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--neutral-700);
}

.hub__main {
  max-width: 1120px;
  margin: 0 auto;
  padding: var(--space-7) var(--space-6) var(--space-7);
}

.hub__intro {
  margin-bottom: var(--space-7);
}

.hub__eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--neutral-700);
  margin: 0 0 var(--space-3);
}

.hub__title {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 var(--space-3);
}

.hub__subtitle {
  font-size: 16px;
  color: var(--neutral-700);
  margin: 0;
  max-width: 560px;
}

.hub__group {
  margin-bottom: var(--space-7);
}

.hub__group-head {
  margin-bottom: var(--space-4);
}

.hub__group-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-1);
}

.hub__group-sub {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
}

.hub__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}

.hub__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
  min-height: 160px;
}

.hub__card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.hub__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.hub__step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--white);
  font-size: 12px;
  font-weight: 700;
}

.hub__card-title {
  font-size: 16px;
  font-weight: 700;
  margin: var(--space-1) 0 0;
}

.hub__card-desc {
  font-size: 13px;
  color: var(--neutral-700);
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.hub__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-2);
  padding-top: var(--space-2);
  border-top: 1px solid var(--color-border-light);
}

.hub__card-path {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 11px;
  color: var(--neutral-700);
}

.hub__card-arrow {
  font-size: 16px;
  color: var(--primary);
}
</style>
