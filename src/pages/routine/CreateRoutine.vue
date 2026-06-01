<script setup lang="ts">
import { ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import RoutineForm from "@/components/routine/RoutineForm.vue";

import { createRoutine } from "@/api/routine";

import type {
  CreateRoutinePayload,
  RoutineFormData,
} from "@/types/routine";

const route = useRoute();
const router = useRouter();

const loading = ref(false);

const goalId = route.params.goalId as string | undefined;

const handleSubmit = async (payload: RoutineFormData) => {
  if (!goalId) {
    router.push("/goals");
    return;
  }

  try {
    loading.value = true;

    const routinePayload: CreateRoutinePayload = {
      ...payload,
      goal_id: goalId,
    };

    await createRoutine(routinePayload);

    router.push(`/goals/${goalId}`);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="max-w-5xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Create Routine</h1>

        <p class="text-gray-500 mt-2">
          Build your productivity and health routine.
        </p>
      </div>

      <RoutineForm
        :loading="loading"
        submit-text="Create Routine"
        @submit="handleSubmit"
      />
    </div>
  </DefaultLayout>
</template>
