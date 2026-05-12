<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import DailyLogForm from "@/components/daily-log/DailyLogForm.vue";

import {
  getDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog,
} from "@/api/dailyLog";

const loading = ref(false);

const logs = ref<any[]>([]);

const editingLog = ref<any>(null);

const fetchLogs = async () => {
  try {
    loading.value = true;

    const res =
      await getDailyLogs();

    logs.value =
      res.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleCreate = async (
  payload: any
) => {
  await createDailyLog(payload);

  fetchLogs();
};

const handleUpdate = async (
  payload: any
) => {
  await updateDailyLog(
    editingLog.value.id,
    payload
  );

  editingLog.value = null;

  fetchLogs();
};

const handleDelete = async (
  id: string
) => {
  await deleteDailyLog(id);

  fetchLogs();
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h1
          class="text-3xl font-bold"
        >
          Daily Logs
        </h1>

        <p class="text-gray-500 mt-1">
          Track your daily condition and productivity
        </p>
      </div>

      <div
        class="bg-white rounded-3xl shadow p-6"
      >
        <DailyLogForm
          :loading="loading"
          :initialData="
            editingLog
          "
          @submit="
            editingLog
              ? handleUpdate($event)
              : handleCreate($event)
          "
        />
      </div>

      <div class="space-y-4">
        <div
          v-for="log in logs"
          :key="log.id"
          class="bg-white rounded-2xl shadow p-5"
        >
          <div
            class="flex items-start justify-between"
          >
            <div>
              <h2
                class="text-xl font-bold"
              >
                {{
                  log.log_date
                }}
              </h2>

              <div
                class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
              >
                <p>
                  Mood:
                  {{
                    log.mood_score
                  }}
                </p>

                <p>
                  Energy:
                  {{
                    log.energy_level
                  }}
                </p>

                <p>
                  Stress:
                  {{
                    log.stress_level
                  }}
                </p>

                <p>
                  Sleep:
                  {{
                    log.sleep_hours
                  }}h
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                @click="
                  editingLog = log
                "
                class="px-4 py-2 bg-black text-white rounded-lg"
              >
                Edit
              </button>

              <button
                @click="
                  handleDelete(
                    log.id
                  )
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