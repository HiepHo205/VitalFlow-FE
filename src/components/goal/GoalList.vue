<script setup lang="ts">
import { ref } from "vue";
import type { Goal } from "@/types/goal";

const props = defineProps<{
  goals: Goal[];
  loading: boolean;
  savingIds?: string[];
}>();

const emit = defineEmits<{
  (e: "update-goal", id: string, currentValue: number): void;
}>();

const progressInputs = ref<Record<string, number>>({});

const calculateProgress = (goal: Goal) => {
  if (!goal.target_value) {
    return 0;
  }

  const current = Number(progressValue(goal));
  const target = Number(goal.target_value);

  return Math.min(100, Math.round((current / target) * 100));
};

const progressValue = (goal: Goal) => {
  if (progressInputs.value[goal.id] === undefined) {
    progressInputs.value[goal.id] = Number(goal.current_value ?? 0);
  }

  return progressInputs.value[goal.id];
};

const setProgress = (goal: Goal, value: number) => {
  progressInputs.value[goal.id] = value;
};

const adjustProgress = (goal: Goal, delta: number) => {
  const current = progressValue(goal);
  const target = goal.target_value !== null ? Number(goal.target_value) : null;

  let nextValue = current + delta;
  if (nextValue < 0) {
    nextValue = 0;
  }

  if (target !== null && !Number.isNaN(target) && nextValue > target) {
    nextValue = target;
  }

  setProgress(goal, nextValue);
};

const saveGoalProgress = (goal: Goal) => {
  emit("update-goal", goal.id, progressValue(goal));
};

const isGoalSaving = (goal: Goal) => {
  return (props.savingIds ?? []).includes(goal.id);
};
</script>

<template>
  <div class="bg-white rounded-3xl shadow p-6 mt-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold">Your Goals</h3>
    </div>

    <div v-if="loading" class="flex justify-center py-10">
      <div
        class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div v-else-if="!goals.length" class="text-center py-10">
      <p class="text-gray-500">No goals found</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="goal in goals" :key="goal.id" class="border rounded-2xl p-5">
        <div class="flex items-start justify-between">
          <div>
            <h4 class="text-lg font-bold capitalize">
              {{ goal.goal_type }}
            </h4>

            <p class="text-sm text-gray-500 mt-1">
              {{ progressValue(goal) }}
              /
              {{ goal.target_value }}
            </p>
          </div>

          <div class="px-3 py-1 rounded-full text-sm bg-black text-white">
            {{ goal.status }}
          </div>
        </div>

        <div class="mt-4">
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="adjustProgress(goal, -1)"
              :disabled="isGoalSaving(goal)"
              class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              -
            </button>

            <div class="flex-1">
              <div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-black"
                  :style="{ width: `${calculateProgress(goal)}%` }"
                />
              </div>
            </div>

            <button
              type="button"
              @click="adjustProgress(goal, 1)"
              :disabled="isGoalSaving(goal)"
              class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <div
            class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="text-sm text-gray-500">
              {{ progressValue(goal) }} / {{ goal.target_value }}
            </div>

            <button
              type="button"
              @click="saveGoalProgress(goal)"
              :disabled="isGoalSaving(goal)"
              class="rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
            >
              {{ isGoalSaving(goal) ? "Saving..." : "Save progress" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
