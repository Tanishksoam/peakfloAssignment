import { useState } from "react";
import { useTaskStore } from "../store/TaskStore";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const Task = () => {
  const { tasks, columns, deleteTask, updateTask } = useTaskStore();
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const navigate = useNavigate();
  const [update, setUpdateTask] = useState(false);
  const { task } = useParams();
  const alltask = Object.values(tasks).flat();
  const taskIndex = alltask.findIndex((t) => t.id === task);
  const taskSelectd = alltask[taskIndex];
  const columnIndex = Object.keys(tasks).find((column) =>
    tasks[column].some((t) => t.id === task)
  );

  const updateTaskSubmit = () => {
    if (newTask.title.trim() && task && columnIndex) {
      updateTask(
        taskSelectd.id,
        columnIndex,
        newTask.title,
        newTask.description
      );

      setUpdateTask(false);
      setNewTask({ title: "", description: "" });
    }
  };

  return (
    <div className=" w-screen h-screen flex  flex-col justify-start items-start gap-10 p-20">
      <h4 className=" text-7xl font-bold ">{taskSelectd.title}</h4>
      <hr className=" w-1/2 h-[2px] bg-gray-400" />
      <div className=" w-1/2 flex flex-col items-start justify-start  gap-4">
        <h6 className="text-xl text-gray-700  text-left">Details</h6>
        <p className=" text-lg text-gray-500 p-2 border-[1px] border-gray-100 w-full rounded-lg">
          {taskSelectd.description}
        </p>
      </div>
      <div className=" flex justify-between items-center gap-2 ">
        <Pencil
          size={24}
          color="#bab"
          className=" cursor-pointer"
          onClick={() => {
            setNewTask({
              title: taskSelectd.title,
              description: taskSelectd.description || "",
            });
            setUpdateTask(true);
          }}
        />
        <Trash2
          size={24}
          color="#bab"
          className=" cursor-pointer"
          onClick={() => {
            if (columnIndex) {
              deleteTask(taskSelectd.id, columnIndex);
              navigate("/");
            }
          }}
        />
      </div>
      {update && (
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
                  setUpdateTask(false);
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
    </div>
  );
};

export default Task;
