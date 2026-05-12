<script setup lang="ts">
import AppHeader from "../components/layout/AppHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />

    <main class="p-6">
      <slot />
    </main>
  </div>
</template>