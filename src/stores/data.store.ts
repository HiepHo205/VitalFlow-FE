import { defineStore } from "pinia";

import * as goalApi from "@/api/goal";
import * as routineApi from "@/api/routine";
import * as dailyLogApi from "@/api/dailyLog";

import type { Goal } from "@/types/goal";
import type { Routine } from "@/types/routine";
import type { DailyLog } from "@/types/dailyLog";

export const useDataStore = defineStore("data", {
  state: () => ({
    goals: [] as Goal[],
    goalsLoaded: false,
    routines: [] as Routine[],
    routinesLoaded: false,
    dailyLogs: [] as DailyLog[],
    dailyLogsLoaded: false,
  }),

  getters: {
    goalById: (state) => {
      return (id: string) => state.goals.find((goal) => goal.id === id) ?? null;
    },

    routinesByGoal: (state) => {
      return (goalId: string) =>
        state.routines.filter((routine) => routine.goal_id === goalId);
    },
  },

  actions: {
    async loadGoals(force = false) {
      if (this.goalsLoaded && !force) {
        return;
      }

      const res = await goalApi.getGoals();
      this.goals = res.data.data;
      this.goalsLoaded = true;
    },

    async loadGoalDetail(id: string, force = false) {
      const existing = this.goalById(id);
      if (existing && !force) {
        return existing;
      }

      const res = await goalApi.getGoalDetail(id);
      const goal = res.data.data;
      const existingIndex = this.goals.findIndex((item) => item.id === id);

      if (existingIndex !== -1) {
        this.goals[existingIndex] = goal;
      } else {
        this.goals.push(goal);
      }

      this.goalsLoaded = true;

      return goal;
    },

    async loadRoutines(goalId?: string, force = false) {
      if (this.routinesLoaded && !force) {
        if (
          !goalId ||
          this.routines.some((routine) => routine.goal_id === goalId)
        ) {
          return;
        }
      }

      const res = await routineApi.getRoutines(goalId);
      const fetched = res.data.data;

      if (goalId) {
        this.routines = [
          ...this.routines.filter((routine) => routine.goal_id !== goalId),
          ...fetched,
        ];
      } else {
        this.routines = fetched;
      }

      this.routinesLoaded = true;
    },

    async loadDailyLogs(force = false) {
      if (this.dailyLogsLoaded && !force) {
        return;
      }

      const res = await dailyLogApi.getDailyLogs();
      this.dailyLogs = res.data.data;
      this.dailyLogsLoaded = true;
    },

    updateGoal(goal: Goal) {
      const index = this.goals.findIndex((item) => item.id === goal.id);
      if (index !== -1) {
        this.goals[index] = goal;
      } else {
        this.goals.push(goal);
      }
    },

    updateRoutines(routines: Routine[]) {
      this.routines = [
        ...this.routines.filter(
          (routine) => !routines.some((item) => item.id === routine.id),
        ),
        ...routines,
      ];
      this.routinesLoaded = true;
    },

    updateDailyLogs(logs: DailyLog[]) {
      this.dailyLogs = logs;
      this.dailyLogsLoaded = true;
    },

    clearCache() {
      this.goals = [];
      this.goalsLoaded = false;
      this.routines = [];
      this.routinesLoaded = false;
      this.dailyLogs = [];
      this.dailyLogsLoaded = false;
    },
  },
});
