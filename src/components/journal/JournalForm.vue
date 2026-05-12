<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  submit: [payload: any];
}>();

const props = defineProps<{
  loading: boolean;
}>();

const form = ref({
  entry_date: "",
  title: "",
  content: "",
  mood_tag: "",
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
      v-model="form.entry_date"
      type="date"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.title"
      type="text"
      placeholder="Title"
      class="w-full border rounded-lg px-4 py-2"
    />

    <textarea
      v-model="form.content"
      rows="5"
      class="w-full border rounded-lg px-4 py-2"
    />

    <input
      v-model="form.mood_tag"
      type="text"
      placeholder="Mood tag"
      class="w-full border rounded-lg px-4 py-2"
    />

    <button
      type="submit"
      class="w-full bg-black text-white py-3 rounded-xl"
    >
      Save Journal
    </button>
  </form>
</template>