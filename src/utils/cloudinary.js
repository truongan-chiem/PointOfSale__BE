import cloudinary from "cloudinary";
import dotenv from 'dotenv'

const Cloud = cloudinary.v2;
dotenv.config();

Cloud.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});

export default Cloud;
