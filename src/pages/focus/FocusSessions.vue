<script setup lang="ts">
import { onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { getFocusSessions } from "@/api/focusSession";

const loading = ref(false);
const sessions = ref<any[]>([]);
const error = ref("");

const fetchSessions = async () => {
  try {
    loading.value = true;
    const res = await getFocusSessions();
    sessions.value = res.data.data;
  } catch (err) {
    error.value = "Không thể tải phiên tập trung.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchSessions);
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold">Phiên tập trung</h2>
        <p class="text-gray-500 mt-1">
          Xem thông tin các phiên làm việc tập trung gần nhất.
        </p>
      </div>

      <div v-if="loading" class="bg-white rounded-3xl shadow p-8 text-center">
        Đang tải phiên tập trung...
      </div>

      <div v-else>
        <div v-if="error" class="text-red-600">{{ error }}</div>

        <div
          v-if="!sessions.length"
          class="bg-white rounded-3xl shadow p-8 text-center"
        >
          Chưa có phiên tập trung nào.
        </div>

        <div class="space-y-4">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="rounded-3xl border border-gray-200 bg-white p-6"
          >
            <div
              class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 class="text-xl font-semibold">
                  {{ session.task_name || "Không có tên nhiệm vụ" }}
                </h3>
                <p class="text-sm text-gray-500">
                  Bắt đầu: {{ session.started_at }}
                </p>
              </div>
              <div
                class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
              >
                {{ session.duration_minutes }} phút
              </div>
            </div>

            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl bg-gray-50 p-4">
                <p class="text-sm text-gray-500">Kết thúc</p>
                <p class="mt-2 text-lg font-semibold">{{ session.ended_at }}</p>
              </div>
              <div class="rounded-2xl bg-gray-50 p-4">
                <p class="text-sm text-gray-500">Số lần phân tâm</p>
                <p class="mt-2 text-lg font-semibold">
                  {{ session.distraction_count }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
