<script setup lang="ts">
import { onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { getUserSettings, updateUserSettings } from "@/api/userSettings";

const loading = ref(false);
const saving = ref(false);
const timezone = ref("UTC");
const notificationEnabled = ref(false);
const error = ref("");

const fetchSettings = async () => {
  try {
    loading.value = true;
    const res = await getUserSettings();
    timezone.value = res.data.data.timezone ?? "UTC";
    notificationEnabled.value = res.data.data.notification_enabled ?? false;
  } catch (err) {
    error.value = "Không thể tải cài đặt. Vui lòng thử lại.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  try {
    saving.value = true;
    await updateUserSettings({
      timezone: timezone.value,
      notification_enabled: notificationEnabled.value,
    });
    error.value = "Cài đặt đã được lưu.";
  } catch (err) {
    error.value = "Lưu cài đặt thất bại.";
    console.error(err);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-bold">Cài đặt người dùng</h2>
          <p class="text-gray-500 mt-1">
            Quản lý thông tin thông báo và múi giờ.
          </p>
        </div>
      </div>

      <div class="bg-white rounded-3xl shadow p-8">
        <div v-if="loading" class="text-center py-16">Đang tải cài đặt...</div>

        <div v-else>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Múi giờ</label
              >
              <input
                v-model="timezone"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
                placeholder="Asia/Ho_Chi_Minh"
              />
            </div>

            <div class="flex items-center gap-3">
              <input
                id="notificationEnabled"
                type="checkbox"
                v-model="notificationEnabled"
                class="h-5 w-5 text-black border-gray-300 rounded"
              />
              <label for="notificationEnabled" class="text-sm text-gray-700">
                Nhận thông báo trong ứng dụng
              </label>
            </div>

            <div class="text-sm text-red-600" v-if="error">{{ error }}</div>

            <button
              @click="saveSettings"
              :disabled="saving"
              class="mt-4 bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {{ saving ? "Đang lưu..." : "Lưu cài đặt" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
