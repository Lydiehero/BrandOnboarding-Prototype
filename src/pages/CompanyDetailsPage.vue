<template>
  <div class="cd-page">
    <OnboardingStepper current="company" />

    <main class="cd-content">
      <h1 class="cd-title">Company details</h1>

      <div class="cd-card">
        <div class="cd-field">
          <AkInput v-model="regNum" label="Business registration number" />
          <AkAlert v-if="regNumError" type="error">This SIREN is invalid.</AkAlert>
        </div>

        <AkInput v-model="companyName" label="Company name (legal name)" />
        <AkInput v-model="yearFounded" label="Year founded" placeholder="YYYY" />
        <AkInput v-model="legalForm" label="Company legal form" placeholder="LTD, PLC, etc." />
        <AkInput v-model="city" label="City of registration" placeholder="London" />

        <div class="cd-field">
          <AkInput v-model="publicAddr" label="Public Address" />
          <button class="cd-link" type="button">Write address manually</button>
        </div>

        <label class="cd-check">
          <AkCheckbox v-model="useBilling" />
          <span>Use this as Billing Address</span>
        </label>

        <div class="cd-field">
          <AkInput v-model="billingAddr" label="Billing Address" :disabled="useBilling" />
          <button class="cd-link" type="button">Write address manually</button>
        </div>

        <label class="cd-check">
          <AkCheckbox v-model="vatExempt" />
          <span>My company is VAT exempt</span>
        </label>

        <div class="cd-field">
          <AkInput v-model="vatNum" label="VAT number" />
          <AkAlert v-if="!vatExempt && !vatNum" type="error">VAT number is required</AkAlert>
        </div>
      </div>
    </main>

    <div class="cd-bottom">
      <AkButton outlined @click="back">Previous</AkButton>
      <AkButton color="primary" @click="next">Next</AkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import OnboardingStepper from '@/components/OnboardingStepper.vue'

const router = useRouter()

const regNum = ref('430 420 331')
const companyName = ref("Tonio's stuff")
const yearFounded = ref('2020')
const legalForm = ref('LTD')
const city = ref('Paris')
const publicAddr = ref('rue des italiens, Paris, 75000, FR')
const useBilling = ref(true)
const billingAddr = ref('rue des italiens, Paris, 75000, FR')
const vatExempt = ref(false)
const vatNum = ref('')

const regNumError = computed(() => regNum.value === '430 420 331')

watch([useBilling, publicAddr], () => {
  if (useBilling.value) billingAddr.value = publicAddr.value
})

function back() { router.push('/signup') }
function next() { router.push('/personalize') }
</script>

<style scoped>
.cd-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
}

.cd-content {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5) 120px;
}

.cd-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 var(--space-5);
  color: var(--primary);
}

.cd-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cd-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cd-link {
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
}

.cd-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
}

.cd-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--white);
  border-top: 1px solid var(--color-border-light);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  z-index: var(--z-sticky);
}
</style>
