<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import DailyLogForm from "@/components/daily-log/DailyLogForm.vue";
import DailyLogCalendar from "@/components/daily-log/DailyLogCalendar.vue";

import { createDailyLog, updateDailyLog, deleteDailyLog } from "@/api/dailyLog";
import { useDataStore } from "@/stores/data.store";

const dataStore = useDataStore();

const loading = ref(false);

const submitLoading = ref(false);

const logs = computed(() => dataStore.dailyLogs);

const selectedLog = ref<any>(null);

const editingLog = ref<any>(null);

const showFormModal = ref(false);

const showDetailModal = ref(false);

const currentDate = new Date();

const currentMonth = ref(currentDate.getMonth());

const currentYear = ref(currentDate.getFullYear());

const todayDate = new Date().toISOString().split("T")[0];

const todayLog = computed(() =>
  logs.value.find((log: any) => log.log_date?.split("T")[0] === todayDate),
);

const fetchLogs = async () => {
  try {
    loading.value = true;

    await dataStore.loadDailyLogs();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  if (todayLog.value) {
    return;
  }

  editingLog.value = null;

  showFormModal.value = true;
};

const openEditModal = (log: any) => {
  editingLog.value = {
    ...log,
  };

  showDetailModal.value = false;

  showFormModal.value = true;
};

const closeFormModal = () => {
  showFormModal.value = false;

  editingLog.value = null;
};

const closeDetailModal = () => {
  showDetailModal.value = false;

  selectedLog.value = null;
};

const handleCreate = async (payload: any) => {
  try {
    submitLoading.value = true;

    await createDailyLog(payload);

    await dataStore.loadDailyLogs(true);

    closeFormModal();
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

const handleUpdate = async (payload: any) => {
  try {
    submitLoading.value = true;

    await updateDailyLog(editingLog.value.id, payload);

    await dataStore.loadDailyLogs(true);

    closeFormModal();
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

const handleDelete = async (id: string) => {
  const confirmed = confirm("Delete this daily log?");

  if (!confirmed) {
    return;
  }

  try {
    loading.value = true;

    await deleteDailyLog(id);

    closeDetailModal();

    await dataStore.loadDailyLogs(true);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleSelectDate = (date: string) => {
  const found = logs.value.find(
    (log: any) => log.log_date?.split("T")[0] === date,
  );

  if (!found) {
    return;
  }

  selectedLog.value = found;

  showDetailModal.value = true;
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;

    currentYear.value--;

    return;
  }

  currentMonth.value--;
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;

    currentYear.value++;

    return;
  }

  currentMonth.value++;
};

onMounted(() => {
  fetchLogs();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">Daily Logs</h1>

          <p class="text-gray-500 mt-1">
            Track your health and daily condition
          </p>
        </div>

        <button
          @click="openCreateModal"
          :disabled="!!todayLog"
          class="bg-black text-white px-5 py-3 rounded-xl disabled:opacity-50"
        >
          {{ todayLog ? "Today's Log Already Created" : "Create Daily Log" }}
        </button>
      </div>

      <div class="bg-white rounded-3xl shadow p-5">
        <div class="flex items-center justify-between mb-5">
          <button @click="previousMonth" class="border rounded-lg px-3 py-2">
            Prev
          </button>

          <h2 class="text-lg font-semibold">
            {{
              new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            }}
          </h2>

          <button @click="nextMonth" class="border rounded-lg px-3 py-2">
            Next
          </button>
        </div>

        <DailyLogCalendar
          :logs="logs"
          :month="currentMonth"
          :year="currentYear"
          @select="handleSelectDate"
        />
      </div>
      <div
        v-if="showFormModal"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <div class="bg-white w-full max-w-2xl rounded-3xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold">
              {{ editingLog ? "Edit Daily Log" : "Create Daily Log" }}
            </h2>

            <button @click="closeFormModal" class="text-xl">✕</button>
          </div>

          <DailyLogForm
            :loading="submitLoading"
            :initialData="editingLog"
            @submit="editingLog ? handleUpdate($event) : handleCreate($event)"
          />
        </div>
      </div>
      <div
        v-if="showDetailModal && selectedLog"
        class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <div class="bg-white w-full max-w-4xl rounded-3xl p-6">
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-2xl font-bold">
                {{ selectedLog.log_date }}
              </h2>

              <p class="text-gray-500 mt-2">Daily condition overview</p>
            </div>

            <div class="flex gap-3">
              <button
                @click="openEditModal(selectedLog)"
                class="bg-black text-white px-4 py-2 rounded-xl"
              >
                Edit
              </button>

              <button
                @click="handleDelete(selectedLog.id)"
                class="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Delete
              </button>

              <button
                @click="closeDetailModal"
                class="border px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            <div class="border rounded-2xl p-4">
              <p class="text-sm text-gray-500">Mood</p>

              <h3 class="text-2xl font-bold mt-2">
                {{ selectedLog.mood_score }}/10
              </h3>
            </div>

            <div class="border rounded-2xl p-4">
              <p class="text-sm text-gray-500">Energy</p>

              <h3 class="text-2xl font-bold mt-2">
                {{ selectedLog.energy_level }}/10
              </h3>
            </div>

            <div class="border rounded-2xl p-4">
              <p class="text-sm text-gray-500">Stress</p>

              <h3 class="text-2xl font-bold mt-2">
                {{ selectedLog.stress_level }}/10
              </h3>
            </div>
          </div>

          <div class="mt-6 border rounded-2xl p-5">
            <p class="text-sm text-gray-500 mb-3">Body Condition</p>

            <p>
              {{ selectedLog.body_condition || "No note" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
