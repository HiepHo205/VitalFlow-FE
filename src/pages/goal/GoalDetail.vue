<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { RouterLink, useRoute } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import RoutineCard from "@/components/routine/RoutineCard.vue";
import RoutineForm from "@/components/routine/RoutineForm.vue";

import { updateGoal } from "@/api/goal";

import { generateRoutine, createRoutine } from "@/api/routine";

import { useDataStore } from "@/stores/data.store";

import type { Goal, UpdateGoalPayload } from "@/types/goal";
import type {
  AiRoutineDraft,
  CreateRoutinePayload,
  Routine,
  RoutineCompletion,
  RoutineFormData,
  RoutineItem,
} from "@/types/routine";

const route = useRoute();

const goalId = route.params.id as string;

const dataStore = useDataStore();

const loading = ref(false);

const goal = ref<Goal | null>(null);

const routines = ref<Routine[]>([]);

const error = ref("");

const aiResult = ref<AiRoutineDraft | null>(null);

const analyzing = ref(false);

const aiError = ref("");

const progressInput = ref(0);
const progressSaving = ref(false);
const progressError = ref("");
const progressSuccess = ref("");

const showAiModal = ref(false);

const creatingRoutine = ref(false);

const completedItemCount = computed(() =>
  routines.value.reduce(
    (count, routine) =>
      count +
      routine.items.reduce(
        (itemCount: number, item: RoutineItem) =>
          itemCount +
          ((item.completions ?? []).some(
            (completion: RoutineCompletion) =>
              completion.status === "completed",
          )
            ? 1
            : 0),
        0,
      ),
    0,
  ),
);

const completedRoutineCount = computed(
  () =>
    routines.value.filter(
      (routine: Routine) =>
        routine.items.length > 0 &&
        routine.items.every((item: RoutineItem) =>
          (item.completions ?? []).some(
            (completion: RoutineCompletion) =>
              completion.status === "completed",
          ),
        ),
    ).length,
);

const goalProgressCount = computed(
  () => completedRoutineCount.value + completedItemCount.value,
);

const allRoutinesCompleted = computed(
  () =>
    routines.value.length > 0 &&
    routines.value.every(
      (routine: Routine) =>
        routine.items.length > 0 &&
        routine.items.every((item: RoutineItem) =>
          (item.completions ?? []).some(
            (completion: RoutineCompletion) =>
              completion.status === "completed",
          ),
        ),
    ),
);

const needsAiAnalysis = computed(
  () =>
    routines.value.length === 0 &&
    goal.value &&
    Number(goal.value.current_value) < Number(goal.value.target_value),
);

const resetProgress = () => {
  if (!goal.value) {
    return;
  }

  progressInput.value = Number(goal.value.current_value ?? 0);
  progressError.value = "";
  progressSuccess.value = "";
};

const adjustProgress = (delta: number) => {
  if (!goal.value) {
    return;
  }

  const current = Number(progressInput.value);
  const target =
    goal.value.target_value !== null ? Number(goal.value.target_value) : null;

  let nextValue = current + delta;
  if (nextValue < 0) {
    nextValue = 0;
  }

  if (target !== null && !Number.isNaN(target) && nextValue > target) {
    nextValue = target;
  }

  progressInput.value = nextValue;
};

const saveGoalProgress = async () => {
  if (!goal.value) {
    return;
  }

  progressError.value = "";
  progressSuccess.value = "";

  try {
    progressSaving.value = true;

    const payload: UpdateGoalPayload = {
      current_value: progressInput.value,
    };

    const res = await updateGoal(goalId, payload);

    goal.value = res.data.data;
    dataStore.updateGoal(res.data.data);
    progressSuccess.value = "Tiến độ goal đã được cập nhật.";
  } catch (err) {
    progressError.value = "Không thể cập nhật tiến độ goal. Vui lòng thử lại.";

    console.error(err);
  } finally {
    progressSaving.value = false;
  }
};

watch(
  goal,
  (value) => {
    if (!value) {
      return;
    }

    progressInput.value = Number(value.current_value ?? 0);
    progressError.value = "";
    progressSuccess.value = "";
  },
  {
    immediate: true,
  },
);

const analyzeGoal = async () => {
  aiError.value = "";

  aiResult.value = null;

  try {
    analyzing.value = true;

    const res = await generateRoutine({
      goal_id: goalId,
    });

    aiResult.value = {
      ...res.data.draft,

      goal_id: goalId,
    };

    showAiModal.value = true;
  } catch (err) {
    aiError.value = "AI không thể phân tích lúc này. Vui lòng thử lại sau.";

    console.error(err);
  } finally {
    analyzing.value = false;
  }
};

const handleCreateRoutine = async (payload: RoutineFormData) => {
  try {
    creatingRoutine.value = true;

    const routinePayload: CreateRoutinePayload = {
      ...payload,

      goal_id: goalId,
    };

    await createRoutine(routinePayload);

    showAiModal.value = false;

    aiResult.value = null;

    await fetchRoutines();
  } catch (error) {
    console.error(error);
  } finally {
    creatingRoutine.value = false;
  }
};

const fetchGoal = async () => {
  try {
    loading.value = true;

    const loaded = await dataStore.loadGoalDetail(goalId);

    goal.value = loaded;
  } catch (err) {
    error.value = "Không thể tải mục tiêu.";

    console.error(err);
  } finally {
    loading.value = false;
  }
};

const fetchRoutines = async () => {
  try {
    await dataStore.loadRoutines(goalId);

    routines.value = dataStore.routinesByGoal(goalId);
  } catch (err) {
    console.error(err);
  }
};

const refresh = async () => {
  await Promise.all([fetchGoal(), fetchRoutines()]);
};

const onDeleted = () => {
  fetchRoutines();
};

onMounted(refresh);
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="text-3xl font-bold">Goal detail</h1>

          <p class="text-gray-500 mt-2">
            Manage routines attached to this goal.
          </p>
        </div>

        <RouterLink
          :to="`/goals/${goalId}/routines/create`"
          class="w-full md:w-auto bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
        >
          Create Routine for Goal
        </RouterLink>
      </div>

      <div v-if="loading" class="bg-white rounded-3xl shadow p-8 text-center">
        Loading...
      </div>

      <div v-else-if="error" class="text-red-600">
        {{ error }}
      </div>

      <div v-else-if="goal" class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 bg-white rounded-3xl shadow p-8">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl font-semibold">
                {{ goal.goal_type }}
              </h2>

              <p class="text-gray-500 mt-2">
                Status:
                {{ goal.status }}
              </p>
            </div>

            <div class="text-right">
              <p class="text-sm text-gray-500">Tiến độ</p>

              <p class="text-3xl font-bold">
                {{ goalProgressCount }}
                completed
              </p>

              <p class="text-sm text-gray-500 mt-2">
                Current:
                {{ goal.current_value }}
                /
                {{ goal.target_value }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl shadow p-8">
          <h3 class="text-xl font-semibold mb-4">Goal summary</h3>

          <p class="text-gray-700">
            Goal này đang ở trạng thái
            {{ goal.status }}.
          </p>

          <div class="mt-6 rounded-3xl border border-gray-200 p-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <h4 class="text-lg font-semibold">Điều chỉnh tiến độ</h4>
                <p class="text-sm text-gray-500">
                  Cập nhật giá trị hiện tại của goal để AI tạo routine phù hợp.
                </p>
              </div>
              <span class="text-sm text-gray-600">
                {{ progressInput }} / {{ goal.target_value ?? "-" }}
              </span>
            </div>

            <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="adjustProgress(-1)"
                  :disabled="progressSaving"
                  class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>

                <input
                  v-model.number="progressInput"
                  type="number"
                  min="0"
                  class="w-full max-w-[140px] rounded-2xl border border-gray-300 px-4 py-2 text-center"
                />

                <button
                  type="button"
                  @click="adjustProgress(1)"
                  :disabled="progressSaving"
                  class="rounded-xl border border-gray-300 bg-white px-4 py-2 text-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                  type="button"
                  @click="saveGoalProgress"
                  :disabled="progressSaving"
                  class="rounded-2xl bg-black px-5 py-3 text-white hover:opacity-90 disabled:opacity-50"
                >
                  {{ progressSaving ? "Đang lưu..." : "Lưu tiến độ" }}
                </button>
                <button
                  type="button"
                  @click="resetProgress"
                  :disabled="progressSaving"
                  class="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </div>

            <p v-if="progressSuccess" class="text-green-600 mt-3 text-sm">
              {{ progressSuccess }}
            </p>
            <p v-if="progressError" class="text-red-600 mt-3 text-sm">
              {{ progressError }}
            </p>
          </div>
        </div>

        <div v-if="needsAiAnalysis" class="bg-yellow-50 rounded-3xl shadow p-8">
          <h3 class="text-xl font-semibold mb-4">AI hỗ trợ tiếp theo</h3>

          <p class="text-gray-700 mb-4">
            Bạn chưa có routine nào cho mục tiêu này. Hãy để AI của chúng tôi
            phân tích và đề xuất một routine phù
          </p>

          <button
            @click="analyzeGoal"
            :disabled="analyzing"
            class="px-4 py-3 bg-black text-white rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            {{ analyzing ? "Đang phân tích..." : "Generate AI Routine" }}
          </button>

          <div v-if="aiError" class="text-red-600 mt-4">
            {{ aiError }}
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <h2 class="text-2xl font-semibold">Routines for this goal</h2>

        <div
          v-if="!routines.length"
          class="bg-white rounded-3xl shadow p-8 text-center"
        >
          No routines attached to this goal yet.
        </div>

        <div v-else class="space-y-4">
          <RoutineCard
            v-for="routine in routines"
            :key="routine.id"
            :routine="routine"
            @deleted="onDeleted"
          />
        </div>
      </div>

      <!-- AI MODAL -->
      <div
        v-if="showAiModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <div
          class="bg-white w-full max-w-4xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">AI Generated Routine</h2>

            <button @click="showAiModal = false" class="text-xl">✕</button>
          </div>

          <RoutineForm
            :loading="creatingRoutine"
            :initialData="aiResult ?? undefined"
            submitText="Create Routine From AI"
            @submit="handleCreateRoutine"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
