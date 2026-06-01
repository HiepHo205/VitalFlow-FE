<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { getLogsAnalysis } from "@/api/ai";
import { getAiFeedbacks } from "@/api/aiFeedback";
import { useDataStore } from "@/stores/data.store";

const dataStore = useDataStore();

const loading = ref(false);
const dailyLogs = computed(() => dataStore.dailyLogs);
const error = ref("");

const fetchLogs = async () => {
  try {
    loading.value = true;
    await dataStore.loadDailyLogs();
  } catch (err) {
    error.value = "Không thể tải nhật ký hàng ngày.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const summaryStats = computed(() => {
  const items = dailyLogs.value;
  if (!items.length) {
    return {
      count: 0,
      avgMood: 0,
      avgEnergy: 0,
      avgSleep: 0,
      avgBurnout: 0,
    };
  }

  const count = items.length;
  const avgMood =
    items.reduce((sum, log) => sum + Number(log.mood_score || 0), 0) / count;
  const avgEnergy =
    items.reduce((sum, log) => sum + Number(log.energy_level || 0), 0) / count;
  const avgSleep =
    items.reduce((sum, log) => sum + Number(log.sleep_hours || 0), 0) / count;
  const avgStress =
    items.reduce((sum, log) => sum + Number(log.stress_level || 0), 0) / count;

  const wellness =
    (avgMood / 10) * 35 +
    (avgEnergy / 10) * 35 +
    (Math.min(avgSleep, 9) / 9) * 20 +
    ((10 - avgStress) / 10) * 10;
  const avgBurnout = Math.max(0, Math.min(100, 100 - wellness));

  return {
    count,
    avgMood: Number(avgMood.toFixed(1)),
    avgEnergy: Number(avgEnergy.toFixed(1)),
    avgSleep: Number(avgSleep.toFixed(1)),
    avgBurnout: Number(avgBurnout.toFixed(1)),
  };
});

const sortedLogs = computed(() => {
  return [...dailyLogs.value].sort((a, b) => {
    const aDate = a.log_date?.split("T")[0] ?? "";
    const bDate = b.log_date?.split("T")[0] ?? "";
    return aDate.localeCompare(bDate);
  });
});

const formatDateLabel = (dateString?: string) => {
  const date = dateString?.split("T")[0] ?? "";
  return date ? date.slice(5).replace("-", "/") : "";
};

const chartMetrics = computed(() => {
  const logs = sortedLogs.value;
  if (!logs.length) return [];

  const buildMetric = (
    id: string,
    name: string,
    key: "mood_score" | "energy_level" | "stress_level" | "sleep_hours",
    max: number,
    gradientId: string,
    colorFrom: string,
    colorTo: string,
  ) => {
    const values = logs.map((log) => Number(log[key] ?? 0));
    const points = values.map((value, index) => {
      const x = logs.length === 1 ? 50 : 10 + (index * 80) / (logs.length - 1);
      const y = 95 - (Math.min(value, max) / max) * 80;
      return { x, y };
    });
    const pointsString = points
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
    let areaPath = "";

    if (points.length) {
      const firstPoint = points[0]!;
      const lastPoint = points[points.length - 1]!;
      areaPath = `M ${firstPoint.x},100 ${points
        .map((point) => `L ${point.x},${point.y}`)
        .join(" ")} L ${lastPoint.x},100 Z`;
    }

    return {
      id,
      name,
      values,
      labels: logs.map((log) => formatDateLabel(log.log_date)),
      points,
      pointsString,
      areaPath,
      max,
      min: Math.min(...values),
      maxValue: Math.max(...values),
      latest: values[values.length - 1] ?? 0,
      gradientId,
      colorFrom,
      colorTo,
    };
  };

  return [
    buildMetric(
      "mood",
      "Tâm trạng",
      "mood_score",
      10,
      "moodGradient",
      "#0ea5e9",
      "#22d3ee",
    ),
    buildMetric(
      "energy",
      "Năng lượng",
      "energy_level",
      10,
      "energyGradient",
      "#16a34a",
      "#4ade80",
    ),
    buildMetric(
      "sleep",
      "Giấc ngủ",
      "sleep_hours",
      12,
      "sleepGradient",
      "#8b5cf6",
      "#f472b6",
    ),
  ];
});

const chartInsights = ref<any[]>([]);

const fetchInsights = async () => {
  try {
    const res = await getLogsAnalysis();
    chartInsights.value = res.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch AI insights", err);
  }
};

const aiFeedbacks = ref<any[]>([]);
const fetchAiFeedbacks = async () => {
  try {
    const res = await getAiFeedbacks();
    aiFeedbacks.value = res.data?.data?.data || res.data?.data || [];
  } catch (err) {
    console.error("Failed to fetch ai feedbacks", err);
  }
};

onMounted(async () => {
  await fetchLogs();
  await fetchInsights();
  await fetchAiFeedbacks();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold">Báo cáo hàng tuần</h2>
        <p class="text-gray-500 mt-1">
          Xem điểm số, xu hướng và rủi ro mệt mỏi theo tuần.
        </p>
      </div>

      <div class="grid gap-4 xl:grid-cols-[2fr_360px]">
        <div class="grid gap-4">
          <div class="rounded-2xl bg-white p-3 shadow-sm">
            <div>
              <p class="text-xs text-gray-500 leading-tight">
                Thống kê toàn bộ daily log. Không cần chọn ngày.
              </p>
              <p class="mt-1 text-sm text-gray-600 leading-tight">
                Dữ liệu được tổng hợp từ tất cả các ngày bạn đã log.
              </p>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-3xl bg-white p-4 shadow">
              <p class="text-sm text-gray-500">Số ngày đã log</p>
              <p class="mt-2 text-2xl font-semibold">
                {{ summaryStats.count }}
              </p>
              <p class="text-xs text-gray-400 mt-1">Ngày</p>
            </div>
            <div class="rounded-3xl bg-white p-4 shadow">
              <p class="text-sm text-gray-500">Tâm trạng TB</p>
              <p class="mt-2 text-2xl font-semibold">
                {{ summaryStats.avgMood }}
              </p>
            </div>
            <div class="rounded-3xl bg-white p-4 shadow">
              <p class="text-sm text-gray-500">Năng lượng TB</p>
              <p class="mt-2 text-2xl font-semibold">
                {{ summaryStats.avgEnergy }}
              </p>
            </div>
            <div class="rounded-3xl bg-white p-4 shadow">
              <p class="text-sm text-gray-500">Giấc ngủ TB</p>
              <p class="mt-2 text-2xl font-semibold">
                {{ summaryStats.avgSleep }}
              </p>
            </div>
          </div>

          <div class="rounded-3xl bg-white p-6 shadow">
            <div
              class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <h3 class="text-xl font-semibold">Biểu đồ xu hướng</h3>
                <p class="text-sm text-gray-500 mt-1">
                  Dữ liệu toàn bộ daily log, thể hiện trend ngày qua ngày.
                </p>
              </div>
              <div
                class="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700"
              >
                {{ summaryStats.count }} ngày log
              </div>
            </div>

            <div v-if="!chartMetrics.length" class="mt-6 text-gray-500">
              Chưa có dữ liệu biểu đồ.
            </div>

            <div v-else class="mt-6 space-y-6">
              <div
                class="rounded-[2rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div
                  class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p class="text-sm font-medium text-slate-700">
                      Xu hướng tổng hợp
                    </p>
                    <p class="mt-2 text-slate-500">
                      So sánh tâm trạng, năng lượng và giấc ngủ trong một biểu
                      đồ.
                    </p>
                  </div>
                  <div class="grid gap-2 sm:grid-cols-3">
                    <div
                      class="rounded-2xl bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      Mood: {{ chartMetrics[0]?.latest ?? 0 }}/10
                    </div>
                    <div
                      class="rounded-2xl bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      Energy: {{ chartMetrics[1]?.latest ?? 0 }}/10
                    </div>
                    <div
                      class="rounded-2xl bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm"
                    >
                      Sleep: {{ chartMetrics[2]?.latest ?? 0 }}/12
                    </div>
                  </div>
                </div>

                <div
                  class="mt-5 overflow-hidden rounded-[1.75rem] bg-white p-4 shadow-inner"
                >
                  <svg viewBox="0 0 100 140" class="h-72 w-full">
                    <defs>
                      <linearGradient
                        id="moodGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stop-color="#0ea5e9" />
                        <stop offset="100%" stop-color="#22d3ee" />
                      </linearGradient>
                      <linearGradient
                        id="energyGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stop-color="#16a34a" />
                        <stop offset="100%" stop-color="#4ade80" />
                      </linearGradient>
                      <linearGradient
                        id="sleepGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stop-color="#8b5cf6" />
                        <stop offset="100%" stop-color="#f472b6" />
                      </linearGradient>
                    </defs>

                    <g v-for="metric in chartMetrics" :key="metric.id">
                      <path
                        :d="metric.areaPath"
                        :fill="`url(#${metric.gradientId})`"
                        opacity="0.12"
                      />
                      <polyline
                        :points="metric.pointsString"
                        fill="none"
                        :stroke="metric.colorFrom"
                        stroke-width="2.4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>

                    <g
                      v-for="(label, index) in chartMetrics[0]?.labels || []"
                      :key="index"
                    >
                      <line
                        :x1="(chartMetrics[0]?.points[index] || { x: 0 }).x"
                        :x2="(chartMetrics[0]?.points[index] || { x: 0 }).x"
                        y1="100"
                        y2="103"
                        stroke="#cbd5e1"
                        stroke-width="0.7"
                      />
                      <text
                        :x="(chartMetrics[0]?.points[index] || { x: 0 }).x"
                        y="112"
                        text-anchor="middle"
                        font-size="4.5"
                        fill="#64748b"
                      >
                        {{ label }}
                      </text>
                    </g>
                  </svg>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-3 items-stretch">
                  <div
                    v-for="ins in chartInsights"
                    :key="ins.id"
                    class="rounded-2xl bg-white p-3 border flex flex-col justify-between"
                  >
                    <div>
                      <p class="text-sm font-medium text-slate-700">
                        {{ ins.name }}
                      </p>
                      <p class="mt-1 text-sm text-slate-900 font-semibold">
                        {{ ins.trend }} — {{ ins.delta }} ({{ ins.pct }}%)
                      </p>
                    </div>
                    <p class="mt-2 text-xs text-slate-500">{{ ins.tip }}</p>
                  </div>
                </div>

                <div class="mt-5 grid gap-3 sm:grid-cols-3">
                  <div
                    class="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3"
                  >
                    <span class="h-3 w-3 rounded-full bg-sky-500"></span>
                    <span class="text-sm text-slate-700">Tâm trạng</span>
                  </div>
                  <div
                    class="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3"
                  >
                    <span class="h-3 w-3 rounded-full bg-emerald-500"></span>
                    <span class="text-sm text-slate-700">Năng lượng</span>
                  </div>
                  <div
                    class="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3"
                  >
                    <span class="h-3 w-3 rounded-full bg-violet-500"></span>
                    <span class="text-sm text-slate-700">Giấc ngủ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="rounded-3xl bg-white p-4 shadow">
            <h3 class="text-xl font-semibold">Tổng quan báo cáo</h3>
            <p class="text-gray-500 mt-2">
              Thống kê toàn bộ daily log hiện có.
            </p>

            <div class="mt-6 grid gap-4">
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-sm text-gray-500">Burnout ước tính</p>
                <p class="text-3xl font-semibold mt-2">
                  {{ summaryStats.avgBurnout }}
                </p>
              </div>
              <div class="rounded-2xl bg-slate-50 p-4">
                <p class="text-sm text-gray-500">Số ngày log</p>
                <p class="mt-2 text-2xl font-semibold">
                  {{ summaryStats.count }}
                </p>
              </div>
            </div>
          </div>
          <div class="rounded-3xl bg-white p-4 shadow">
            <h3 class="text-xl font-semibold">AI Feedback</h3>
            <p class="text-gray-500 mt-2">
              Phản hồi do AI sinh và lưu cho người dùng.
            </p>

            <div class="mt-4">
              <div v-if="!aiFeedbacks.length" class="text-gray-500">
                Chưa có phản hồi AI.
              </div>
              <div v-else class="max-h-56 overflow-y-auto space-y-3">
                <div
                  v-for="fb in aiFeedbacks"
                  :key="fb.id"
                  class="rounded-2xl bg-slate-50 p-2 border"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-800">
                        {{ (fb.feedback_type || "").replace("_", " ") }}
                      </p>
                      <p class="mt-1 text-sm text-slate-700 line-clamp-3">
                        {{ fb.summary }}
                      </p>
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ fb.generated_at?.split("T")[0] }}
                    </div>
                  </div>
                  <div class="mt-2 text-xs text-slate-500 line-clamp-3">
                    {{ fb.recommendation }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-3xl bg-white p-6 shadow">
            <h3 class="text-xl font-semibold">Chi tiết daily log</h3>
            <div v-if="!dailyLogs.length" class="text-gray-500">
              Chưa có nhật ký nào.
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="log in dailyLogs"
                :key="log.id"
                class="rounded-3xl border border-gray-200 bg-slate-50 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-semibold">
                      {{ log.log_date?.split("T")[0] }}
                    </p>
                    <p class="text-sm text-gray-500">
                      Cập nhật:
                      {{
                        log.created_at?.split("T")[0] ??
                        log.log_date?.split("T")[0]
                      }}
                    </p>
                  </div>
                  <span
                    class="rounded-full bg-white px-3 py-1 text-xs text-gray-700"
                  >
                    Stress: {{ log.stress_level ?? "N/A" }}/10
                  </span>
                </div>
                <div class="mt-4 grid gap-4 sm:grid-cols-3">
                  <div class="rounded-2xl bg-white p-4">
                    <p class="text-sm text-gray-500">Mood</p>
                    <p class="mt-2 text-2xl font-semibold">
                      {{ log.mood_score ?? "-" }}
                    </p>
                  </div>
                  <div class="rounded-2xl bg-white p-4">
                    <p class="text-sm text-gray-500">Energy</p>
                    <p class="mt-2 text-2xl font-semibold">
                      {{ log.energy_level ?? "-" }}
                    </p>
                  </div>
                  <div class="rounded-2xl bg-white p-4">
                    <p class="text-sm text-gray-500">Sleep</p>
                    <p class="mt-2 text-2xl font-semibold">
                      {{ log.sleep_hours ?? "-" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
