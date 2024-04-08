import mongoose from "mongoose";

/* Application Modules */
import config from "./appConfig";
import { onError } from "./requestLogger";
import { logger } from "./logger";

let count = 0;
const database_url = config.db.database_url;

mongoose.set("strictQuery", false);

const DBConnectWithRetry = async () => {
  try {
    logger.info("Attempting MongoDB connection (will retry if needed)");
    await mongoose.connect(database_url);
    logger.info(`Database connected successfully to ${database_url}...`);
  } catch (error) {
    const retrySeconds = 5;
    logger.info(`MongoDB connection unsuccessful (will retry in #${count} after ${retrySeconds} seconds)`, error);
    setTimeout(DBConnectWithRetry, retrySeconds * 1000);
    onError(error);
    process.exit(1);
  }
}

export default DBConnectWithRetry;
