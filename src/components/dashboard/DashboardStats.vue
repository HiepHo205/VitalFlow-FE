<script setup lang="ts">
defineProps<{
  totalRoutines: number;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
  >
    <div
      class="bg-white rounded-2xl shadow p-5"
    >
      <p class="text-sm text-gray-500">
        Total Routines
      </p>

      <h3
        class="text-3xl font-bold mt-2"
      >
        {{ totalRoutines }}
      </h3>
    </div>

    <div
      class="bg-white rounded-2xl shadow p-5"
    >
      <p class="text-sm text-gray-500">
        Energy Level
      </p>

      <h3
        class="text-3xl font-bold mt-2"
      >
        80%
      </h3>
    </div>

    <div
      class="bg-white rounded-2xl shadow p-5"
    >
      <p class="text-sm text-gray-500">
        Completed Tasks
      </p>

      <h3
        class="text-3xl font-bold mt-2"
      >
        5/8
      </h3>
    </div>

    <div
      class="bg-white rounded-2xl shadow p-5"
    >
      <p class="text-sm text-gray-500">
        Sleep Hours
      </p>

      <h3
        class="text-3xl font-bold mt-2"
      >
        7.5h
      </h3>
    </div>
  </div>
</template>