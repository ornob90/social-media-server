import * as dotenv from 'dotenv';
dotenv.config();
export const mongodbConfig = {
  uri: process.env.MONGO_URI,
};
