import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { verifyToken } from "./utils/jwt.js";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.frontendOrigins,
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  try {
    socket.user = verifyToken(token);
    return next();
  } catch {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.on("session:join", ({ sessionId }) => {
    if (!sessionId) return;
    socket.join(`session:${sessionId}`);
    socket.to(`session:${sessionId}`).emit("session:user-joined", {
      userId: socket.user.sub,
      name: socket.user.name
    });
  });

  socket.on("session:message", ({ sessionId, message }) => {
    if (!sessionId || !message) return;
    io.to(`session:${sessionId}`).emit("session:message", {
      sessionId,
      userId: socket.user.sub,
      name: socket.user.name,
      message,
      sentAt: new Date().toISOString()
    });
  });
});

server.listen(env.port, () => {
  console.log(`Smart Mentoring API listening on port ${env.port}`);
});
