import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./components/Board";

function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9080/api/boards").then((response) => {
      setBoards(response.data);
    });
  }, []);

  const moveTask = (taskId, sourceBoardId, targetBoardId) => {
    axios
      .post("http://localhost:9080/api/move-task", {
        taskId,
        sourceBoardId,
        targetBoardId,
      })
      .then(() => {
        setBoards((prevBoards) => {
          const updatedBoards = [...prevBoards];
          const sourceBoard = updatedBoards.find((b) => b.id === sourceBoardId);
          const targetBoard = updatedBoards.find((b) => b.id === targetBoardId);

          if (sourceBoard && targetBoard) {
            const taskIndex = sourceBoard.tasks.findIndex((t) => t.id === taskId);
            const [task] = sourceBoard.tasks.splice(taskIndex, 1);
            targetBoard.tasks.push(task);
          }

          return updatedBoards;
        });
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Trello Clone</h1>
        <div className="flex gap-4">
          {boards.map((board) => (
            <Board key={board.id} board={board} moveTask={moveTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;

