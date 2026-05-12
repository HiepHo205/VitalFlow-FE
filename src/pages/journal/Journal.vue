<script setup lang="ts">
import {
  onMounted,
  ref,
} from "vue";

import DefaultLayout from "@/layouts/DefaultLayout.vue";

import JournalForm from "@/components/journal/JournalForm.vue";

import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/api/journal";

const loading = ref(false);

const journals = ref<any[]>([]);

const editingJournal =
  ref<any>(null);

const fetchJournals =
  async () => {
    try {
      loading.value = true;

      const res =
        await getJournalEntries();

      journals.value =
        res.data.data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

const handleCreate =
  async (payload: any) => {
    await createJournalEntry(
      payload
    );

    fetchJournals();
  };

const handleUpdate =
  async (payload: any) => {
    await updateJournalEntry(
      editingJournal.value.id,
      payload
    );

    editingJournal.value =
      null;

    fetchJournals();
  };

const handleDelete =
  async (id: string) => {
    await deleteJournalEntry(id);

    fetchJournals();
  };

onMounted(() => {
  fetchJournals();
});
</script>

<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h1
          class="text-3xl font-bold"
        >
          Journals
        </h1>

        <p class="text-gray-500 mt-1">
          Save your thoughts and reflections
        </p>
      </div>

      <div
        class="bg-white rounded-3xl shadow p-6"
      >
        <JournalForm
          :loading="loading"
          :initialData="
            editingJournal
          "
          @submit="
            editingJournal
              ? handleUpdate($event)
              : handleCreate($event)
          "
        />
      </div>

      <div class="space-y-4">
        <div
          v-for="journal in journals"
          :key="journal.id"
          class="bg-white rounded-2xl shadow p-5"
        >
          <div
            class="flex justify-between items-start"
          >
            <div>
              <div
                class="flex items-center gap-3"
              >
                <h2
                  class="text-xl font-bold"
                >
                  {{
                    journal.title
                  }}
                </h2>

                <span
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {{
                    journal.mood_tag
                  }}
                </span>
              </div>

              <p
                class="text-gray-600 mt-3 leading-7"
              >
                {{
                  journal.content
                }}
              </p>
            </div>

            <div class="flex gap-2">
              <button
                @click="
                  editingJournal =
                    journal
                "
                class="px-4 py-2 bg-black text-white rounded-lg"
              >
                Edit
              </button>

              <button
                @click="
                  handleDelete(
                    journal.id
                  )
                "
                class="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>