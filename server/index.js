const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

function handleMessage(bytes, uuid) {
  //message = {"x":0, "y":100}
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;

  broadcast();

  console.log(`${user.username} updated state: ${JSON.stringify(user.state)}`);
}

function handleDisconnect(uuid) {
  delete connections[uuid];
  delete users[uuid];
  //maybe send user gone message

  broadcast();
}

wsServer.on("connection", (connection, request) => {
  //ws://localhost:8000?username=Andrew

  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username);

  connections[uuid] = connection;

  users[uuid] = {
    username: username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleDisconnect(uuid));
});

server.listen(port, () => {
  console.log(`Ws server is running on port ${port}`);
});
