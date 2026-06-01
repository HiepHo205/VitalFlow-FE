<script setup lang="ts">
import { onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { getAiFeedbacks } from "@/api/aiFeedback";

const loading = ref(false);
const feedbacks = ref<any[]>([]);
const error = ref("");

const fetchFeedbacks = async () => {
  try {
    loading.value = true;
    const res = await getAiFeedbacks();
    feedbacks.value = res.data.data;
  } catch (err) {
    error.value = "Không thể tải AI insights.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFeedbacks);
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold">AI Insights</h2>
        <p class="text-gray-500 mt-1">
          Xem gợi ý, phân tích và khuyến nghị từ AI.
        </p>
      </div>

      <div v-if="loading" class="bg-white rounded-3xl shadow p-8 text-center">
        Đang tải dữ liệu AI...
      </div>

      <div v-else class="grid gap-6">
        <div v-if="error" class="text-red-600">{{ error }}</div>
        <div
          v-if="!feedbacks.length"
          class="bg-white rounded-3xl shadow p-8 text-center"
        >
          Chưa có AI insights.
        </div>

        <div
          v-for="feedback in feedbacks"
          :key="feedback.id"
          class="bg-white rounded-3xl shadow p-6"
        >
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold">
                {{ feedback.feedback_type }}
              </h3>
              <p class="text-sm text-gray-500">{{ feedback.generated_at }}</p>
            </div>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <h4 class="font-medium">Tóm tắt</h4>
              <p class="text-gray-700 mt-2">{{ feedback.summary }}</p>
            </div>
            <div>
              <h4 class="font-medium">Khuyến nghị</h4>
              <p class="text-gray-700 mt-2">{{ feedback.recommendation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
