<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  background: var(--warm-white, #FBF8F3);
}
</style>
