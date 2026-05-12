<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import DashboardStats from "@/components/dashboard/DashboardStats.vue";
import RoutineList from "@/components/dashboard/RoutineList.vue";
import AiRecommendation from "@/components/dashboard/AiRecommendation.vue";

import { getRoutines } from "@/api/routine";

const loading = ref(false);

const routines = ref<any[]>([]);

const fetchRoutines = async () => {
  try {
    loading.value = true;

    const res = await getRoutines();

    routines.value = res.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoutines();
});
</script>

<template>
  <DefaultLayout>
    <div
      class="flex items-center justify-between mb-6"
    >
      <div>
        <h2 class="text-3xl font-bold">
          Dashboard
        </h2>

        <p class="text-gray-500 mt-1">
          Track your health, routines and productivity
        </p>
      </div>

      <RouterLink
        to="/create-routine"
        class="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
      >
        + Create Routine
      </RouterLink>
    </div>

    <DashboardStats
      :total-routines="routines.length"
    />

    <RoutineList
      :loading="loading"
      :routines="routines"
    />

    <AiRecommendation />
  </DefaultLayout>
</template>