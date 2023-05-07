import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import route from "./src/Routes/index.js";
import db from "./src/utils/database.js";
import errorHandler from './src/Middlewares/Error.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
//middle ware
app.use(bodyParser.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 },
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
app.listen(port, (err) => {
  if (err) {
    return console.log("ERROR", err);
  }
  console.log(`http://localhost:${port}`);
});
