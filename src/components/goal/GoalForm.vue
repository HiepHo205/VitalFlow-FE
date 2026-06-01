<script setup lang="ts">
import { ref, watch } from "vue";

import type { Goal, GoalPayload } from "@/types/goal";

const props = defineProps<{
  loading: boolean;
  initialData?: Goal | null;
}>();

const emit = defineEmits<{
  submit: [payload: GoalPayload];
}>();

const form = ref<GoalPayload>({
  goal_type: "",
  target_value: 0,
  current_value: 0,
  start_date: "",
  end_date: "",
  status: "active",
});

watch(
  () => props.initialData,
  (value) => {
    if (value) {
      form.value = {
        goal_type: value.goal_type,
        target_value: Number(value.target_value ?? 0),
        current_value: Number(value.current_value ?? 0),
        start_date: value.start_date ?? "",
        end_date: value.end_date ?? "",
        status: value.status,
      };
    }
  },
  {
    immediate: true,
  }
);

const handleSubmit = () => {
  emit("submit", form.value);
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-5"
  >
    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Goal Name
      </label>

      <input
        v-model="form.goal_type"
        type="text"
        placeholder="Example: Lose weight, Sleep better..."
        class="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Target Value
      </label>

      <input
        v-model="form.target_value"
        type="number"
        placeholder="Enter target value"
        class="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Current Progress
      </label>

      <input
        v-model="form.current_value"
        type="number"
        placeholder="Enter current progress"
        class="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Start Date
        </label>

        <input
          v-model="form.start_date"
          type="date"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          End Date
        </label>

        <input
          v-model="form.end_date"
          type="date"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>
    </div>

    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Status
      </label>

      <select
        v-model="form.status"
        class="w-full border rounded-xl px-4 py-3"
      >
        <option value="active">
          Active
        </option>

        <option value="completed">
          Completed
        </option>
      </select>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
    >
      {{
        loading
          ? "Saving..."
          : "Save Goal"
      }}
    </button>
  </form>
</template>
