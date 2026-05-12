<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import GoalForm from "@/components/goal/GoalForm.vue";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "@/api/goal";

const loading = ref(false);

const goals = ref<any[]>([]);

const editingGoal = ref<any>(null);

const fetchGoals = async () => {
  const res = await getGoals();

  goals.value = res.data.data;
};

const handleCreate = async (
  payload: any
) => {
  await createGoal(payload);

  fetchGoals();
};

const handleUpdate = async (
  payload: any
) => {
  await updateGoal(
    editingGoal.value.id,
    payload
  );

  editingGoal.value = null;

  fetchGoals();
};

const handleDelete = async (
  id: string
) => {
  await deleteGoal(id);

  fetchGoals();
};

onMounted(() => {
  fetchGoals();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <GoalForm
        :loading="loading"
        :initialData="editingGoal"
        @submit="
          editingGoal
            ? handleUpdate($event)
            : handleCreate($event)
        "
      />

      <div class="space-y-4">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="bg-white rounded-2xl shadow p-5"
        >
          <div
            class="flex justify-between"
          >
            <div>
              <h2
                class="text-xl font-bold"
              >
                {{
                  goal.goal_type
                }}
              </h2>

              <p>
                {{
                  goal.current_value
                }}
                /
                {{
                  goal.target_value
                }}
              </p>
            </div>

            <div class="flex gap-2">
              <button
                @click="
                  editingGoal = goal
                "
                class="px-4 py-2 bg-black text-white rounded-lg"
              >
                Edit
              </button>

              <button
                @click="
                  handleDelete(goal.id)
                "
                class="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>