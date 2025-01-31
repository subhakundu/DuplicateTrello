const { Kafka } = require('kafkajs');
const WebSocket = require('ws');

const kafka = new Kafka({ clientId: 'consumer-ws', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'action-group' });

const server = require('http').createServer();
const wss = new WebSocket.Server({ server });

server.listen(11080, () => console.log("WebSocket running on port 11080"))



let clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket disconnected');
    clients.delete(ws);
  });
});

// Function to broadcast messages to all connected clients
const broadcastMessage = (message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// Kafka Consumer Setup
const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'actions-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const actionData = {
        action: message.key.toString(),
        data: message.value.toString(),
      };

      console.log(`Received action:`, actionData);
      broadcastMessage(actionData);
    },
  });
};

runConsumer().catch(console.error);

console.log('WebSocket server running on ws://localhost:11080');
