<script setup lang="ts">
import { onMounted, ref } from "vue";

import { useRoute, useRouter } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import RoutineForm from "@/components/routine/RoutineForm.vue";

import { getRoutineDetail, updateRoutine } from "@/api/routine";

import type {
  RoutineFormData,
  RoutineItem,
} from "@/types/routine";

const route = useRoute();

const router = useRouter();

const loading = ref(false);

const routine = ref<RoutineFormData | null>(null);

const goalId = route.params.goalId as string | undefined;

const fetchRoutine = async () => {
  try {
    loading.value = true;

    const res = await getRoutineDetail(route.params.id as string);

    const data = res.data.data;

    // if route didn't include a goalId, redirect to nested edit route
    if (data.goal_id && !goalId) {
      router.replace(`/goals/${data.goal_id}/routines/${route.params.id}/edit`);

      return;
    }

    // if routine belongs to different goal, redirect to correct goal
    if (data.goal_id && goalId && String(data.goal_id) !== String(goalId)) {
      router.replace(`/goals/${data.goal_id}`);

      return;
    }

    routine.value = {
      name: data.name,

      description: data.description || "",

      is_ai_generated: data.is_ai_generated,

      items: data.items.map((item: RoutineItem) => ({
        id: item.id,

        title: item.title,

        description: item.description || "",

        category: item.category || "",

        start_time: item.start_time || "",

        end_time: item.end_time || "",

        duration_minutes: item.duration_minutes || 0,

        priority: item.priority,

        recurrence_type: item.recurrence_type,
      })),
    };
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (payload: RoutineFormData) => {
  try {
    loading.value = true;

    await updateRoutine(route.params.id as string, payload);

    // go back to goal detail after update
    if (goalId) {
      router.push(`/goals/${goalId}`);
    } else {
      router.push(`/goals`);
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
</script>

<template>
  <DefaultLayout>
    <div class="max-w-5xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Edit Routine</h1>
      </div>

      <RoutineForm
        v-if="routine"
        :loading="loading"
        :initial-data="routine"
        submit-text="Update Routine"
        @submit="handleSubmit"
      />
    </div>
  </DefaultLayout>
</template>
