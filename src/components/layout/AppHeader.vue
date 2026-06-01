<script setup lang="ts">
import { computed } from "vue";

import { RouterLink } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();

const user = computed(() => auth.user);
</script>

<template>
  <header class="h-16 bg-white border-b flex items-center justify-between px-6">
    <div class="flex items-center gap-8">
      <h1 class="text-xl font-bold">VitalFlow</h1>

      <nav class="flex items-center gap-4">
        <RouterLink to="/dashboard" class="text-sm hover:text-black">
          Dashboard
        </RouterLink>

        <RouterLink to="/profile" class="text-sm hover:text-black">
          Profile
        </RouterLink>

        <RouterLink to="/goals" class="text-sm hover:text-black">
          Goals
        </RouterLink>

        <RouterLink to="/daily-logs" class="text-sm hover:text-black">
          Daily Logs
        </RouterLink>

        <RouterLink to="/journals" class="text-sm hover:text-black">
          Journals
        </RouterLink>

        <RouterLink to="/ai-feedbacks" class="text-sm hover:text-black">
          AI Insights
        </RouterLink>

        <RouterLink to="/weekly-reports" class="text-sm hover:text-black">
          Weekly Reports
        </RouterLink>

        <RouterLink to="/focus-sessions" class="text-sm hover:text-black">
          Focus Sessions
        </RouterLink>

        <RouterLink to="/notifications" class="text-sm hover:text-black">
          Notifications
        </RouterLink>

        <RouterLink to="/settings" class="text-sm hover:text-black">
          Settings
        </RouterLink>
      </nav>
    </div>

    <div class="flex items-center gap-4">
      <span class="text-sm text-gray-600">
        {{ user?.full_name }}
      </span>

      <button
        @click="auth.logout()"
        class="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  </header>
</template>
