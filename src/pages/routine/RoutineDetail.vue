<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import { getRoutineDetail, analyzeRoutine } from "@/api/routine";

import RoutineItemCard from "@/components/routine/RoutineItemCard.vue";

import type { Routine } from "@/types/routine";

const route = useRoute();

const router = useRouter();

const loading = ref(false);

const routine = ref<Routine | null>(null);

const goalId = route.params.goalId as string | undefined;

const analyzing = ref(false);
const analyzeResult = ref<{ summary: string; recommendation: string } | null>(
  null,
);

const fetchRoutine = async () => {
  try {
    loading.value = true;

    const res = await getRoutineDetail(route.params.id as string);

    routine.value = res.data.data;

    if (routine.value?.goal_id && !goalId) {
      router.replace(
        `/goals/${routine.value.goal_id}/routines/${route.params.id}`,
      );

      return;
    }

    if (
      routine.value?.goal_id &&
      goalId &&
      String(routine.value.goal_id) !== String(goalId)
    ) {
      router.replace(`/goals/${routine.value.goal_id}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoutine();
});

const handleEdit = () => {
  const targetGoal = goalId || routine.value?.goal_id;

  router.push(`/goals/${targetGoal}/routines/${route.params.id}/edit`);
};

const handleAnalyze = async () => {
  if (!routine.value?.id) return;
  try {
    analyzing.value = true;
    const res = await analyzeRoutine(routine.value.id);
    analyzeResult.value = {
      summary: res.data?.data?.summary || "",
      recommendation: res.data?.data?.recommendation || "",
    };
  } catch (error) {
    console.error("Failed to analyze routine:", error);
  } finally {
    analyzing.value = false;
  }
};
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div v-else-if="routine" class="space-y-6">
      <div class="bg-white rounded-3xl shadow p-8">
        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold">
              {{ routine.name }}
            </h1>

            <p class="text-gray-500 mt-2">
              {{ routine.description }}
            </p>
          </div>

          <div class="px-4 py-2 rounded-full bg-gray-100 text-sm">
            {{ routine.is_ai_generated ? "AI Generated" : "Manual" }}
          </div>

          <div class="flex gap-2">
            <button
              @click="handleAnalyze"
              :disabled="analyzing"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
            >
              {{ analyzing ? "Analyzing..." : "Analyze" }}
            </button>
            <button
              @click="handleEdit"
              class="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div v-if="analyzeResult" class="bg-white rounded-3xl shadow p-6">
        <h2 class="text-2xl font-bold mb-4">AI Analysis</h2>
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Summary</h3>
            <p class="mt-2 text-slate-700">{{ analyzeResult.summary }}</p>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Recommendation</h3>
            <p class="mt-2 text-slate-700">
              {{ analyzeResult.recommendation }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Total Items</p>

          <h3 class="text-3xl font-bold mt-2">
            {{ routine.items.length }}
          </h3>
        </div>

        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Created At</p>

          <h3 class="text-lg font-semibold mt-2">
            {{ new Date(routine.created_at).toLocaleDateString() }}
          </h3>
        </div>

        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Type</p>

          <h3 class="text-lg font-semibold mt-2">
            {{ routine.is_ai_generated ? "AI Routine" : "Manual Routine" }}
          </h3>
        </div>
      </div>
      <div class="bg-white rounded-3xl shadow p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Routine Items</h2>

          <div class="text-sm text-gray-500">Complete your activities</div>
        </div>

        <div class="space-y-4">
          <RoutineItemCard
            v-for="item in routine.items"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
