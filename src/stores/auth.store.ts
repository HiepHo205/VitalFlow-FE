import { defineStore } from "pinia";

import * as authApi from "@/api/auth";

export const useAuthStore = defineStore(
  "auth",
  {
    state: () => ({
      user: null as any,

      token:
        localStorage.getItem(
          "access_token"
        ),
    }),

    actions: {
      async register(payload: {
        full_name: string;
        email: string;
        password: string;
        password_confirmation: string;

        health_profile: {
          age: number;
          gender: string;
          height_cm: number;
          weight_kg: number;
          work_type: string;
          baseline_sleep_hours: number;
          baseline_stress_level: number;
        };
      }) {
        await authApi.register(payload);
      },

      async login(payload: {
        email: string;
        password: string;
      }) {
        const res =
          await authApi.login(payload);

        this.token =
          res.data.data.access_token;

        localStorage.setItem(
          "access_token",
          res.data.data.access_token
        );

        await this.fetchMe();
      },

      async fetchMe() {
        const res =
          await authApi.me();

        this.user = res.data.data;
      },

      async logout() {
        try {
          await authApi.logout();
        } catch (e) {}

        this.token = null;

        this.user = null;

        localStorage.removeItem(
          "access_token"
        );
      }
    },
  }
);