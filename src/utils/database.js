import mongoose from "mongoose";

async function database() {
   await mongoose.connect(process.env.DB_CONNECT);
  }
export default database;