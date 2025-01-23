import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Task {
  id: string;
  title: string;
  description?: string;
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
  addTask: (column: string, title: string, description: string) => void;
  deleteTask: (taskId: string, column: string) => void;
  addColumn: (title: string, columnName: string) => void;
  updateTask: (
    taskId: string,
    column: string,
    newTitle: string,
    newDescription: string
  ) => void;
}

const colors = ["bg-red-200", "bg-blue-200", "bg-yellow-200", "bg-green-200"];

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
            description: "Find out what our competitors are doing",
          },
          {
            id: "2",
            title: "Design mockups",
            description: "Create mockups for the new feature",
          },
        ],
        inProgress: [
          {
            id: "3",
            title: "Update documentation",
            description: "Update the documentation for the new feature",
          },
        ],
        completed: [
          {
            id: "4",
            title: "Code review",
            description: "Review code for the new feature",
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
      addTask: (column, title, description) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [column]: [
              ...state.tasks[column],
              {
                id: Math.random().toString(36).substring(7),
                title,
                description,
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
            [columnName]: {
              title,
              color: colors[Math.floor(Math.random() * colors.length)],
            },
          },
          tasks: {
            ...state.tasks,
            [columnName]: [],
          },
        })),
      updateTask: (taskId, column, newTitle, newDescription) =>
        set((state) => {
          const updatedTasks = state.tasks[column].map((task) =>
            task.id === taskId
              ? { ...task, title: newTitle, description: newDescription }
              : task
          );
          return {
            tasks: {
              ...state.tasks,
              [column]: updatedTasks,
            },
          };
        }),
    }),
    { name: "task-storage" }
  )
);
