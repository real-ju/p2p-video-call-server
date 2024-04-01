import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
  },
});

const clientsCountLimit = 2;

io.on("connection", (socket) => {
  const clientsCount = io.engine.clientsCount;
  if (clientsCount > clientsCountLimit) {
    socket.disconnect();
    return;
  }
  console.log(socket.id);
  socket.on("checkOnlineStatus", () => {
    const clientsCount = io.engine.clientsCount;
    socket.emit("checkOnlineStatus", clientsCount === 2);
  });
  socket.on("launchCall", () => {
    io.emit("call");
  });
  socket.on("stopCall", (peerType) => {
    // peerType 终止通话者是发起端还是接收端
    io.emit("stopCall", peerType);
  });
  socket.on("acceptCall", () => {
    io.emit("acceptCall");
  });
  socket.on("sendOffer", (offer) => {
    io.emit("sendOffer", offer);
  });
  socket.on("sendAnswer", (answer) => {
    io.emit("sendAnswer", answer);
  });
  socket.on("sendCandidate", (candidate, peerType) => {
    io.emit("sendCandidate", candidate, peerType);
  });
});

io.listen(3000);
