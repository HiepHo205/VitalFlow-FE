<script setup lang="ts">
import {
  ref,
  watch,
} from "vue";

import RoutineItemForm from "./RoutineItemForm.vue";

import type {
  RoutineFormData,
  RoutineItem,
  RoutineItemFormData,
} from "@/types/routine";

const props = defineProps<{
  loading: boolean;
  initialData?: RoutineFormData;
  submitText?: string;
}>();

const emit = defineEmits<{
  submit: [payload: RoutineFormData];
}>();

const createEmptyItem = (): RoutineItemFormData => ({
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

const form = ref<RoutineFormData>({
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

      description:
        value.description || "",

      is_ai_generated:
        value.is_ai_generated ||
        false,

      items:
        value.items?.length
          ? value.items.map(
              (item: RoutineItem | RoutineItemFormData) => ({
                id: item.id,

                title:
                  item.title || "",

                description:
                  item.description ||
                  "",

                category:
                  item.category ||
                  "",

                start_time:
                  item.start_time?.slice(
                    0,
                    5
                  ) || "",

                end_time:
                  item.end_time?.slice(
                    0,
                    5
                  ) || "",

                duration_minutes:
                  item.duration_minutes || 0,

                priority:
                  item.priority || 1,

                recurrence_type:
                  item.recurrence_type ||
                  "daily",
              })
            )
          : [createEmptyItem()],
    };
  },
  {
    immediate: true,
  }
);

const addItem = () => {
  form.value.items.push(
    createEmptyItem()
  );
};

const removeItem = (
  index: number
) => {
  form.value.items.splice(
    index,
    1
  );
};

const handleSubmit = () => {
  emit("submit", {
    ...form.value,
  });
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

    <div class="mb-5">
      <h2 class="text-2xl font-bold">
        Routine Items
      </h2>
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

    <button
      type="button"
      @click="addItem"
      class="w-full mt-5 border-2 border-dashed border-gray-300 rounded-2xl py-4 font-medium hover:border-black hover:text-black transition"
    >
      + Add Item
    </button>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-black text-white py-4 rounded-2xl disabled:opacity-50"
    >
      {{
        loading
          ? "Processing..."
          : submitText ||
            "Save Routine"
      }}
    </button>
  </form>
</template>
