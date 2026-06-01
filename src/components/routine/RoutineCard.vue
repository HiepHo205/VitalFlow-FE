<script setup lang="ts">
import { computed } from "vue";

import { RouterLink } from "vue-router";

import { deleteRoutine } from "@/api/routine";

import type { Routine, RoutineItem } from "@/types/routine";

const props = defineProps<{
  routine: Routine;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const completedItems = computed(() => {
  return props.routine.items.filter((item: RoutineItem) =>
    item.completions?.some(
      (completion) => completion.status === "completed",
    ),
  ).length;
});

const totalItems = computed(() => {
  return props.routine.items.length;
});

const progress = computed(() => {
  if (!totalItems.value) {
    return 0;
  }

  return Math.round((completedItems.value / totalItems.value) * 100);
});

const handleDelete = async () => {
  const confirmed = confirm("Delete this routine?");

  if (!confirmed) {
    return;
  }

  try {
    await deleteRoutine(props.routine.id);

    emit("deleted");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div
    class="border rounded-2xl p-5 hover:border-black hover:shadow transition bg-white"
  >
    <div class="flex items-start justify-between gap-4">
      <RouterLink
        :to="`/goals/${routine.goal_id}/routines/${routine.id}`"
        class="flex-1"
      >
        <div>
          <div class="flex items-center gap-3">
            <h4 class="text-xl font-bold">
              {{ routine.name }}
            </h4>

            <span class="text-sm px-3 py-1 rounded-full bg-black text-white">
              {{ completedItems }}/{{ totalItems }}
              Completed
            </span>
          </div>

          <p class="text-gray-500 mt-2">
            {{ routine.description }}
          </p>
        </div>
      </RouterLink>

      <div class="flex items-center gap-2">
        <div class="px-4 py-2 bg-gray-100 rounded-full text-sm">
          {{ routine.is_ai_generated ? "AI Generated" : "Manual" }}
        </div>

        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:opacity-90"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mt-5">
      <div class="flex items-center justify-between text-sm mb-2">
        <span> Progress </span>

        <span class="font-semibold"> {{ progress }}% </span>
      </div>

      <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-black transition-all"
          :style="{
            width: `${progress}%`,
          }"
        />
      </div>
    </div>
  </div>
</template>
