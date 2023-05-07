import cloudinary from "cloudinary";
import dotenv from 'dotenv'

const Cloud = cloudinary.v2;
dotenv.config();

Cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default Cloud;
