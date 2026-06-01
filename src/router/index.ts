import { createRouter, createWebHistory } from "vue-router";

import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";

import Dashboard from "@/pages/dashboard/Dashboard.vue";

import Profile from "@/pages/profile/Profile.vue";

import RoutineDetail from "@/pages/routine/RoutineDetail.vue";

import Goal from "@/pages/goal/Goal.vue";
import GoalDetail from "@/pages/goal/GoalDetail.vue";

import Journal from "@/pages/journal/Journal.vue";

import DailyLog from "@/pages/daily-log/DailyLog.vue";

import UserSettings from "@/pages/settings/UserSettings.vue";

import AiFeedback from "@/pages/feedback/AiFeedback.vue";

import Notifications from "@/pages/notifications/Notifications.vue";

import WeeklyReports from "@/pages/reports/WeeklyReports.vue";

import FocusSessions from "@/pages/focus/FocusSessions.vue";


const routes = [
  {
    path: "/",
    redirect: "/login",
  },

  {
    path: "/login",
    component: Login,
  },

  {
    path: "/register",
    component: Register,
  },

  {
    path: "/dashboard",
    component: Dashboard,

    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/profile",
    component: Profile,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/routine/create",
    redirect: "/goals",

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals/:goalId/routines/create",
    component: () => import("@/pages/routine/CreateRoutine.vue"),

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/routine/:id",

    component: RoutineDetail,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/routine/:id/edit",

    component: () => import("@/pages/routine/EditRoutine.vue"),

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals",

    component: Goal,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals/:id",

    component: GoalDetail,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/journals",

    component: Journal,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/daily-logs",

    component: DailyLog,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/ai-feedbacks",

    component: AiFeedback,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/weekly-reports",

    component: WeeklyReports,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/focus-sessions",

    component: FocusSessions,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/notifications",

    component: Notifications,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/routine/create",
    redirect: "/goals",

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals/:goalId/routines/create",

    component: () => import("@/pages/routine/CreateRoutine.vue"),

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals/:goalId/routines/:id",

    component: RoutineDetail,

    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/goals/:goalId/routines/:id/edit",

    component: () => import("@/pages/routine/EditRoutine.vue"),

    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),

  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("access_token");

  if (to.meta.requiresAuth && !token) {
    next("/login");

    return;
  }

  if (to.path === "/login" && token) {
    next("/dashboard");

    return;
  }

  next();
});

export default router;
