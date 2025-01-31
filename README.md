# Clone of Trello
In this project, I have created a todo list (like Trello). It allows real time update of the list, which will be reflected to all the opened sessions. It does not have any persistance layer as of now and does not have any session support.

[Screen Recording Link](https://drive.google.com/file/d/18flxFmJ8okDQu0kRkvAyvtD7mv2bBIPh/view?usp=drive_link)

## Set up Steps
1. Checkout the project.
2. Run Express JS server
```
cd DuplicateTrello/expressserver
node index.js
```
3. Start React Project
```
cd ../trello-clone-react-client
npm run start
```
4. Setup Kafka using from Scratch. I used kafka_2.12-3.9.0.
5. Start the Kafka: Start Zookeeper
```
bin/zookeeper-server-start.sh config/zookeeper.properties
```
6. Start Kafka Broker
```
bin/kafka-server-start.sh config/server.properties
```
7. Start Websocket server, that consumes data from Kafka and streams to multiple open windows
```
cd ../kafkacontainer
node consumer-ws.js
```
