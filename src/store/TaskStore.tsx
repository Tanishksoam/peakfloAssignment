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
  columns: { [key: string]: { title: string; color: string } };
  draggingTask: DraggingTask | null;
  setDraggingTask: (task: DraggingTask | null) => void;
  moveTask: (
    taskId: string,
    sourceColumn: string,
    targetColumn: string
  ) => void;
  addTask: (column: string, title: string) => void;
  deleteTask: (taskId: string, column: string) => void;
  addColumn: (title: string, columnName: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      columns: {
        todo: { title: "Not Started", color: "bg-red-200" },
        inProgress: { title: "In Progress", color: "bg-blue-100" },
        completed: { title: "Completed", color: "bg-yellow-100" },
      },
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
        completed: [{ id: "4", title: "Code review" }],
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
      addColumn: (title, columnName) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [columnName]: { title, color: "bg-red-200" },
          },
          tasks: {
            ...state.tasks,
            [columnName]: [],
          },
        })),
    }),
    { name: "task-storage" }
  )
);
