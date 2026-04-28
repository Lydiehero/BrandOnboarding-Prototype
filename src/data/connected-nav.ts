// Connected layout navigation items
// Designers: customize these to match your prototype's sidebar

export interface NavChild {
  path: string
  label: string
}

export interface NavItem {
  path: string
  label: string
  icon: string
  badge?: string
  children?: NavChild[]
}

export const topItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: 'house',
    children: [
      { path: '/', label: 'Success checklist' },
      { path: '/', label: 'Discounts & offers' },
      { path: '/', label: 'Carts to convert' },
      { path: '/', label: 'Ads' },
    ],
  },
  { path: '/orders', label: 'Orders', icon: 'cone-striped' },
  { path: '/network', label: 'My Network', icon: 'globe' },
  { path: '/products', label: 'Products', icon: 'box-seam' },
  { path: '/shop', label: 'Edit my shop', icon: 'shop-window' },
  { path: '/messages', label: 'Messages', icon: 'chat', badge: '3' },
]

export const bottomItems: NavItem[] = [
  { path: '/billing', label: 'Payment & billing', icon: 'credit-card-2-back' },
  { path: '/settings', label: 'Settings', icon: 'gear' },
  { path: '/integrations', label: 'Integrations', icon: 'puzzle' },
  { path: '/help', label: 'Help Centre', icon: 'question-circle' },
]
