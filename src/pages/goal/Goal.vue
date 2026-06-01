<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { RouterLink } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import GoalForm from "@/components/goal/GoalForm.vue";

import { useDataStore } from "@/stores/data.store";

import { createGoal, updateGoal, deleteGoal } from "@/api/goal";

import type { Goal, GoalPayload } from "@/types/goal";

const dataStore = useDataStore();

const pageLoading = ref(false);

const formLoading = ref(false);

const goals = computed(() => dataStore.goals);

const editingGoal = ref<Goal | null>(null);

const showModal = ref(false);

const fetchGoals = async () => {
  try {
    pageLoading.value = true;

    await dataStore.loadGoals();
  } catch (error) {
    console.error(error);
  } finally {
    pageLoading.value = false;
  }
};

const openCreateModal = () => {
  editingGoal.value = null;

  showModal.value = true;
};

const openEditModal = (goal: Goal) => {
  editingGoal.value = goal;

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;

  editingGoal.value = null;
};

const handleCreate = async (payload: GoalPayload) => {
  try {
    formLoading.value = true;

    await createGoal(payload);

    closeModal();

    await dataStore.loadGoals(true);
  } catch (error) {
    console.error(error);
  } finally {
    formLoading.value = false;
  }
};

const handleUpdate = async (payload: GoalPayload) => {
  try {
    formLoading.value = true;

    const res = await updateGoal(editingGoal.value!.id, payload);

    dataStore.updateGoal(res.data.data);

    closeModal();

    await dataStore.loadGoals(true);
  } catch (error) {
    console.error(error);
  } finally {
    formLoading.value = false;
  }
};

const handleDelete = async (id: string) => {
  try {
    await deleteGoal(id);

    await dataStore.loadGoals(true);
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchGoals();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Goals</h1>

          <p class="text-gray-500 mt-1">Manage your goals</p>
        </div>

        <button
          @click="openCreateModal"
          class="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
        >
          Create Goal
        </button>
      </div>
      <div v-if="pageLoading" class="flex justify-center py-20">
        <div
          class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
        />
      </div>
      <div
        v-else-if="!goals.length"
        class="bg-white rounded-3xl shadow p-10 text-center"
      >
        <h2 class="text-2xl font-bold">No goals yet</h2>

        <p class="text-gray-500 mt-2">
          Create your first goal to start tracking progress.
        </p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="bg-white rounded-2xl shadow p-5"
        >
          <div
            class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-xl font-bold capitalize">
                {{ goal.goal_type }}
              </h2>

              <p class="text-gray-500 mt-1">
                Progress:
                {{ goal.current_value }}
                /
                {{ goal.target_value }}
              </p>

              <div
                class="mt-3 w-full md:w-72 h-3 bg-gray-200 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-black"
                  :style="{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (Number(goal.current_value) /
                          Number(goal.target_value)) *
                          100,
                      ),
                    )}%`,
                  }"
                />
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <RouterLink
                :to="`/goals/${goal.id}`"
                class="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition"
              >
                View
              </RouterLink>

              <button
                @click="openEditModal(goal)"
                class="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
              >
                Edit
              </button>

              <button
                @click="handleDelete(goal.id)"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <div
          class="relative w-full max-w-2xl bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <button @click="closeModal" class="absolute top-4 right-4 text-xl">
            ✕
          </button>
          <div class="mb-6">
            <h2 class="text-2xl font-bold">
              {{ editingGoal ? "Edit Goal" : "Create Goal" }}
            </h2>

            <p class="text-gray-500 mt-1">
              {{
                editingGoal
                  ? "Update your goal progress"
                  : "Create a new goal to track"
              }}
            </p>
          </div>
          <GoalForm
            :loading="formLoading"
            :initialData="editingGoal"
            @submit="editingGoal ? handleUpdate($event) : handleCreate($event)"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
