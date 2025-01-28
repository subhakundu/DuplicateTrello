import React from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";

const Board = ({ board, moveTask }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      if (item.boardId !== board.id) {
        moveTask(item.taskId, item.boardId, board.id);
      }
    },
  });

  return (
    <div ref={drop} className="bg-white shadow rounded p-4 w-1/3">
      <h2 className="text-xl font-bold mb-4">{board.title}</h2>
      <div className="space-y-2">
        {board.tasks.map((task) => (
          <Task key={task.id} task={task} boardId={board.id} />
        ))}
      </div>
    </div>
  );
};

export default Board;
