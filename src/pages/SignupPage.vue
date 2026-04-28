<template>
  <div class="signup-page">
    <div class="signup-hero">
      <h1 class="signup-hero__title">Hello Bob and welcome to Ankorstore.</h1>
      <p class="signup-hero__subtitle">Sign up to Ankorstore without any commitment!</p>
    </div>

    <div class="signup-card">
      <h2 class="signup-card__title">Sign up</h2>

      <div class="field-stack">
        <AkInput v-model="email" label="E-mail address" type="email" />
        <AkInput v-model="password" label="Create your password" :type="showPwd ? 'text' : 'password'" />
        <div class="terms-row">
          <AkCheckbox v-model="acceptTerms" />
          <span>I agree to Ankorstore's <a href="#">Terms and Conditions</a></span>
        </div>
      </div>
    </div>

    <div class="signup-actions">
      <AkButton color="primary" size="lg" @click="next">Sign up</AkButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('founder@example.com')
const password = ref('password123')
const showPwd = ref(false)
const acceptTerms = ref(true)

function next() {
  router.push('/company-details')
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
  padding: 120px 48px 80px;
  max-width: 640px;
  margin: 0 auto;
}

.signup-hero { margin-bottom: var(--space-5); }

.signup-hero__title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--primary);
}

.signup-hero__subtitle {
  font-size: 14px;
  color: var(--neutral-700);
  margin: 0;
}

.signup-card {
  background: var(--white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.signup-card__title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-5);
  color: var(--primary);
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.terms-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--primary);
}

.terms-row a {
  color: var(--primary);
  text-decoration: underline;
}

.signup-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-5);
}
</style>
