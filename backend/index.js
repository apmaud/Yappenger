import express from 'express';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import connectDB from './config/db.js';
import userRoutes from './routes/users.js'
import chatRoutes from './routes/chats.js'
import messageRoutes from './routes/messages.js'
import { Server} from "socket.io"
import path from "path"

// CONFIGURATIONS
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(helmet
  ({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ["'self'", "http://res.cloudinary.com/dhqmtc4wx/image/upload/"],
        'default-src': ["'self'", "http://localhost:8000/"]
      }
    }
  })
);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({credentials: true, origin:'http://127.0.0.1:5173'}));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);




const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname1, '../frontend/dist')));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  })
} else {
  app.get("/", (req, res) => {
    res.send("API is running but not in production mode");
  });
}


const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}...`)
});



const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        // credentials: true,
        origin: "http://127.0.0.1:5173",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      if(!userData) {
        console.log("USER DISCONNECTED");
        socket.leave();
      } else {
        socket.join(userData._id);
        socket.emit("connected");
      }
    });
    
    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });
    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  
    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id === newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message received", newMessageRecieved);
      });
    });
    
    socket.on("disconnect", () => {
      if (socket.userData) {
        console.log("USER DISCONNECTED");
        socket.leave(socket.userData._id);
      } else {
        console.log("User disconnected without userData");
      }
    });
  });






