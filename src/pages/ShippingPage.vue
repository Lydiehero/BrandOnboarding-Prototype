<template>
  <div class="sh-page">
    <OnboardingStepper current="shipping" />

    <div class="sh-content">
      <h1 class="sh-title">Shipping</h1>

      <!-- Shipping Address -->
      <div class="sh-card">
        <h2 class="sh-section-title">Shipping Address</h2>
        <p class="sh-section-sub">Your brand page and products won't be shown to retailers outside of your selected delivery zone.</p>
        <AkInput v-model="shipAddr" label="Shipping Address" disabled />
        <label class="sh-check">
          <AkCheckbox v-model="sameAsPublic" />
          <span>Identical to public address</span>
        </label>
      </div>

      <!-- Delivery zone -->
      <div class="sh-card">
        <h2 class="sh-section-title">Delivery zone</h2>

        <div class="sh-pills">
          <label
            v-for="p in deliveryOptions"
            :key="p.value"
            class="sh-pill"
            :class="{ 'sh-pill--active': delivery === p.value }"
          >
            <input type="radio" v-model="delivery" :value="p.value" />
            {{ p.label }}
          </label>
        </div>

        <div class="sh-tags">
          <span v-for="c in countries" :key="c" class="sh-tag">
            {{ c }}
            <button class="sh-tag-x" @click="removeCountry(c)" aria-label="Remove">×</button>
          </span>
        </div>

        <AkAlert type="warning" title="Shipping to the UK and Germany">
          <p style="margin: 0 0 var(--space-3);">Retailers from UK and Germany won't be able to find your store on Ankorstore until you add EORI and LUCID numbers (you can do it later from Settings in your account).</p>
          <div style="display:flex; flex-direction:column; gap: var(--space-3);">
            <AkInput v-model="eori" label="UK – EORI Number (mandatory to sell)" placeholder="UK123456789" />
            <AkInput v-model="lucid" label="Germany – LUCID Number (mandatory to sell)" placeholder="DE123456789" />
          </div>
        </AkAlert>
      </div>

      <!-- Minimum order value -->
      <div class="sh-card">
        <h2 class="sh-section-title">Minimum order value</h2>
        <p class="sh-section-sub">Retailers won't be able to place orders below your Minimum order value.</p>

        <AkAlert type="info">
          <strong>Tip:</strong> Lower minimums make it easier for retailers to place their first orders.
        </AkAlert>

        <div class="sh-sub-card">
          <div class="sh-sub-title">First order</div>
          <div class="sh-order-row">
            <span>Set the <strong>minimum order value</strong> is</span>
            <div class="sh-amount">
              <input type="number" v-model="firstOrder" min="0" />
              <span class="sh-curr">€</span>
            </div>
          </div>
        </div>

        <div class="sh-sub-card">
          <div class="sh-sub-title">Reorder</div>
          <div class="sh-order-row">
            <span>Set the <strong>minimum order value</strong> is</span>
            <div class="sh-amount">
              <input type="number" v-model="reorder" min="0" placeholder="0" />
              <span class="sh-curr">€</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping cost contribution -->
      <div class="sh-card">
        <h2 class="sh-section-title">Shipping cost contribution</h2>

        <div class="sh-bar-wrap">
          <div class="sh-bar-labels-top">
            <div></div>
            <div class="sh-bar-top--mid">Minimum order value</div>
            <div class="sh-bar-top--right">Free shipping threshold</div>
          </div>
          <div class="sh-bar-track">
            <div class="sh-seg sh-seg--gray"></div>
            <div class="sh-seg sh-seg--mid"></div>
            <div class="sh-seg sh-seg--right"></div>
          </div>
          <div class="sh-bar-labels-bot">
            <div>No orders</div>
            <div style="text-align:center">Retailer pays a shipping fee</div>
            <div style="text-align:right">You cover all shipping costs</div>
          </div>
        </div>

        <p style="font-size:13px; margin:var(--space-4) 0 var(--space-2);">You can charge a shipping fee to retailers for first orders and reorders:</p>
        <ul style="font-size:13px; padding-left:20px; line-height:1.8; color:var(--neutral-700);">
          <li>Between the minimum order value and the free shipping threshold, the retailer pays a shipping fee added to their order.</li>
          <li>Above the free shipping threshold, you cover all shipping costs.</li>
        </ul>

        <div v-for="z in zones" :key="z.name" class="sh-zone">
          <div class="sh-zone-header">
            <span class="sh-zone-name">{{ z.name }}</span>
            <button class="sh-zone-link" @click="z.expanded = !z.expanded">
              {{ z.expanded ? 'I cover all shipping costs' : 'Add retailer shipping fee' }}
            </button>
          </div>
          <p v-if="z.countries" class="sh-zone-countries">Includes {{ z.countries }}</p>
          <div v-if="z.expanded">
            <div class="sh-zone-row">
              <span>When the order is below your <strong>free shipping threshold</strong> of</span>
              <div class="sh-amount">
                <input type="number" v-model="z.threshold" />
                <span class="sh-curr">€</span>
              </div>
            </div>
            <div class="sh-zone-row">
              <span>You will charge the retailer a <strong>shipping fee</strong> of</span>
              <div class="sh-amount">
                <input type="number" v-model="z.fee" />
                <span class="sh-curr">€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Average shipping time -->
      <div class="sh-card">
        <h2 class="sh-section-title">Average shipping time</h2>
        <p class="sh-section-sub">This information is displayed on your page and informs your retailers about the average time. If the time is exceeded, the retailer will be able to cancel the order.</p>
        <AkSelect
          v-model="avgShipping"
          :options="shippingTimeOptions"
          placeholder="Choose the average shipping time for your products"
        />
      </div>
    </div>

    <div class="sh-bottom">
      <AkButton outlined @click="back">Previous</AkButton>
      <AkButton color="primary" @click="finish">Next</AkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OnboardingStepper from '@/components/OnboardingStepper.vue'

const router = useRouter()

const shipAddr = ref('rue des italiens, Paris, 75000, FR')
const sameAsPublic = ref(true)

const delivery = ref('everywhere')
const deliveryOptions = [
  { label: 'Everywhere', value: 'everywhere' },
  { label: 'Selected countries', value: 'selected' },
  { label: 'France', value: 'france' },
]

const countries = ref([
  'Austria', 'Belgium', 'Bulgaria', 'Cyprus', 'Germany', 'Denmark', 'Estonia',
  'Spain', 'Finland', 'France', 'United Kingdom', 'Greece', 'Croatia', 'Hungary',
  'Ireland', 'Italy', 'Lithuania', 'Latvia', 'Malta', 'Netherlands', 'Poland',
  'Portugal', 'Romania', 'Sweden', 'Slovenia', 'Slovakia',
])

function removeCountry(c: string) {
  countries.value = countries.value.filter(x => x !== c)
}

const eori = ref('')
const lucid = ref('')

const firstOrder = ref(100)
const reorder = ref<number | string>('')

const zones = ref([
  { name: 'Domestic shipping: France', countries: '', expanded: true, threshold: 150, fee: 5 },
  { name: 'International Zone 1', countries: 'Austria, Belgium, Spain, Italy, Netherlands', expanded: true, threshold: 250, fee: 15 },
  { name: 'International Zone 2', countries: 'Bulgaria, Cyprus, Denmark, Estonia, Finland, Greece, Croatia, Hungary, Ireland, Lithuania, Latvia, Malta, Poland, Portugal, Romania, Sweden, Slovenia, Slovakia', expanded: false, threshold: 0, fee: 0 },
])

const avgShipping = ref('')
const shippingTimeOptions = [
  { label: '1–3 business days', value: '1-3' },
  { label: '3–5 business days', value: '3-5' },
  { label: '5–7 business days', value: '5-7' },
  { label: '7–10 business days', value: '7-10' },
  { label: '10–14 business days', value: '10-14' },
]

function back() { router.push('/personalize') }
function finish() { router.push('/mvp/dashboard') }
</script>

<style scoped>
.sh-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
}

.sh-content {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) var(--space-6);
}

.sh-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 var(--space-5);
  color: var(--primary);
}

.sh-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.sh-section-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
  color: var(--primary);
}

.sh-section-sub {
  font-size: 13px;
  color: var(--neutral-700);
  margin: 0;
  line-height: 1.5;
}

.sh-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.sh-pills {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.sh-pill {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--color-border-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
}

.sh-pill--active { border-color: var(--primary); }

.sh-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-3);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}

.sh-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 10px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  background: var(--white);
  color: var(--primary);
}

.sh-tag-x {
  border: none;
  background: none;
  cursor: pointer;
  color: var(--neutral-700);
  font-size: 14px;
  padding: 0 2px;
}

.sh-sub-card {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.sh-sub-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--primary);
}

.sh-order-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  gap: var(--space-3);
  color: var(--primary);
}

.sh-order-row span { flex: 1; line-height: 1.4; }

.sh-amount {
  display: flex;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  overflow: hidden;
  width: 110px;
  flex-shrink: 0;
}

.sh-amount input {
  flex: 1;
  min-width: 0;
  border: none;
  padding: 0 10px;
  height: 40px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  background: var(--white);
  text-align: right;
}

.sh-curr {
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 14px;
  color: var(--neutral-700);
  border-left: 1px solid var(--color-border-light);
  background: var(--neutral-100);
}

.sh-bar-wrap { margin-top: var(--space-2); }

.sh-bar-labels-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-bottom: 4px;
  font-size: 11px;
  color: var(--neutral-700);
  font-weight: 600;
}
.sh-bar-top--mid { text-align: center; }
.sh-bar-top--right { text-align: right; }

.sh-bar-track {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  gap: 2px;
}

.sh-seg { flex: 1; border-radius: 3px; }
.sh-seg--gray { background: var(--neutral-500); flex: 0.8; }
.sh-seg--mid { background: #c4bce8; }
.sh-seg--right { background: #e0dbf5; }

.sh-bar-labels-bot {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 5px;
  font-size: 11px;
  color: var(--neutral-700);
  font-weight: 600;
}

.sh-zone {
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  margin-top: var(--space-3);
  overflow: hidden;
}

.sh-zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  flex-wrap: wrap;
  gap: var(--space-2);
}

.sh-zone-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--primary);
}

.sh-zone-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.sh-zone-countries {
  font-size: 12px;
  color: var(--neutral-700);
  padding: 0 var(--space-4) var(--space-3);
  margin: 0;
  border-top: 1px solid var(--color-border-light);
  padding-top: var(--space-3);
}

.sh-zone-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border-light);
  gap: var(--space-3);
  font-size: 14px;
  color: var(--primary);
}

.sh-bottom {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 var(--space-5) var(--space-7);
  display: flex;
  gap: var(--space-3);
}
</style>
