import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  name: string;
  tasks: Task[];
}

export interface KanbanState {
  columns: Record<string, Column>;
  moveTask: (
    sourceId: string,
    destId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
  addStage: (stageName: string) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      columns: {
        "not-started": {
          id: "not-started",
          name: "Not started",
          tasks: [
            { id: "1", content: "Card 4" },
            { id: "2", content: "Card 1" },
            { id: "3", content: "Card 5" },
          ],
        },
        "in-progress": {
          id: "in-progress",
          name: "In progress",
          tasks: [{ id: "4", content: "Card 2" }],
        },
        completed: {
          id: "completed",
          name: "Completed",
          tasks: [{ id: "5", content: "Card 3" }],
        },
      },

      moveTask: (sourceId, destId, sourceIndex, destIndex) =>
        set((state) => {
          const sourceColumn = state.columns[sourceId];
          const destColumn = state.columns[destId];

          const sourceTasks = [...sourceColumn.tasks];
          const destTasks = [...destColumn.tasks];

          const [movedTask] = sourceTasks.splice(sourceIndex, 1);
          destTasks.splice(destIndex, 0, movedTask);

          return {
            columns: {
              ...state.columns,
              [sourceId]: { ...sourceColumn, tasks: sourceTasks },
              [destId]: { ...destColumn, tasks: destTasks },
            },
          };
        }),

      addStage: (stageName) =>
        set((state) => {
          const newId = stageName.toLowerCase().replace(/\s+/g, "-");
          return {
            columns: {
              ...state.columns,
              [newId]: {
                id: newId,
                name: stageName,
                tasks: [],
              },
            },
          };
        }),
    }),
    {
      name: "kanban-storage",
      partialize: (state) => ({ columns: state.columns }),
    }
  )
);
