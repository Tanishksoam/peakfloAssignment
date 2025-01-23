import React, { useState } from "react";
import { PlusCircle, MinusCircle, Plus } from "lucide-react";
import { CardHeader } from "./cards";
import { useTaskStore } from "../store/TaskStore";
import Card from "@mui/material/Card";
import { Tooltip } from "@mui/material";

const TaskBoard: React.FC = () => {
  const {
    columns,
    tasks,
    draggingTask,
    setDraggingTask,
    moveTask,
    addTask,
    deleteTask,
    addColumn,
    updateTask,
  } = useTaskStore();
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [taskOpen, setTaskOpen] = useState<object | null>(null);
  const [updatetask, setUpdateTask] = useState<object | null>(null);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);

  const handleDragStart = (taskId: string, sourceColumn: string): void => {
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

  const handleNewColumn = () => {
    const newColumn = prompt("Enter new column name");
    if (newColumn) {
      addColumn(newColumn, newColumn.toLowerCase());
    }
  };
  const handleOcClick = (task: string, column: string) => {
    const alltask = Object.values(tasks).flat();
    const taskIndex = alltask.findIndex((t) => t.id === task);
    setTaskOpen({ ...alltask[taskIndex], column: column });
  };

  const handleUpdateTask = () => {
    setUpdateTask(taskOpen);
    setNewTask({ title: taskOpen.title, description: taskOpen.description });
  };

  const updateTaskSubmit = () => {
    if (newTask.title.trim()) {
      updateTask(
        taskOpen.id,
        taskOpen.column,
        newTask.title,
        newTask.description
      );
      setTaskOpen(null);
      setUpdateTask(null);
      setNewTask({ title: "", description: "" });
    }
  };
  const submitTask = () => {
    if (newTask.title.trim()) {
      addTask(activeColumn!, newTask.title, newTask.description);
      setNewTask({ title: "", description: "" });
      setActiveColumn(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(columns).map(
          ([columnId, { title, color }]) => (
            console.log(title, color),
            (
              <div
                key={columnId}
                className={` p-4 rounded-lg `}
                onDrop={(e) => handleDrop(e, columnId)}
                onDragOver={handleDragOver}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className=" flex items-center gap-2">
                    <h2 className={` ${color} px-2 rounded-sm`}>{title}</h2>
                    <h4 className=" text-sm text-gray-400 font-semibold">
                      {tasks[columnId].length}
                    </h4>
                  </div>
                  <Tooltip title="Add new column">
                    <button
                      onClick={() => handleNewColumn()}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <PlusCircle className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
                <div className="space-y-2 md:max-h-80 overflow-y-auto">
                  {tasks[columnId].map((task) => (
                    <Card
                      key={task.id}
                      draggable
                      onClick={() => handleOcClick(task.id, columnId)}
                      onDragStart={() => handleDragStart(task.id, columnId)}
                      className="cursor-move bg-white flex items-center justify-between"
                    >
                      <div>
                        <CardHeader className="p-3">
                          <h3 className="font-medium text-ellipsis line-clamp-1">
                            {task.title}
                          </h3>
                        </CardHeader>
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
                <div
                  className=" flex text-gray-400 text-sm cursor-pointer hover:text-gray-600 duration-300 mt-2"
                  onClick={() => handleAddTask(columnId)}
                >
                  <Plus size={20} /> New
                </div>
              </div>
            )
          )
        )}
      </div>
      {taskOpen !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{taskOpen?.title}</h2>
            <h2 className="text-md font-normal mb-4">
              {taskOpen?.description}
            </h2>
            <p
              className="text-sm text-gray-400 underline cursor-pointer "
              onClick={() => handleUpdateTask()}
            >
              edit details
            </p>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setTaskOpen(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTask(taskOpen.id, taskOpen.column);
                  setTaskOpen(null);
                }}
                className="px-4 py-2 bg-red-200 text-white rounded"
              >
                delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {updatetask !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Task Details</h2>
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
              placeholder="Description"
              className="w-full border p-2 mb-2"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setTaskOpen(null);
                  setUpdateTask(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateTaskSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
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
              placeholder="Description"
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
