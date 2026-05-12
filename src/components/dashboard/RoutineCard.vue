<script setup lang="ts">
import {
  useRouter,
} from "vue-router";

import {
  deleteRoutine,
} from "@/api/routine";

const props = defineProps<{
  routine: any;
}>();

const emit = defineEmits<{
  (e: "deleted"): void;
}>();

const router = useRouter();

const handleDelete =
  async () => {
    const confirmed =
      confirm(
        "Delete this routine?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteRoutine(
        props.routine.id
      );

      emit("deleted");
    } catch (error) {
      console.error(error);
    }
  };

const handleEdit = () => {
  router.push(
    `/routine/${props.routine.id}/edit`
  );
};
</script>

<template>
  <div
    class="border rounded-2xl p-5 hover:border-black hover:shadow transition bg-white"
  >
    <div
      class="flex items-start justify-between gap-4"
    >
      <RouterLink
        :to="`/routine/${routine.id}`"
        class="flex-1"
      >
        <div>
          <h4
            class="text-xl font-bold"
          >
            {{ routine.name }}
          </h4>

          <p
            class="text-gray-500 mt-1"
          >
            {{
              routine.description
            }}
          </p>
        </div>
      </RouterLink>

      <div
        class="flex items-center gap-2"
      >
        <div
          class="px-4 py-2 bg-gray-100 rounded-full text-sm"
        >
          {{
            routine.is_ai_generated
              ? "AI Generated"
              : "Manual"
          }}
        </div>

        <button
          @click="handleEdit"
          class="px-4 py-2 bg-black text-white rounded-lg text-sm"
        >
          Edit
        </button>

        <button
          @click="handleDelete"
          class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
        >
          Delete
        </button>
      </div>
    </div>

    <div class="mt-5 space-y-3">
      <div
        v-for="item in routine.items"
        :key="item.id"
        class="bg-gray-50 rounded-xl p-4"
      >
        <div
          class="flex items-center justify-between"
        >
          <div>
            <h5 class="font-semibold">
              {{ item.title }}
            </h5>

            <p
              class="text-sm text-gray-500 mt-1"
            >
              {{ item.description }}
            </p>
          </div>

          <div class="text-right">
            <p
              class="text-sm font-medium"
            >
              {{ item.start_time }}
              -
              {{ item.end_time }}
            </p>

            <p
              class="text-xs text-gray-500 mt-1"
            >
              {{ item.category }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>