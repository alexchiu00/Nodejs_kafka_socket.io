import express from "express";
import kafka from "kafka-node";
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types/socketIo.types";

const app = express();

const Consumer = kafka.Consumer,
  client = new kafka.KafkaClient({
    kafkaHost: "localhost:9092",
  }),
  consumer = new Consumer(client, [{ topic: "topic_stream", partition: 0 }], {
    autoCommit: false,
  });

consumer.on("message", (message) => {
  console.log(message);
});

const server = app.listen(8000, () => {
  console.log("The application is listening on port 8000!");
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (client) => {
  console.log("Connected", client);

  client.on("event", () => {
    console.log("Event triggered by client");
  });

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
