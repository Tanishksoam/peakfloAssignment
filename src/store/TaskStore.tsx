import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Task {
  id: string;
  title: string;
}

interface TaskState {
  [key: string]: Task[];
}

interface DraggingTask {
  id: string;
  sourceColumn: string;
}

interface TaskStore {
  tasks: TaskState;
  draggingTask: DraggingTask | null;
  setDraggingTask: (task: DraggingTask | null) => void;
  moveTask: (
    taskId: string,
    sourceColumn: string,
    targetColumn: string
  ) => void;
  addTask: (column: string, title: string) => void;
  deleteTask: (taskId: string, column: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: {
        todo: [
          {
            id: "1",
            title: "Research competitors",
          },
          {
            id: "2",
            title: "Design mockups",
          },
        ],
        inProgress: [
          {
            id: "3",
            title: "Update documentation",
          },
        ],
        review: [{ id: "4", title: "Code review" }],
        done: [
          {
            id: "5",
            title: "Setup project",
          },
        ],
      },
      draggingTask: null,
      setDraggingTask: (task) => set({ draggingTask: task }),
      moveTask: (taskId, sourceColumn, targetColumn) =>
        set((state) => {
          if (sourceColumn === targetColumn) return state;
          const task = state.tasks[sourceColumn].find((t) => t.id === taskId);
          if (!task) return state;

          return {
            tasks: {
              ...state.tasks,
              [sourceColumn]: state.tasks[sourceColumn].filter(
                (t) => t.id !== taskId
              ),
              [targetColumn]: [...state.tasks[targetColumn], task],
            },
          };
        }),
      addTask: (column, title) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [column]: [
              ...state.tasks[column],
              {
                id: Math.random().toString(36).substring(7),
                title,
              },
            ],
          },
        })),
      deleteTask: (taskId, column) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [column]: state.tasks[column].filter((task) => task.id !== taskId),
          },
        })),
    }),
    { name: "task-storage" }
  )
);
