import React, { useState } from "react";

import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./cards";


interface Task {
  id: string;
  title: string;
  description: string;
}

interface ColumnConfig {
  title: string;
  color: string;
}

interface Columns {
  [key: string]: ColumnConfig;
}

interface TaskState {
  [key: string]: Task[];
}

interface DraggingTask {
  id: string;
  sourceColumn: string;
}

const TaskBoard: React.FC = () => {
  // Initial state with some example tasks
  const [tasks, setTasks] = useState<TaskState>({
    todo: [
      {
        id: "1",
        title: "Research competitors",
        description: "Analyze main competitors",
      },
      {
        id: "2",
        title: "Design mockups",
        description: "Create initial designs",
      },
    ],
    inProgress: [
      {
        id: "3",
        title: "Update documentation",
        description: "Review and update docs",
      },
    ],
    review: [{ id: "4", title: "Code review", description: "Review PR #123" }],
    done: [
      { id: "5", title: "Setup project", description: "Initial project setup" },
    ],
  });

  const [draggingTask, setDraggingTask] = useState<DraggingTask | null>(null);


  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
    sourceColumn: string
  ): void => {
    setDraggingTask({ id: taskId, sourceColumn });
  };


  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetColumn: string
  ): void => {
    e.preventDefault();
    if (!draggingTask) return;

    const { id, sourceColumn } = draggingTask;
    if (sourceColumn === targetColumn) return;

    setTasks((prev) => {
      const task = prev[sourceColumn].find((t) => t.id === id);
      if (!task) return prev;

      const newSourceTasks = prev[sourceColumn].filter((t) => t.id !== id);

      return {
        ...prev,
        [sourceColumn]: newSourceTasks,
        [targetColumn]: [...prev[targetColumn], task],
      };
    });

    setDraggingTask(null);
  };


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };


  const columns: Columns = {
    todo: { title: "To Do", color: "bg-gray-100" },
    inProgress: { title: "In Progress", color: "bg-blue-50" },
    review: { title: "Review", color: "bg-yellow-50" },
    done: { title: "Done", color: "bg-green-50" },
  };


  const addNewTask = (column: string): void => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title: "New Task",
      description: "Click to edit",
    };

    setTasks((prev) => ({
      ...prev,
      [column]: [...prev[column], newTask],
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(columns).map(([columnId, { title, color }]) => (
          <div
            key={columnId}
            className={`${color} p-4 rounded-lg`}
            onDrop={(e) => handleDrop(e, columnId)}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">{title}</h2>
              <button
                onClick={() => addNewTask(columnId)}
                className="text-gray-600 hover:text-gray-900"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {tasks[columnId].map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, columnId)}
                  className="cursor-move bg-white"
                >
                  <CardHeader className="p-3">
                    <h3 className="font-medium">{task.title}</h3>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-sm text-gray-600">
                    {task.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
