<script setup lang="ts">
import { computed, ref } from "vue";

import { RouterLink, useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth.store";

const auth = useAuthStore();

const router = useRouter();

const loading = ref(false);

const step = ref(1);

const totalSteps = 2;

const progress = computed(() => {
  return (step.value / totalSteps) * 100;
});

const form = ref({
  full_name: "",
  email: "",
  password: "",
  password_confirmation: "",

  health_profile: {
    age: 18,
    gender: "male",
    height_cm: 170,
    weight_kg: 60,
    work_type: "office",
    baseline_sleep_hours: 7,
    baseline_stress_level: 5,
  },
});

const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++;
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const handleRegister = async () => {
  try {
    loading.value = true;

    await auth.register(form.value);

    router.push("/login");
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center p-6"
  >
    <div
      class="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      <!-- Progress -->
      <div class="h-2 bg-gray-200">
        <div
          class="h-full bg-black transition-all duration-300"
          :style="{
            width: `${progress}%`,
          }"
        />
      </div>

      <div class="p-8">
        <h1
          class="text-3xl font-bold text-center mb-2"
        >
          Create Account
        </h1>

        <p
          class="text-center text-gray-500 mb-8"
        >
          Step {{ step }} /
          {{ totalSteps }}
        </p>

        <!-- STEP 1 -->
        <div
          v-if="step === 1"
          class="space-y-5 animate-fade"
        >
          <h2 class="text-2xl font-semibold">
            Health Profile
          </h2>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                class="block mb-2 text-sm"
              >
                Age
              </label>

              <input
                v-model="
                  form.health_profile.age
                "
                type="number"
                class="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Gender
              </label>

              <select
                v-model="
                  form.health_profile.gender
                "
                class="w-full border rounded-xl px-4 py-3"
              >
                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>
              </select>
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Height (cm)
              </label>

              <input
                v-model="
                  form.health_profile
                    .height_cm
                "
                type="number"
                class="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Weight (kg)
              </label>

              <input
                v-model="
                  form.health_profile
                    .weight_kg
                "
                type="number"
                class="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Work Type
              </label>

              <select
                v-model="
                  form.health_profile
                    .work_type
                "
                class="w-full border rounded-xl px-4 py-3"
              >
                <option value="office">
                  Office
                </option>

                <option value="remote">
                  Remote
                </option>

                <option value="physical">
                  Physical
                </option>
              </select>
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Sleep Hours
              </label>

              <input
                v-model="
                  form.health_profile
                    .baseline_sleep_hours
                "
                type="number"
                step="0.5"
                class="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Stress Level
              </label>

              <input
                v-model="
                  form.health_profile
                    .baseline_stress_level
                "
                type="number"
                min="1"
                max="10"
                class="w-full border rounded-xl px-4 py-3"
              />
            </div>
          </div>

          <button
            @click="nextStep"
            class="w-full bg-black text-white py-3 rounded-xl"
          >
            Next
          </button>
        </div>

        <!-- STEP 2 -->
        <form
          v-if="step === 2"
          @submit.prevent="
            handleRegister
          "
          class="space-y-5 animate-fade"
        >
          <h2 class="text-2xl font-semibold">
            Account Information
          </h2>

          <div>
            <label class="block mb-2 text-sm">
              Full Name
            </label>

            <input
              v-model="form.full_name"
              type="text"
              class="w-full border rounded-xl px-4 py-3"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm">
              Email
            </label>

            <input
              v-model="form.email"
              type="email"
              class="w-full border rounded-xl px-4 py-3"
              required
            />
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                class="block mb-2 text-sm"
              >
                Password
              </label>

              <input
                v-model="form.password"
                type="password"
                class="w-full border rounded-xl px-4 py-3"
                required
              />
            </div>

            <div>
              <label
                class="block mb-2 text-sm"
              >
                Confirm Password
              </label>

              <input
                v-model="
                  form.password_confirmation
                "
                type="password"
                class="w-full border rounded-xl px-4 py-3"
                required
              />
            </div>
          </div>

          <div class="flex gap-4">
            <button
              type="button"
              @click="prevStep"
              class="w-full border py-3 rounded-xl"
            >
              Back
            </button>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-black text-white py-3 rounded-xl disabled:opacity-50"
            >
              {{
                loading
                  ? "Creating account..."
                  : "Register"
              }}
            </button>
          </div>
        </form>

        <div class="text-center mt-6">
          <RouterLink
            to="/login"
            class="text-sm text-gray-500 hover:underline"
          >
            Already have an account?
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade {
  animation: fade 0.3s ease;
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateX(20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>