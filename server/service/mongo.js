/**
 * mongo db
 * @author Philip
 */
import config from '../config/mongo.js';
import mongoose from 'mongoose';

/**
 * 连接mongodb
 */
export default async function connectMongoDB() {
    await mongoose.connect(`mongodb://${config.username}:${config.password}@${config.host}:${config.port}/?authSource=${config.databaseName}`);
}