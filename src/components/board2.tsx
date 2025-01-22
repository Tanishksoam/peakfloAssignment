import React, { useState } from "react";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "./cards";
import { useTaskStore } from "../store/TaskStore";

const TaskBoard: React.FC = () => {
  const {
    tasks,
    draggingTask,
    setDraggingTask,
    moveTask,
    addTask,
    deleteTask,
  } = useTaskStore();
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

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

    moveTask(draggingTask.id, draggingTask.sourceColumn, targetColumn);
    setDraggingTask(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleAddTask = (column: string) => {
    setActiveColumn(column);
  };

  const submitTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      addTask(activeColumn!, newTask.title, newTask.description);
      setNewTask({ title: "", description: "" });
      setActiveColumn(null);
    }
  };

  const columns = {
    todo: { title: "To Do", color: "bg-gray-100" },
    inProgress: { title: "In Progress", color: "bg-blue-50" },
    review: { title: "Review", color: "bg-yellow-50" },
    done: { title: "Done", color: "bg-green-50" },
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
                onClick={() => handleAddTask(columnId)}
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
                  className="cursor-move bg-white flex items-start justify-between"
                >
                  <div>
                    <CardHeader className="p-3">
                      <h3 className="font-medium">{task.title}</h3>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 text-sm text-gray-600">
                      {task.description}
                    </CardContent>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id, columnId)}
                    className="text-orange-700 hover:text-red-500 cursor-pointer p-2"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeColumn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="w-full border p-2 mb-2"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              className="w-full border p-2 mb-2"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setActiveColumn(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitTask}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
