<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import {
  useRoute,
  useRouter,
} from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import RoutineForm from "@/components/routine/RoutineForm.vue";

import {
  getRoutineDetail,
  updateRoutine,
} from "@/api/routine";

const route = useRoute();

const router = useRouter();

const loading = ref(false);

const routine = ref(null);

const fetchRoutine = async () => {
  try {
    loading.value = true;

    const res =
      await getRoutineDetail(
        route.params.id as string
      );

    routine.value = res.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async (
  payload: any
) => {
  try {
    loading.value = true;

    await updateRoutine(
      route.params.id as string,
      payload
    );

    router.push(
      `/routine/${route.params.id}`
    );
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
        <h1 class="text-3xl font-bold">
          Edit Routine
        </h1>
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