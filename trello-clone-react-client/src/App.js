import React, { useState, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./components/Board";

function App() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9080/api/boards');
        console.log("Begining structure");
        console.log(response.data);
        setBoards(response.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchData();
    // Open WebSocket connection
    const ws = new WebSocket('ws://localhost:11080');

    ws.onmessage = (event) => {
      const newBoard = JSON.parse(event.data);
      console.log("Next");
      console.log(newBoard.data);
      setBoards(JSON.parse(newBoard.data)); // Add new board to list
    };

    ws.onopen = () => console.log('Connected to WebSocket server');
    ws.onclose = () => console.log('Disconnected from WebSocket server');
    
    return () => ws.close(); // Cleanup WebSocket on unmount

    // console.log("Starting");
    // ws.onmessage = (event) => {
    //   console.log("Received");
    //   const message = JSON.parse(event.data);
    //   if (!message || Object.keys(message).length === 0) {
    //         axios.get("http://localhost:9080/api/boards").then((response) => {
    //           setBoards(response.data);
    //         }); 
    //   }
    //   // setBoards((prev) => [...prev, message]);
    // };

   
    
    // return () => ws.close();
  }, []);

  setTimeout(() => {

  }, 5000);

  const moveTask = (taskId, sourceBoardId, targetBoardId) => {
    axios.post("http://localhost:9080/api/move-task", {
        taskId,
        sourceBoardId,
        targetBoardId,
      })
      .then(() => {
        console.log("Done");
        // setBoards((prevBoards) => {
        //   const updatedBoards = [...prevBoards];
        //   const sourceBoard = updatedBoards.find((b) => b.id === sourceBoardId);
        //   const targetBoard = updatedBoards.find((b) => b.id === targetBoardId);

        //   if (sourceBoard && targetBoard) {
        //     const taskIndex = sourceBoard.tasks.findIndex((t) => t.id === taskId);
        //     const [task] = sourceBoard.tasks.splice(taskIndex, 1);
        //     targetBoard.tasks.push(task);
        //   }

        //   console.log("Subhasish:");
        //   console.log(updatedBoards);
        //   updatedBoards.map((board) => {
        //     console.log(board.id + " " + board.title);
        //     console.log(board.tasks);
        //     // board.tasks.map((task) => {
        //     //   console.log(task.id + " " + task.title);
        //     // })
        //     board.tasks.forEach(task => {
        //       console.log(task.id + " " + task.title); 
        //     });
        //   })
        //   return updatedBoards;
        // });
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Trello Clone 1</h1>
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

