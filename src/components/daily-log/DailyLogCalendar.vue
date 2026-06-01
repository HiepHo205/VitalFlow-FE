<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  logs: any[];
  month: number;
  year: number;
}>();

const emit = defineEmits<{
  select: [date: string];
}>();

const daysInMonth = computed(() => {
  return new Date(
    props.year,
    props.month + 1,
    0
  ).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(
    props.year,
    props.month,
    1
  ).getDay();
});

const days = computed(() => {
  return Array.from(
    {
      length:
        daysInMonth.value,
    },
    (_, i) => i + 1
  );
});

const emptySlots = computed(
  () => {
    return Array.from({
      length:
        firstDayOfMonth.value,
    });
  }
);

const getDateString = (
  day: number
) => {
  const month = String(
    props.month + 1
  ).padStart(2, "0");

  const date = String(day).padStart(
    2,
    "0"
  );

  return `${props.year}-${month}-${date}`;
};

const getLogByDay = (
  day: number
) => {
  const date =
    getDateString(day);

  return props.logs.find(
    (log: any) =>
      log.log_date?.split(
        "T"
      )[0] === date
  );
};

const selectDay = (
  day: number
) => {
  emit(
    "select",
    getDateString(day)
  );
};
</script>

<template>
  <div class="w-full">
    <div
      class="grid grid-cols-7 gap-2 mb-2"
    >
      <div
        v-for="day in [
          'S',
          'M',
          'T',
          'W',
          'T',
          'F',
          'S',
        ]"
        :key="day"
        class="text-center text-xs font-semibold text-gray-400"
      >
        {{ day }}
      </div>
    </div>
    <div
      class="grid grid-cols-7 gap-2"
    >
      <div
        v-for="(_, index) in emptySlots"
        :key="`empty-${index}`"
        class="h-12"
      />
      <button
        v-for="day in days"
        :key="day"
        @click="
          selectDay(day)
        "
        class="h-12 rounded-xl border text-sm font-medium transition-all hover:border-black"
        :class="
          getLogByDay(day)
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-gray-200'
        "
      >
        {{ day }}
      </button>
    </div>
  </div>
</template>