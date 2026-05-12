<script setup lang="ts">
import RoutineCard from "./RoutineCard.vue";

defineProps<{
  loading: boolean;
  routines: any[];
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
}>();
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow p-6 mt-6"
  >
    <div
      class="flex items-center justify-between mb-6"
    >
      <h3
        class="text-2xl font-bold"
      >
        Your Routines
      </h3>
    </div>

    <div
      v-if="loading"
      class="flex justify-center py-16"
    >
      <div
        class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div
      v-else-if="!routines.length"
      class="text-center py-16"
    >
      <h4
        class="text-xl font-semibold"
      >
        No routines found
      </h4>

      <p class="text-gray-500 mt-2">
        Create your first routine.
      </p>
    </div>

    <div
      v-else
      class="space-y-4"
    >
      <RoutineCard
        v-for="routine in routines"
        :key="routine.id"
        :routine="routine"
        @deleted="
          emit('refresh')
        "
      />
    </div>
  </div>
</template>