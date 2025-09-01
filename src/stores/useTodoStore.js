import { create } from "zustand";

const persistKey = "todo_v1";

export const useTodoStore = create((set, get) => ({
  todos: JSON.parse(localStorage.getItem(persistKey) || "[]"),
  filter: "all",
  search: "",

  addTodo: (text) => {
    const t = text.trim();
    if (!t) return;
    const result = [
      ...get().todos,
      {
        id: crypto.randomUUID(),
        text: t,
        completed: false,
      },
    ];
    set({ todos: result });
    localStorage.setItem(persistKey, JSON.stringify(result));
  },

  toggleTodo: (id) => {
    const result = get().todos.map((td) =>
      td.id === id ? { ...td, completed: !td.completed } : td
    );
    set({ todos: result });
    localStorage.setItem(persistKey, JSON.stringify(result));
  },

  deleteTodo: (id) => {
    const result = get().todos.filter((td) => td.id !== id);
    set({ todos: result });
    localStorage.setItem(persistKey, JSON.stringify(result));
  },

  clearCompleted: () => {
    const result = get().todos.filter((td) => !td.completed);
    set({ todos: result });
    localStorage.setItem(persistKey, JSON.stringify(result));
  },

  setFilter: (f) => set({ filter: f }),
  setSearch: (q) => set({ search: q.toLowerCase() }),
}));
