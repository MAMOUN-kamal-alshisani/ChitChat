const { format } = require("date-fns");
const today = format(new Date(), "h:mm a");

const AllUsers = [];
console.log(AllUsers);

const autoMessages = (userName, text) => {
  return {
    userName,
    text,
    date: today,
  };
};

const userRemove = (id) => {
  const index = AllUsers.findIndex((users) => users.id === id);

  if (index !== -1) {
    return AllUsers.splice(index, 1)[0];
  }
};

const chatJoin = (socketID, userName, room) => {
  userName = userName.trim();
  room = room.trim();

  let duplicateName = AllUsers.find(
    (user) => user.room === room && user.userName === userName
  );

  if (!userName || !room) {
    throw new Error("userName or room name is required!");
  }

  if (duplicateName) {
    throw new Error("userName is already taken");
  }
  const user = { socketID, userName, room };
  AllUsers.push(user);

  return user;
};

const currentUsers = (id) => {
  return AllUsers.find((user) => user.socketID == id);
};

const RoomUsers = (room) => {
  return AllUsers.filter((users) => users.room == room);
};
module.exports = {
  autoMessages,
  userRemove,
  chatJoin,
  currentUsers,
  RoomUsers,
};
