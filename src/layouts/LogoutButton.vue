<script setup lang="ts">
const handleLogout = () => {
  localStorage.removeItem("access_token");

  location.href = "/login";
};
</script>

<template>
  <button
    @click="handleLogout"
    class="px-4 py-2 bg-red-500 text-white rounded-lg"
  >
    Logout
  </button>
</template>