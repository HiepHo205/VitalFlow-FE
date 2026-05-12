import { createRouter, createWebHistory } from "vue-router";

import Login from "@/pages/auth/Login.vue";
import Register from "@/pages/auth/Register.vue";
import Dashboard from "@/pages/dashboard/Dashboard.vue";
import Profile from "@/pages/profile/Profile.vue";
import RoutineDetail from "@/pages/routine/RoutineDetail.vue";
import Goal from "@/pages/goal/Goal.vue";
import Journal from "@/pages/journal/Journal.vue";
import DailyLog from "@/pages/daily-log/DailyLog.vue";

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
    path: "/create-routine",
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
    path: "/:routine/:id/edit",
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
  }
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