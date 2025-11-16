import mongoose from 'mongoose'
import 'dotenv/config'
import { log } from '../utils/logger.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    log(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}
