<script setup lang="ts">
import { ref, watch } from "vue";

import RoutineItemForm from "./RoutineItemForm.vue";

const props = defineProps<{
  loading: boolean;
  initialData?: any;
  submitText?: string;
}>();

const emit = defineEmits<{
  submit: [payload: any];
}>();

const createEmptyItem = () => ({
  id: undefined,

  title: "",
  description: "",
  category: "",
  start_time: "",
  end_time: "",
  duration_minutes: 0,
  priority: 1,
  recurrence_type: "daily",
});

const form = ref({
  name: "",
  description: "",
  is_ai_generated: false,

  items: [createEmptyItem()],
});

watch(
  () => props.initialData,
  (value) => {
    if (!value) {
      return;
    }

    form.value = {
      name: value.name || "",
      description: value.description || "",
      is_ai_generated:
        value.is_ai_generated || false,

      items:
        value.items?.length
          ? value.items.map((item: any) => ({
              id: item.id,

              title: item.title || "",
              description:
                item.description || "",
              category:
                item.category || "",
              start_time:
                item.start_time || "",
              end_time:
                item.end_time || "",
              duration_minutes:
                item.duration_minutes || 0,
              priority:
                item.priority || 1,
              recurrence_type:
                item.recurrence_type ||
                "daily",
            }))
          : [createEmptyItem()],
    };
  },
  {
    immediate: true,
  }
);

const addItem = () => {
  form.value.items.push(createEmptyItem());
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const handleSubmit = () => {
  emit("submit", form.value);
};
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="space-y-6"
  >
    <div
      class="bg-white rounded-2xl shadow p-6 space-y-5"
    >
      <div>
        <label class="block text-sm mb-2">
          Routine Name
        </label>

        <input
          v-model="form.name"
          type="text"
          class="w-full border rounded-xl px-4 py-3"
          required
        />
      </div>

      <div>
        <label class="block text-sm mb-2">
          Description
        </label>

        <textarea
          v-model="form.description"
          rows="4"
          class="w-full border rounded-xl px-4 py-3"
        />
      </div>
    </div>

    <div
      class="bg-white rounded-2xl shadow p-6"
    >
      <div
        class="flex items-center justify-between mb-5"
      >
        <h2 class="text-2xl font-bold">
          Routine Items
        </h2>

        <button
          type="button"
          @click="addItem"
          class="bg-black text-white px-4 py-2 rounded-xl"
        >
          + Add Item
        </button>
      </div>

      <div class="space-y-5">
        <RoutineItemForm
          v-for="(item, index) in form.items"
          :key="index"
          :item="item"
          :index="index"
          @remove="removeItem"
        />
      </div>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-black text-white py-4 rounded-2xl disabled:opacity-50"
    >
      {{
        loading
          ? "Processing..."
          : submitText || "Save Routine"
      }}
    </button>
  </form>
</template>