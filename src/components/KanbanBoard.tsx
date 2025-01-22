import React, { useState } from "react";
import { useKanbanStore } from "../store/kanbanStore";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

const KanbanBoard: React.FC = () => {
  const { columns, moveTask, addStage } = useKanbanStore();
  const [newStage, setNewStage] = useState<string>("");

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    moveTask(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleAddStage = () => {
    if (newStage.trim()) {
      addStage(newStage);
      setNewStage("");
    }
  };

  return (
    <div className="p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto">
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`w-64 p-4 rounded-md ${
                    snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <h3 className="p-2 rounded-md bg-gray-300 font-bold text-center">
                    {column.name} ({column.tasks.length})
                  </h3>
                  <div className="min-h-[150px]">
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 my-2 rounded-md shadow-md border ${
                              snapshot.isDragging ? "bg-green-200" : "bg-white"
                            }`}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                  <button className="text-gray-500 mt-2 hover:text-gray-700">
                    + New
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <div className="mt-6">
        <input
          type="text"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          placeholder="Enter new stage"
          className="border p-2 rounded-md"
        />
        <button
          onClick={handleAddStage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Stage
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
