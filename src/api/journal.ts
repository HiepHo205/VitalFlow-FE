import api from "@/lib/axios";

export const getJournalEntries =
  () => {
    return api.get(
      "/journal-entries"
    );
  };

export const getJournalDetail = (
  id: string
) => {
  return api.get(
    `/journal-entries/${id}`
  );
};

export const createJournalEntry = (
  payload: {
    entry_date: string;
    title: string;
    content: string;
    mood_tag: string;
  }
) => {
  return api.post(
    "/journal-entries",
    payload
  );
};

export const updateJournalEntry = (
  id: string,
  payload: {
    entry_date: string;
    title: string;
    content: string;
    mood_tag: string;
  }
) => {
  return api.put(
    `/journal-entries/${id}`,
    payload
  );
};

export const deleteJournalEntry = (
  id: string
) => {
  return api.delete(
    `/journal-entries/${id}`
  );
};