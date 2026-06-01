<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import { useAuthStore } from "@/stores/auth.store";
import { updateHealthProfile } from "@/api/health";

const auth = useAuthStore();

const loading = ref(false);
const saving = ref(false);
const editMode = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const user = computed(() => auth.user);

const healthProfile = computed(() => user.value?.health_profile);

const settings = computed(() => user.value?.settings);

const form = ref({
  age: 0,
  gender: "",
  height_cm: 0,
  weight_kg: 0,
  work_type: "",
  baseline_sleep_hours: 0,
  baseline_stress_level: 0,
});

watch(user, (value) => {
  if (value?.health_profile) {
    form.value = {
      age: value.health_profile.age ?? 0,
      gender: value.health_profile.gender ?? "",
      height_cm: value.health_profile.height_cm ?? 0,
      weight_kg: value.health_profile.weight_kg ?? 0,
      work_type: value.health_profile.work_type ?? "",
      baseline_sleep_hours: value.health_profile.baseline_sleep_hours ?? 0,
      baseline_stress_level: value.health_profile.baseline_stress_level ?? 0,
    };
  }
});

const fetchProfile = async () => {
  try {
    loading.value = true;
    await auth.fetchMe();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveHealthProfile = async () => {
  try {
    saving.value = true;
    successMessage.value = "";
    errorMessage.value = "";

    await updateHealthProfile({
      age: form.value.age,
      gender: form.value.gender,
      height_cm: form.value.height_cm,
      weight_kg: form.value.weight_kg,
      work_type: form.value.work_type,
      baseline_sleep_hours: form.value.baseline_sleep_hours,
      baseline_stress_level: form.value.baseline_stress_level,
    });

    await auth.fetchMe();
    successMessage.value = "Thông tin sức khỏe đã được cập nhật.";
    editMode.value = false;
  } catch (error) {
    errorMessage.value = "Cập nhật thất bại, vui lòng thử lại.";
    console.error(error);
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  fetchProfile();
});

const bmi = computed(() => {
  if (!healthProfile.value?.height_cm || !healthProfile.value?.weight_kg) {
    return null;
  }

  const height = Number(healthProfile.value.height_cm) / 100;

  const weight = Number(healthProfile.value.weight_kg);

  return (weight / (height * height)).toFixed(1);
});
</script>

<template>
  <DefaultLayout>
    <div v-if="loading" class="flex justify-center py-20">
      <div
        class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div v-else-if="user" class="space-y-6">
      <div class="bg-white rounded-3xl shadow p-8">
        <div class="flex flex-col md:flex-row md:items-center gap-6">
          <div
            class="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold"
          >
            {{ user.full_name.charAt(0) }}
          </div>

          <div class="flex-1">
            <h2 class="text-3xl font-bold">
              {{ user.full_name }}
            </h2>

            <p class="text-gray-500 mt-1">
              {{ user.email }}
            </p>

            <div class="flex flex-wrap gap-3 mt-4">
              <span class="px-4 py-2 bg-gray-100 rounded-full text-sm">
                {{ healthProfile?.gender }}
              </span>

              <span class="px-4 py-2 bg-gray-100 rounded-full text-sm">
                {{ healthProfile?.work_type }}
              </span>

              <span class="px-4 py-2 bg-gray-100 rounded-full text-sm">
                Stress:
                {{ healthProfile?.baseline_stress_level }}/10
              </span>
            </div>

            <button
              @click="editMode = !editMode"
              class="mt-4 rounded-xl bg-black px-5 py-3 text-white hover:opacity-90"
            >
              {{ editMode ? "Hủy" : "Chỉnh sửa Health Profile" }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Age</p>

          <h3 class="text-3xl font-bold mt-2">
            {{ healthProfile?.age }}
          </h3>
        </div>

        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Height</p>

          <h3 class="text-3xl font-bold mt-2">
            {{ healthProfile?.height_cm }}
            cm
          </h3>
        </div>

        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">Weight</p>

          <h3 class="text-3xl font-bold mt-2">
            {{ healthProfile?.weight_kg }}
            kg
          </h3>
        </div>

        <div class="bg-white rounded-2xl shadow p-5">
          <p class="text-gray-500 text-sm">BMI</p>

          <h3 class="text-3xl font-bold mt-2">
            {{ bmi }}
          </h3>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <div class="bg-white rounded-3xl shadow p-8">
          <h3 class="text-2xl font-semibold mb-4">Thông tin cài đặt</h3>
          <div class="space-y-3 text-gray-700">
            <p>Múi giờ: {{ settings?.timezone ?? "Chưa thiết lập" }}</p>
            <p>
              Thông báo: {{ settings?.notification_enabled ? "Bật" : "Tắt" }}
            </p>
          </div>
        </div>

        <div v-if="editMode" class="bg-white rounded-3xl shadow p-8">
          <h3 class="text-2xl font-semibold mb-4">Chỉnh sửa Health Profile</h3>

          <div class="grid gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Tuổi</label
              >
              <input
                type="number"
                v-model.number="form.age"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Giới tính</label
              >
              <input
                v-model="form.gender"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Chiều cao (cm)</label
              >
              <input
                type="number"
                v-model.number="form.height_cm"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Cân nặng (kg)</label
              >
              <input
                type="number"
                v-model.number="form.weight_kg"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Loại công việc</label
              >
              <input
                v-model="form.work_type"
                class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
              />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Giờ ngủ trung bình</label
                >
                <input
                  type="number"
                  step="0.1"
                  v-model.number="form.baseline_sleep_hours"
                  class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Mức độ stress</label
                >
                <input
                  type="number"
                  min="0"
                  max="10"
                  v-model.number="form.baseline_stress_level"
                  class="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            <div class="text-sm text-green-600" v-if="successMessage">
              {{ successMessage }}
            </div>
            <div class="text-sm text-red-600" v-if="errorMessage">
              {{ errorMessage }}
            </div>

            <button
              @click="saveHealthProfile"
              :disabled="saving"
              class="mt-4 rounded-xl bg-black px-5 py-3 text-white hover:opacity-90 transition disabled:opacity-50"
            >
              {{ saving ? "Đang lưu..." : "Lưu thay đổi" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
