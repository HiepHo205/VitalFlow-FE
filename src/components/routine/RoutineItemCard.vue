<script setup lang="ts">
import { computed, ref } from "vue";

import { completeRoutineItem } from "@/api/routine-completion";

import type { RoutineItem } from "@/types/routine";

const props = defineProps<{
  item: RoutineItem;
}>();

const loading = ref(false);

const completions = computed(() => props.item.completions ?? []);

const isCompleted = computed(() =>
  completions.value.some(
    (completion) => completion.status === "completed",
  ),
);

const handleComplete = async () => {
  if (isCompleted.value) {
    return;
  }

  try {
    loading.value = true;

    const today = new Date().toISOString().split("T")[0]!;

    const res = await completeRoutineItem({
      routine_item_id: props.item.id,

      completed_date: today,

      status: "completed",
    });

    if (!Array.isArray(props.item.completions)) {
      props.item.completions = [];
    }

    props.item.completions.push(res.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="border rounded-2xl p-5 transition"
    :class="isCompleted ? 'bg-green-50 border-green-300' : 'bg-white'"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3
          class="text-lg font-bold"
          :class="isCompleted ? 'line-through text-gray-400' : ''"
        >
          {{ item.title }}
        </h3>

        <p class="text-gray-500 mt-1">
          {{ item.description }}
        </p>
      </div>
      <button
        v-if="!isCompleted"
        @click="handleComplete"
        :disabled="loading"
        class="px-4 py-2 bg-black text-white rounded-xl disabled:opacity-50"
      >
        {{ loading ? "Saving..." : "Complete" }}
      </button>

      <div v-else class="px-4 py-2 bg-green-500 text-white rounded-xl">
        Completed
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
      <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
        {{ item.category }}
      </span>

      <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
        {{ item.start_time }}
        -
        {{ item.end_time }}
      </span>

      <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
        {{ item.duration_minutes }}
        mins
      </span>

      <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">
        Priority:
        {{ item.priority }}
      </span>
    </div>
  </div>
</template>
