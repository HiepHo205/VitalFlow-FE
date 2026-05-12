<script setup lang="ts">
defineProps<{
  item: any;
  index: number;
}>();

const emit = defineEmits<{
  remove: [index: number];
}>();
</script>

<template>
  <div class="border rounded-xl p-4 mb-4 space-y-4">
    <div class="flex justify-between items-center">
      <h3 class="font-semibold">
        Item #{{ index + 1 }}
      </h3>

      <button
        type="button"
        @click="emit('remove', index)"
        class="text-red-500"
      >
        Remove
      </button>
    </div>

    <div>
      <label class="block text-sm mb-1">
        Title
      </label>

      <input
        v-model="item.title"
        type="text"
        class="w-full border rounded-lg px-4 py-2"
        placeholder="Meditation"
        required
      />
    </div>

    <div>
      <label class="block text-sm mb-1">
        Description
      </label>

      <input
        v-model="item.description"
        type="text"
        class="w-full border rounded-lg px-4 py-2"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">
        Category
      </label>

      <select
        v-model="item.category"
        class="w-full border rounded-lg px-4 py-2"
      >
        <option value="">
          Select category
        </option>

        <option value="exercise">
          Exercise
        </option>

        <option value="mindfulness">
          Mindfulness
        </option>

        <option value="study">
          Study
        </option>

        <option value="work">
          Work
        </option>

        <option value="sleep">
          Sleep
        </option>
      </select>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1">
          Start Time
        </label>

        <input
          v-model="item.start_time"
          type="time"
          class="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">
          End Time
        </label>

        <input
          v-model="item.end_time"
          type="time"
          class="w-full border rounded-lg px-4 py-2"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm mb-1">
        Duration
      </label>

      <input
        v-model="item.duration_minutes"
        type="number"
        class="w-full border rounded-lg px-4 py-2"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">
        Priority
      </label>

      <input
        v-model="item.priority"
        type="number"
        class="w-full border rounded-lg px-4 py-2"
      />
    </div>

    <div>
      <label class="block text-sm mb-1">
        Recurrence
      </label>

      <select
        v-model="item.recurrence_type"
        class="w-full border rounded-lg px-4 py-2"
      >
        <option value="daily">
          Daily
        </option>

        <option value="weekly">
          Weekly
        </option>

        <option value="monthly">
          Monthly
        </option>
      </select>
    </div>
  </div>
</template>