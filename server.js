const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 9000;

app.use(express.static(join(__dirname, "public")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`A user connected - ${socket.id}`);
  // emit message to client
  socket.emit("messageFromServer", "Welcome to the chat app from the server!");
  // listen for messages from client
  socket.on("messageFromClient", (message) => {
    console.log(`Message received - ${message}`);
    //broadcast to all connected clients except sender
    socket.broadcast.emit("messageFromServer", message);
  });

  socket.emit("greeting", "Hey there! Welcome to the server", (res) => {
    console.log("The client has received the message", res);
  });
});

// start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
