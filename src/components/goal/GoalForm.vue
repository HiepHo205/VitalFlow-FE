<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  loading: boolean;
  initialData?: any;
}>();

const emit = defineEmits<{
  submit: [payload: any];
}>();

const form = ref({
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
        ...value,
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
    class="space-y-4"
  >
    <input
      v-model="form.goal_type"
      type="text"
      placeholder="Goal type"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.target_value"
      type="number"
      placeholder="Target"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.current_value"
      type="number"
      placeholder="Current"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.start_date"
      type="date"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.end_date"
      type="date"
      class="w-full border rounded-lg px-4 py-2"
    />

    <select
      v-model="form.status"
      class="w-full border rounded-lg px-4 py-2"
    >
      <option value="active">
        Active
      </option>

      <option value="completed">
        Completed
      </option>
    </select>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-black text-white py-3 rounded-xl"
    >
      Save Goal
    </button>
  </form>
</template>