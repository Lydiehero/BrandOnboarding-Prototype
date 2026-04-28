import { createRouter, createWebHistory } from 'vue-router'

// Layout: 'default' (simple topbar+sidebar), 'connected' (full backoffice), or 'blank' (no chrome)
// Set layout in route meta: meta: { layout: 'connected' }
// Default layout is used when no layout is specified.

const routes = [
  {
    path: '/hub',
    component: () => import('@/pages/PrototypeHubPage.vue'),
    meta: { title: 'Prototype hub', layout: 'blank' },
  },
  {
    path: '/onboarding',
    component: () => import('@/pages/OnboardingPage.vue'),
    meta: { title: 'Set up your brand', layout: 'blank' },
  },
  {
    path: '/apply',
    component: () => import('@/pages/ApplyPage.vue'),
    meta: { title: 'Apply to sell', layout: 'blank' },
  },
  {
    path: '/signup',
    component: () => import('@/pages/SignupPage.vue'),
    meta: { title: 'Sign up', layout: 'blank' },
  },
  {
    path: '/company-details',
    component: () => import('@/pages/CompanyDetailsPage.vue'),
    meta: { title: 'Company details', layout: 'blank' },
  },
  {
    path: '/personalize',
    component: () => import('@/pages/PersonalizeStorePage.vue'),
    meta: { title: 'Personalize your store', layout: 'blank' },
  },
  {
    path: '/shipping',
    component: () => import('@/pages/ShippingPage.vue'),
    meta: { title: 'Shipping', layout: 'blank' },
  },
  {
    path: '/mvp/dashboard',
    component: () => import('@/pages/MvpDashboardPage.vue'),
    meta: { title: 'Dashboard (MVP)', layout: 'connected' },
  },
  {
    path: '/mvp/catalogue-import',
    component: () => import('@/pages/CatalogueImportPage.vue'),
    meta: { title: 'Import catalogue', layout: 'blank' },
  },
  {
    path: '/mvp/products',
    component: () => import('@/pages/MvpProductsPage.vue'),
    meta: { title: 'My catalogue', layout: 'connected' },
  },
  {
    path: '/mvp/preview-launch',
    component: () => import('@/pages/MvpPreviewLaunchPage.vue'),
    meta: { title: 'Preview & Launch', layout: 'blank' },
  },
  {
    path: '/',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Dashboard', icon: 'home', layout: 'connected' },
  },
  {
    path: '/shop',
    component: () => import('@/pages/StorePage.vue'),
    meta: { title: 'Edit my shop', icon: 'shop-window', layout: 'connected' },
  },
  {
    path: '/products',
    component: () => import('@/pages/CataloguePage.vue'),
    meta: { title: 'Catalogue', icon: 'box-seam', layout: 'connected' },
  },
  {
    path: '/preview-launch',
    component: () => import('@/pages/PreviewLaunchPage.vue'),
    meta: { title: 'Preview & Launch', layout: 'blank' },
  },
  {
    path: '/orders',
    component: () => import('@/pages/OrderListPage.vue'),
    meta: { title: 'Orders', icon: 'cart', layout: 'connected' },
  },
  {
    path: '/orders/:id',
    component: () => import('@/pages/OrderDetailPage.vue'),
    meta: { title: 'Order Detail', icon: 'cart', layout: 'connected' },
  },
  {
    path: '/showcase/colors',
    component: () => import('@/pages/showcase/ColorsPage.vue'),
    meta: { title: 'Colors', icon: 'grid' },
  },
  {
    path: '/showcase/typography',
    component: () => import('@/pages/showcase/TypographyPage.vue'),
    meta: { title: 'Typography', icon: 'grid' },
  },
  {
    path: '/showcase/spacing',
    component: () => import('@/pages/showcase/SpacingPage.vue'),
    meta: { title: 'Spacing & Radius', icon: 'grid' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
