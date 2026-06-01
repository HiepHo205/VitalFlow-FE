<script setup lang="ts">
import { onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { getNotifications, markNotificationRead } from "@/api/notifications";

const loading = ref(false);
const notifications = ref<any[]>([]);
const error = ref("");

const fetchNotifications = async () => {
  try {
    loading.value = true;
    const res = await getNotifications();
    notifications.value = res.data.data;
  } catch (err) {
    error.value = "Không thể tải thông báo.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const markRead = async (id: string) => {
  try {
    await markNotificationRead(id);
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, is_read: true } : item,
    );
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchNotifications);
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold">Thông báo</h2>
        <p class="text-gray-500 mt-1">Xem và quản lý thông báo hệ thống.</p>
      </div>

      <div v-if="loading" class="bg-white rounded-3xl shadow p-8 text-center">
        Đang tải thông báo...
      </div>

      <div v-else>
        <div v-if="error" class="text-red-600">{{ error }}</div>

        <div
          v-if="!notifications.length"
          class="bg-white rounded-3xl shadow p-8 text-center"
        >
          Không có thông báo nào.
        </div>

        <div class="space-y-4">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="rounded-3xl border border-gray-200 bg-white p-6"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm text-gray-500">
                  {{ notification.created_at }}
                </p>
                <h3 class="text-lg font-semibold">{{ notification.title }}</h3>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs"
                :class="
                  notification.is_read
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-black text-white'
                "
              >
                {{ notification.is_read ? "Đã đọc" : "Mới" }}
              </span>
            </div>

            <p class="mt-4 text-gray-700">{{ notification.message }}</p>

            <button
              v-if="!notification.is_read"
              @click="markRead(notification.id)"
              class="mt-4 rounded-xl bg-black px-4 py-2 text-white"
            >
              Đánh dấu đã đọc
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
