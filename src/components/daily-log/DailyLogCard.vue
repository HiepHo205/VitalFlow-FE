<script setup lang="ts">
defineProps<{
  log: any;
}>();

const emit = defineEmits<{
  edit: [log: any];

  delete: [id: string];
}>();
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow p-5"
  >
    <div
      class="flex flex-col md:flex-row md:items-start md:justify-between gap-5"
    >
      <div
        class="space-y-4"
      >
        <div>
          <h2
            class="text-xl font-bold"
          >
            {{
              log.log_date
            }}
          </h2>

          <p
            class="text-gray-500 mt-1"
          >
            {{
              log.body_condition
            }}
          </p>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p
              class="text-xs text-gray-500"
            >
              Mood
            </p>

            <h3
              class="text-lg font-bold mt-1"
            >
              {{
                log.mood_score
              }}/10
            </h3>
          </div>
          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p
              class="text-xs text-gray-500"
            >
              Energy
            </p>

            <h3
              class="text-lg font-bold mt-1"
            >
              {{
                log.energy_level
              }}/10
            </h3>
          </div>

          <div
            class="rounded-xl bg-gray-50 p-3"
          >
            <p
              class="text-xs text-gray-500"
            >
              Stress
            </p>

            <h3
              class="text-lg font-bold mt-1"
            >
              {{
                log.stress_level
              }}/10
            </h3>
          </div>
        </div>
      </div>

      <div
        class="flex gap-2"
      >
        <button
          @click="
            emit(
              'edit',
              log
            )
          "
          class="px-4 py-2 bg-black text-white rounded-xl text-sm"
        >
          Edit
        </button>

        <button
          @click="
            emit(
              'delete',
              log.id
            )
          "
          class="px-4 py-2 bg-red-500 text-white rounded-xl text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>