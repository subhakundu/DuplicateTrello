// server.js
const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs');

const app = express();
const PORT = 9080;

app.use(cors());
app.use(express.json());

const kafka = new Kafka({ clientId: 'express-server', brokers: ['localhost:9092'] });
const producer = kafka.producer();

const initKafka = async () => {
  await producer.connect();
};

initKafka();

let boards = [
  {
    id: 1,
    title: "To Do",
    tasks: [
      { id: 1, title: "Task 1" },
      { id: 2, title: "Task 2" },
    ],
  },
  {
    id: 2,
    title: "In Progress",
    tasks: [
      { id: 3, title: "Task 3" },
    ],
  },
  {
    id: 3,
    title: "Done",
    tasks: [],
  },
];

// Get all boards
app.get("/api/boards", (req, res) => {
  res.json(boards);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const { boardId, title } = req.body;
  const board = boards.find((b) => b.id === boardId);
  if (board) {
    const newTask = {
      id: Date.now(),
      title,
    };
    board.tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.status(404).json({ message: "Board not found" });
  }
});

// Update task position
app.post("/api/move-task", (req, res) => {

  console.log(boards);
  const { taskId, sourceBoardId, targetBoardId } = req.body;

  const sourceBoard = boards.find((b) => b.id === sourceBoardId);
  const targetBoard = boards.find((b) => b.id === targetBoardId);

  if (sourceBoard && targetBoard) {
    const taskIndex = sourceBoard.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex > -1) {
      const [task] = sourceBoard.tasks.splice(taskIndex, 1);
      targetBoard.tasks.push(task);

      try {
      producer.send({
          topic: 'actions-topic',
          messages: [{ key: "new-data", value: JSON.stringify(boards) }],
        });
        res.status(200).send('Action sent to Kafka');
      } catch (error) {
        console.error('Error sending action to Kafka', error);
        res.status(500).send('Failed to send action');
      }

      //res.status(200).json({ message: "Task moved successfully" });
    } else {
      res.status(404).json({ message: "Task not found in source board" });
    }
  } else {
    res.status(404).json({ message: "Source or target board not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
