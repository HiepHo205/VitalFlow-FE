<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  submit: [payload: any];
}>();

const props = defineProps<{
  loading: boolean;
}>();

const form = ref({
  log_date: "",
  mood_score: 5,
  energy_level: 5,
  stress_level: 5,
  sleep_hours: 7,
  water_intake_ml: 2000,
  body_condition: "",
  productivity_score: 5,
});

const handleSubmit = () => {
  emit("submit", form.value);
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-4"
  >
    <input
      v-model="form.log_date"
      type="date"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.mood_score"
      type="number"
      placeholder="Mood"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.energy_level"
      type="number"
      placeholder="Energy"
      class="w-full border rounded-lg px-4 py-2"
    />

    <button
      type="submit"
      class="w-full bg-black text-white py-3 rounded-xl"
    >
      Save Daily Log
    </button>
  </form>
</template>