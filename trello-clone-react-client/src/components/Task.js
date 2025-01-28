import React from "react";
import { useDrag } from "react-dnd";

const Task = ({ task, boardId }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { taskId: task.id, boardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 bg-gray-200 rounded shadow-sm text-sm ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.title}
    </div>
  );
};

export default Task;
