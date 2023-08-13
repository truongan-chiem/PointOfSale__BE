import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import {createServer} from 'http';
import { Server } from "socket.io";

import route from "./src/Routes/index.js";
import db from "./src/utils/database.js";
import errorHandler from './src/Middlewares/Error.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
const server = createServer(app);
const io = new Server(server , {
  cors: {
    origin: '*',
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})

io.on('connection', (socket) => {
  console.log("Connect socket server!!!");
  console.log("----------------------");

  socket.on("thanh toan" , (data) =>{
    io.emit("finished" , {data : "finished payment!!!"})

    console.log(data);
  })
});

//middle ware
app.use(bodyParser.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir : '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    createParentPath : true
  })
);

//Router
route(app);
//handle error 
app.use(errorHandler)
//connect db
db()
  .then(() => console.log("Connection Success!!!"))
  .catch((err) => console.log("Connection Fail!!!"));
//Run sever
server.listen(port, (err) => {
  if (err) {
    return console.log("ERROR", err);
  }
  console.log(`http://localhost:${port}`);
});
