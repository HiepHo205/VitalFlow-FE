<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();

const loading = ref(false);

const user = computed(() => auth.user);

const healthProfile = computed(
  () => user.value?.health_profile
);

const settings = computed(
  () => user.value?.settings
);

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

onMounted(() => {
  fetchProfile();
});

const bmi = computed(() => {
  if (
    !healthProfile.value?.height_cm ||
    !healthProfile.value?.weight_kg
  ) {
    return null;
  }

  const height =
    Number(
      healthProfile.value.height_cm
    ) / 100;

  const weight = Number(
    healthProfile.value.weight_kg
  );

  return (
    weight /
    (height * height)
  ).toFixed(1);
});
</script>

<template>
  <DefaultLayout>
    <div
      v-if="loading"
      class="flex justify-center py-20"
    >
      <div
        class="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"
      />
    </div>

    <div
      v-else-if="user"
      class="space-y-6"
    >
      <div
        class="bg-white rounded-3xl shadow p-8"
      >
        <div
          class="flex flex-col md:flex-row md:items-center gap-6"
        >
          <div
            class="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold"
          >
            {{
              user.full_name.charAt(0)
            }}
          </div>

          <div class="flex-1">
            <h2
              class="text-3xl font-bold"
            >
              {{ user.full_name }}
            </h2>

            <p class="text-gray-500 mt-1">
              {{ user.email }}
            </p>

            <div
              class="flex flex-wrap gap-3 mt-4"
            >
              <span
                class="px-4 py-2 bg-gray-100 rounded-full text-sm"
              >
                {{
                  healthProfile?.gender
                }}
              </span>

              <span
                class="px-4 py-2 bg-gray-100 rounded-full text-sm"
              >
                {{
                  healthProfile?.work_type
                }}
              </span>

              <span
                class="px-4 py-2 bg-gray-100 rounded-full text-sm"
              >
                Stress:
                {{
                  healthProfile?.baseline_stress_level
                }}/10
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Age
          </p>

          <h3
            class="text-3xl font-bold mt-2"
          >
            {{
              healthProfile?.age
            }}
          </h3>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Height
          </p>

          <h3
            class="text-3xl font-bold mt-2"
          >
            {{
              healthProfile?.height_cm
            }}
            cm
          </h3>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Weight
          </p>

          <h3
            class="text-3xl font-bold mt-2"
          >
            {{
              healthProfile?.weight_kg
            }}
            kg
          </h3>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            BMI
          </p>

          <h3
            class="text-3xl font-bold mt-2"
          >
            {{ bmi }}
          </h3>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>