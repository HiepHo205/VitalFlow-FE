<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import DashboardStats from "@/components/dashboard/DashboardStats.vue";

import AiRecommendation from "@/components/dashboard/AiRecommendation.vue";

import GoalList from "@/components/goal/GoalList.vue";

import DailySchedule from "@/components/routine/DailySchedule.vue";

import DailyLogForm from "@/components/daily-log/DailyLogForm.vue";

import { createDailyLog } from "@/api/dailyLog";
import { updateGoal } from "@/api/goal";

import { useDataStore } from "@/stores/data.store";

const dataStore = useDataStore();

const loading = ref(false);

const goalLoading = ref(false);

const promptSaving = ref(false);

const promptError = ref("");

const promptSuccess = ref("");

const showDailyLogModal = ref(false);

const goalSavingIds = ref<string[]>([]);

const routines = computed(() => dataStore.routines);

const goals = computed(() => dataStore.goals);

const dailyLogs = computed(() => dataStore.dailyLogs);

const today = new Date();

const todayDate = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const fetchRoutines = async () => {
  try {
    loading.value = true;

    await dataStore.loadRoutines();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchGoals = async () => {
  try {
    goalLoading.value = true;

    await dataStore.loadGoals();
  } catch (error) {
    console.error(error);
  } finally {
    goalLoading.value = false;
  }
};

const fetchDailyLogs = async () => {
  try {
    await dataStore.loadDailyLogs();
  } catch (error) {
    console.error(error);
  }
};

const submitDailyCheckin = async (payload: any) => {
  promptError.value = "";

  promptSuccess.value = "";

  try {
    promptSaving.value = true;

    await createDailyLog(payload);

    promptSuccess.value = "Today's check-in saved successfully.";

    showDailyLogModal.value = false;

    await fetchDailyLogs();
  } catch (error) {
    promptError.value = "Failed to save today's check-in.";

    console.error(error);
  } finally {
    promptSaving.value = false;
  }
};

onMounted(() => {
  fetchRoutines();

  fetchGoals();

  fetchDailyLogs();
});

const handleGoalProgressUpdate = async (
  goalId: string,
  currentValue: number,
) => {
  try {
    goalSavingIds.value.push(goalId);

    const res = await updateGoal(goalId, {
      current_value: currentValue,
    });

    dataStore.updateGoal(res.data.data);
  } catch (error) {
    console.error("Unable to update goal progress", error);
  } finally {
    goalSavingIds.value = goalSavingIds.value.filter((id) => id !== goalId);
  }
};

const todayLog = computed(() =>
  dailyLogs.value.find((log: any) => log.log_date === todayDate),
);

const totalTasks = computed(() => {
  return routines.value.reduce(
    (total, routine) => total + routine.items.length,
    0,
  );
});

const completedTasks = computed(() => {
  return routines.value.reduce(
    (total, routine) =>
      total +
      routine.items.filter((item: any) =>
        item.completions?.some(
          (completion: any) => completion.status === "completed",
        ),
      ).length,
    0,
  );
});

const completionRate = computed(() => {
  if (!totalTasks.value) {
    return 0;
  }

  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

const averageEnergy = computed(() => {
  if (!dailyLogs.value.length) {
    return 0;
  }

  const total = dailyLogs.value.reduce(
    (sum: number, log: any) => sum + Number(log.energy_level),
    0,
  );

  return Math.round((total / dailyLogs.value.length) * 10);
});

const averageSleep = computed(() => {
  if (!dailyLogs.value.length) {
    return 0;
  }

  const total = dailyLogs.value.reduce(
    (sum: number, log: any) => sum + Number(log.sleep_hours),
    0,
  );

  return Math.round((total / dailyLogs.value.length) * 10) / 10;
});

const latestRecommendation = computed(() => {
  const latest = dailyLogs.value[0];

  if (!latest) {
    return "No AI recommendation yet.";
  }

  if (latest.stress_level !== null && latest.stress_level >= 7) {
    return "Your stress level is high recently. Consider reducing workload and taking short breaks.";
  }

  if (latest.sleep_hours !== null && latest.sleep_hours < 6) {
    return "Your sleep quality is low. Try sleeping earlier and reducing screen time.";
  }

  if (latest.energy_level !== null && latest.energy_level <= 4) {
    return "Your energy level is low. Hydration and light exercise may help.";
  }

  return "Your current health indicators look stable. Keep maintaining your routine.";
});
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-8">
      <!-- HEADER -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold">Dashboard</h1>

          <p class="text-gray-500 mt-2">
            Monitor your routines, health and productivity
          </p>
        </div>

        <button
          v-if="!todayLog"
          @click="showDailyLogModal = true"
          class="bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition"
        >
          Daily Check-in
        </button>
      </div>

      <!-- ALREADY CHECKED -->
      <div
        v-if="todayLog"
        class="bg-green-50 border border-green-200 rounded-3xl p-6"
      >
        <h3 class="text-2xl font-bold text-green-700">
          Daily Check-in Completed
        </h3>

        <p class="text-green-600 mt-2">
          You've already submitted today's daily log.
        </p>
      </div>

      <!-- STATS -->
      <DashboardStats
        :total-routines="routines.length"
        :completed-tasks="completedTasks"
        :total-tasks="totalTasks"
        :average-energy="averageEnergy"
        :average-sleep="averageSleep"
      />

      <!-- INSIGHT -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-3xl shadow p-6">
          <h3 class="text-xl font-bold">Completion Rate</h3>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-500"> Today's Progress </span>

              <span class="font-semibold"> {{ completionRate }}% </span>
            </div>

            <div class="h-4 rounded-full bg-gray-100 overflow-hidden">
              <div
                class="h-full bg-black transition-all"
                :style="{
                  width: `${completionRate}%`,
                }"
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl shadow p-6">
          <h3 class="text-xl font-bold">AI Insight</h3>

          <p class="text-gray-600 mt-5 leading-7">
            {{ latestRecommendation }}
          </p>
        </div>
      </div>

      <!-- GOALS -->
      <GoalList
        :goals="goals"
        :loading="goalLoading"
        :saving-ids="goalSavingIds"
        @update-goal="handleGoalProgressUpdate"
      />

      <!-- DAILY SCHEDULE -->
      <DailySchedule :routines="routines" />

      <!-- AI -->
      <AiRecommendation />

      <!-- MODAL -->
      <div
        v-if="showDailyLogModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      >
        <div
          class="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8"
        >
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-3xl font-bold">Daily Check-in</h2>

              <p class="text-gray-500 mt-2">Record your current condition</p>
            </div>

            <button
              @click="showDailyLogModal = false"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div class="mb-4">
            <p v-if="promptSuccess" class="text-green-600 text-sm">
              {{ promptSuccess }}
            </p>

            <p v-if="promptError" class="text-red-600 text-sm">
              {{ promptError }}
            </p>
          </div>

          <DailyLogForm
            :loading="promptSaving"
            :default-date="todayDate"
            @submit="submitDailyCheckin"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
