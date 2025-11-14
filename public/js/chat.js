// socket creation
const socket = io();

// get controls
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messageArea = document.getElementById("messageArea");

function appendMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${sender}-message`;
  messageElement.innerHTML = message;
  messageArea.appendChild(messageElement);
  messageArea.scrollTop = messageArea.scrollHeight;
}

// receive welcome message from server
socket.on("messageFromServer", (message) => {
  appendMessage(message, "server");
});

function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("messageFromClient", message);
    appendMessage(message, "client");
    messageInput.value = "";
  }
}

sendBtn.addEventListener("click", sendMessage);

// handle greeting with acknowledgment
socket.on("greeting", (message, callBackFunc) => {
  appendMessage(message, "server");
  callBackFunc({
    status: "Thanks for the greeting!",
    timestamp: new Date(),
  });
});
