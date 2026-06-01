<script setup lang="ts">
import { computed, ref } from "vue";

import { completeRoutineItem } from "@/api/routine-completion";

import type { Routine, RoutineItem } from "@/types/routine";

const props = defineProps<{
  routines: Routine[];
}>();

const loadingIds = ref<string[]>([]);

const routineColors = ["#111827", "#2563EB", "#059669", "#DC2626", "#9333EA"];

const timelineItems = computed(() => {
  return props.routines
    .flatMap((routine: Routine, index: number) =>
      routine.items.map((item: RoutineItem) => ({
        ...item,

        routine_name: routine.name,

        routine_color: routineColors[index % routineColors.length],
      })),
    )
    .sort((a, b) =>
      (a.start_time ?? "").localeCompare(b.start_time ?? ""),
    );
});

const isCompleted = (item: RoutineItem) => {
  return (item.completions ?? []).some(
    (completion) => completion.status === "completed",
  );
};

const handleComplete = async (item: RoutineItem) => {
  if (isCompleted(item)) {
    return;
  }

  try {
    loadingIds.value.push(item.id);

    const today = new Date().toISOString().split("T")[0]!;

    const res = await completeRoutineItem({
      routine_item_id: item.id,

      completed_date: today,

      status: "completed",
    });

    if (!item.completions) {
      item.completions = [];
    }

    item.completions.push(res.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    loadingIds.value = loadingIds.value.filter((id) => id !== item.id);
  }
};
</script>

<template>
  <div class="bg-white rounded-3xl shadow p-6 mt-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Today's Schedule</h2>

      <p class="text-gray-500 mt-1">Your daily activities</p>
    </div>

    <div class="space-y-5">
      <div v-for="item in timelineItems" :key="item.id" class="flex gap-4">
        <!-- Time -->
        <div class="w-24 shrink-0 text-right">
          <p class="font-bold text-sm">
            {{ item.start_time }}
          </p>

          <p class="text-xs text-gray-400">
            {{ item.end_time }}
          </p>
        </div>

        <!-- Timeline Dot -->
        <div
          class="w-4 h-4 rounded-full mt-1 shrink-0"
          :style="{
            backgroundColor: item.routine_color,
          }"
        />

        <!-- Card -->
        <div
          class="flex-1 rounded-2xl p-4 border transition"
          :class="
            isCompleted(item)
              ? 'bg-green-50 border-green-300 opacity-80'
              : 'bg-white'
          "
          :style="
            !isCompleted(item)
              ? {
                  borderColor: item.routine_color,
                }
              : {}
          "
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h3
                  class="font-bold"
                  :class="isCompleted(item) ? 'line-through text-gray-400' : ''"
                >
                  {{ item.title }}
                </h3>

                <span
                  v-if="isCompleted(item)"
                  class="text-xs px-2 py-1 rounded-full bg-green-500 text-white"
                >
                  Completed
                </span>
              </div>

              <p class="text-sm text-gray-500 mt-1">
                {{ item.description }}
              </p>
            </div>

            <div class="flex flex-col items-end gap-2">
              <div
                class="text-xs px-3 py-1 rounded-full text-white"
                :style="{
                  backgroundColor: item.routine_color,
                }"
              >
                {{ item.routine_name }}
              </div>

              <button
                v-if="!isCompleted(item)"
                @click="handleComplete(item)"
                :disabled="loadingIds.includes(item.id)"
                class="px-3 py-2 text-sm bg-black text-white rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {{ loadingIds.includes(item.id) ? "Saving..." : "Complete" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
