<script setup lang="ts">
import { ref } from "vue";

import { useRouter } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import RoutineForm from "@/components/routine/RoutineForm.vue";

import { createRoutine } from "@/api/routine";

const router = useRouter();

const loading = ref(false);

const handleSubmit = async (
  payload: any
) => {
  try {
    loading.value = true;

    await createRoutine(payload);

    router.push("/dashboard");
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
        <h1 class="text-3xl font-bold">
          Create Routine
        </h1>

        <p class="text-gray-500 mt-2">
          Build your productivity and health
          routine.
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