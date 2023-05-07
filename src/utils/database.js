import mongoose from "mongoose";

async function database() {
   await mongoose.connect(process.env.db_connect);
  }
export default database;