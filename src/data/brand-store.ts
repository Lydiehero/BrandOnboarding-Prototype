import { reactive } from 'vue'

export interface BrandData {
  name: string
  legalForm: string
  id: string
  vat: string
  street: string
  postal: string
  city: string
  country: string
  industry: string
  website: string
}

export interface TaskState {
  completed: string[]
  currentService: string | null
  autoImport: boolean
  shopUrl: string
}

const defaultBrand: BrandData = {
  name: '',
  legalForm: '',
  id: '',
  vat: '',
  street: '',
  postal: '',
  city: '',
  country: 'France',
  industry: 'Home & Decoration',
  website: '',
}

export interface CatalogueProduct {
  id: number
  name: string
  category: string
  sku: string
  stock: number
  retail: number
  wholesale: number
  vat: number
  madeIn: string
  description: string
  images: string[]
  tags: string[]
  variants: number
  createdAt: number
}

const state = reactive({
  brand: { ...defaultBrand } as BrandData,
  tasks: {
    completed: [] as string[],
    currentService: null as string | null,
    autoImport: false,
    shopUrl: '',
  } as TaskState,
  products: [] as CatalogueProduct[],
})

export function useBrandStore() {
  function setBrand(data: Partial<BrandData>) {
    Object.assign(state.brand, data)
  }

  function resetBrand() {
    Object.assign(state.brand, defaultBrand)
    state.tasks.completed = []
    state.tasks.currentService = null
    state.tasks.autoImport = false
    state.tasks.shopUrl = ''
  }

  function markTaskComplete(key: string) {
    if (!state.tasks.completed.includes(key)) {
      state.tasks.completed.push(key)
    }
  }

  function setCurrentService(service: string | null) {
    state.tasks.currentService = service
  }

  function setAutoImport(v: boolean, url = '') {
    state.tasks.autoImport = v
    state.tasks.shopUrl = url
  }

  function addProduct(p: Omit<CatalogueProduct, 'id' | 'createdAt'>) {
    const id = state.products.length > 0 ? Math.max(...state.products.map(x => x.id)) + 1 : 1
    state.products.unshift({ ...p, id, createdAt: Date.now() })
    return id
  }

  return { state, setBrand, resetBrand, markTaskComplete, setCurrentService, setAutoImport, addProduct }
}

export const MOCK_REGISTRY: Record<string, BrandData> = {
  '852751983': {
    name: 'Maison Berthe',
    legalForm: 'SAS',
    id: '852 751 983',
    vat: 'FR63852751983',
    street: '12 Rue du Faubourg Saint-Antoine',
    postal: '75011',
    city: 'Paris',
    country: 'France',
    industry: 'Home & Decoration',
    website: 'https://www.maisonberthe.fr',
  },
  '403170601': {
    name: 'Atelier Marguerite',
    legalForm: 'SARL',
    id: '403 170 601',
    vat: 'FR98403170601',
    street: '8 Rue Oberkampf',
    postal: '75011',
    city: 'Paris',
    country: 'France',
    industry: 'Fashion & Accessories',
    website: '',
  },
}

export const COUNTRIES = [
  { code: 'FR', flag: '🇫🇷', name: 'France', label: 'SIREN number', placeholder: '852 751 983', help: '9 digits · issued by INSEE', source: 'insee.fr' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', label: 'Company number', placeholder: '12345678', help: '8 characters · Companies House', source: 'companieshouse.gov.uk' },
  { code: 'DE', flag: '🇩🇪', name: 'Germany', label: 'Handelsregister-Nr.', placeholder: 'HRB 123456', help: 'Commercial register', source: 'handelsregister.de' },
  { code: 'IT', flag: '🇮🇹', name: 'Italy', label: 'Partita IVA', placeholder: '12345678901', help: '11 digits · Italian VAT', source: 'registroimprese.it' },
  { code: 'ES', flag: '🇪🇸', name: 'Spain', label: 'NIF / CIF', placeholder: 'B12345678', help: '9 characters · Spanish tax ID', source: 'agenciatributaria.es' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands', label: 'KvK number', placeholder: '12345678', help: '8 digits · Chamber of Commerce', source: 'kvk.nl' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgium', label: 'Numéro BCE', placeholder: '0123.456.789', help: '10 digits · BCE / KBO', source: 'kbopub.economie.fgov.be' },
]

export const INDUSTRIES = [
  'Home & Decoration',
  'Food & Drink',
  'Fashion & Accessories',
  'Beauty & Wellbeing',
  'Kids',
  'Stationery & Gifts',
  'Pets',
  'Other',
]

export const LEGAL_FORMS = ['SAS', 'SARL', 'SA', 'EI', 'Ltd', 'GmbH', 'SRL', 'Other']
