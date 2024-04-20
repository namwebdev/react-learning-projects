import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  tasks: ITask[];
  draggedTask: ITask["title"] | null;
  addTask: (task: ITask) => void;
  deleteTask: (title: ITask["title"]) => void;
  setDraggedTask: (title: ITask["title"] | null) => void;
  moveTask: (task: ITask) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      tasks: [],
      draggedTask: null,
      addTask: (task: ITask) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      deleteTask: (title: ITask["title"]) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.title !== title),
        })),
      setDraggedTask: (title: ITask["title"] | null) => set({ draggedTask: title }),
      moveTask: (task: ITask) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.title === task.title ? task : t)),
        })),
    }),
    {
      name: "tasks-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({ tasks: state.tasks }), // Only persist `tasks` array
      // Optionally, use serialize and deserialize to handle complex state objects
      serialize: (state) => JSON.stringify(state),
      deserialize: (json) => JSON.parse(json),
    }
  )
);
