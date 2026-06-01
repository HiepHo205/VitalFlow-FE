<script setup lang="ts">
defineProps<{
  totalRoutines: number;
  completedTasks: number;
  totalTasks: number;
  averageEnergy: number;
  averageSleep: number;
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
  >
    <!-- Total Routines -->
    <div
      class="rounded-3xl bg-black text-white p-6"
    >
      <p
        class="text-sm text-gray-300"
      >
        Total Routines
      </p>

      <h2
        class="text-4xl font-bold mt-3"
      >
        {{ totalRoutines }}
      </h2>

      <div
        class="mt-6 text-xs text-gray-400"
      >
        Active routines
      </div>
    </div>

    <!-- Energy -->
    <div
      class="rounded-3xl border bg-white p-6"
    >
      <div
        class="flex items-center justify-between"
      >
        <p
          class="text-sm text-gray-500"
        >
          Average Energy
        </p>

        <div
          class="w-3 h-3 rounded-full bg-green-500"
        />
      </div>

      <h2
        class="text-4xl font-bold mt-3"
      >
        {{ averageEnergy }}%
      </h2>

      <div
        class="mt-6 h-2 rounded-full bg-gray-100 overflow-hidden"
      >
        <div
          class="h-full bg-green-500 transition-all"
          :style="{
            width: `${averageEnergy}%`,
          }"
        />
      </div>
    </div>

    <!-- Completed Tasks -->
    <div
      class="rounded-3xl border bg-white p-6"
    >
      <p
        class="text-sm text-gray-500"
      >
        Completed Tasks
      </p>

      <h2
        class="text-4xl font-bold mt-3"
      >
        {{ completedTasks }}/{{ totalTasks }}
      </h2>

      <p
        class="text-sm text-gray-400 mt-6"
      >
        Tasks finished today
      </p>
    </div>

    <!-- Sleep -->
    <div
      class="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6"
    >
      <p
        class="text-sm text-indigo-100"
      >
        Average Sleep
      </p>

      <h2
        class="text-4xl font-bold mt-3"
      >
        {{ averageSleep }}h
      </h2>

      <p
        class="text-sm mt-6 text-indigo-100"
      >
        Healthy sleep routine
      </p>
    </div>
  </div>
</template>