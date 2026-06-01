<script setup lang="ts">
import {
  ref,
  watch,
} from "vue";

const props = defineProps<{
  loading: boolean;
  initialData?: any;
}>();

const emit = defineEmits<{
  submit: [payload: any];
}>();

const createDefaultForm = () => ({
  log_date:
    new Date()
      .toISOString()
      .split("T")[0],

  mood_score: 5,

  energy_level: 5,

  stress_level: 5,

  sleep_hours: 7,

  water_intake_ml: 2000,

  body_condition: "",

  productivity_score: 5,
});

const form = ref(
  createDefaultForm()
);

watch(
  () => props.initialData,
  (value) => {
    if (value) {
      form.value = {
        ...createDefaultForm(),

        ...value,

        log_date:
          value.log_date
            ?.split("T")[0] ??
          createDefaultForm()
            .log_date,
      };

      return;
    }

    form.value =
      createDefaultForm();
  },
  {
    immediate: true,
  }
);

const handleSubmit = () => {
  emit("submit", {
    ...form.value,
  });
};
</script>

<template>
  <form
    @submit.prevent="
      handleSubmit
    "
    class="space-y-5"
  >
    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Daily Log Date
      </label>

      <input
        v-model="
          form.log_date
        "
        type="date"
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
          Mood Score
        </label>

        <input
          v-model="
            form.mood_score
          "
          type="number"
          min="1"
          max="10"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Energy Level
        </label>

        <input
          v-model="
            form.energy_level
          "
          type="number"
          min="1"
          max="10"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Stress Level
        </label>

        <input
          v-model="
            form.stress_level
          "
          type="number"
          min="1"
          max="10"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Sleep Hours
        </label>

        <input
          v-model="
            form.sleep_hours
          "
          type="number"
          step="0.1"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Water Intake
          (ml)
        </label>

        <input
          v-model="
            form.water_intake_ml
          "
          type="number"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium mb-2"
        >
          Productivity
          Score
        </label>

        <input
          v-model="
            form.productivity_score
          "
          type="number"
          min="1"
          max="10"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>
    </div>
    <div>
      <label
        class="block text-sm font-medium mb-2"
      >
        Body Condition
      </label>

      <textarea
        v-model="
          form.body_condition
        "
        rows="4"
        class="w-full border rounded-xl px-4 py-3"
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
    >
      {{
        loading
          ? "Saving..."
          : initialData
            ? "Update Daily Log"
            : "Create Daily Log"
      }}
    </button>
  </form>
</template>