const socket = io("http://localhost:3000");

//  DOM
const chatForm = document.querySelector(".messageForm");
const chatMessages = document.querySelector(".messageContainer");
const connectedUsers = document.querySelector(".users");
const roomName = document.querySelector(".roomName");
// const queryString = window.location.search;
// console.log(queryString);

const params = new URLSearchParams(location.search);
const userName = params.get("userName");
const room = params.get("room");

socket.emit("join_ROOM", { userName, room });

// get username and the room that are connected in the room

socket.on("RoomUsers", ({ room, user }) => {
  // console.log(room, user);
  usersRoom(room), connectedUserNames(user);
});

// catch on the message that was sent from the form event listener
socket.on("chat", (message) => {
  // console.log(message);
  messageOutPut(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// // to submit a message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // message form value that would be submited
  const chatmessage = e.target.message.value;
  //send the message to the server
  socket.emit("chatmessage", chatmessage);

  e.target.message.value = "";
  e.target.message.focus();
});

// const formMessage = (message) => {};

function messageOutPut(chatmessage) {
  let divs = document.createElement("div");
  divs.classList.add("messageOutPuts");
  divs.innerHTML = ` <p class="namesTimes">
 ${chatmessage.userName}
  <p>${chatmessage.date}</p>
</p>
<p>${chatmessage.text}</p>`;
  chatForm.appendChild(divs);
}

function connectedUserNames(user) {
  // connectedUsers.classList.add(user);
  connectedUsers.innerHTML = "";

  user.forEach((users) => {
    const li = document.createElement("li");
    li.innerText = users.userName;
    connectedUsers.appendChild(li);
  });
}

function usersRoom(room) {
  roomName.innerText = room;
}
