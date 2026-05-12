<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const auth = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = "";

    await auth.login({
      email: email.value,
      password: password.value,
    });

    router.push("/dashboard");
  } catch (e: any) {
    error.value = e.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6">
        Welcome Back
      </h2>

      <div v-if="error" class="mb-4 text-red-500 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="text-sm text-center mt-4">
        Don't have an account?
        <router-link to="/register" class="text-blue-500">
          Register
        </router-link>
      </p>
    </div>
  </div>
</template>