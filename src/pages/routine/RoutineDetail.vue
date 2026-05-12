<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import { useRoute } from "vue-router";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import { getRoutineDetail } from "@/api/routine";

const route = useRoute();

const loading = ref(false);

const routine = ref<any>(null);

const fetchRoutine = async () => {
  try {
    loading.value = true;

    const res =
      await getRoutineDetail(
        route.params.id as string
      );

    routine.value = res.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRoutine();
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
      v-else-if="routine"
      class="space-y-6"
    >
      <!-- Header -->
      <div
        class="bg-white rounded-3xl shadow p-8"
      >
        <div
          class="flex items-start justify-between"
        >
          <div>
            <h1
              class="text-3xl font-bold"
            >
              {{ routine.name }}
            </h1>

            <p
              class="text-gray-500 mt-2"
            >
              {{
                routine.description
              }}
            </p>
          </div>

          <div
            class="px-4 py-2 rounded-full bg-gray-100 text-sm"
          >
            {{
              routine.is_ai_generated
                ? "AI Generated"
                : "Manual"
            }}
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Total Items
          </p>

          <h3
            class="text-3xl font-bold mt-2"
          >
            {{
              routine.items.length
            }}
          </h3>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Created At
          </p>

          <h3
            class="text-lg font-semibold mt-2"
          >
            {{
              new Date(
                routine.created_at
              ).toLocaleDateString()
            }}
          </h3>
        </div>

        <div
          class="bg-white rounded-2xl shadow p-5"
        >
          <p class="text-gray-500 text-sm">
            Type
          </p>

          <h3
            class="text-lg font-semibold mt-2"
          >
            {{
              routine.is_ai_generated
                ? "AI Routine"
                : "Manual Routine"
            }}
          </h3>
        </div>
      </div>

      <!-- Items -->
      <div
        class="bg-white rounded-3xl shadow p-6"
      >
        <h2
          class="text-2xl font-bold mb-6"
        >
          Routine Items
        </h2>

        <div class="space-y-4">
          <div
            v-for="item in routine.items"
            :key="item.id"
            class="border rounded-2xl p-5"
          >
            <div
              class="flex items-start justify-between"
            >
              <div>
                <h3
                  class="text-lg font-bold"
                >
                  {{ item.title }}
                </h3>

                <p
                  class="text-gray-500 mt-1"
                >
                  {{
                    item.description
                  }}
                </p>
              </div>

              <div
                class="text-right"
              >
                <p
                  class="font-semibold"
                >
                  {{
                    item.start_time
                  }}
                  -
                  {{
                    item.end_time
                  }}
                </p>

                <p
                  class="text-sm text-gray-500"
                >
                  {{
                    item.duration_minutes
                  }}
                  mins
                </p>
              </div>
            </div>

            <div
              class="flex flex-wrap gap-2 mt-4"
            >
              <span
                class="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {{
                  item.category
                }}
              </span>

              <span
                class="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                Priority:
                {{ item.priority }}
              </span>

              <span
                class="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {{
                  item.recurrence_type
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>