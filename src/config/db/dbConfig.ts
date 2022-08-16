import mongoose from 'mongoose';
import chalk from 'chalk';
import { config } from '../../loaders/config';
import Logging from '../../library/Logging';

mongoose.Promise = Promise;

mongoose.connection.on('connected', () =>
  Logging.info(`MongoDB Connection Established`)
);

mongoose.connection.on('reconnected', () =>
  Logging.info(`MongoDB Connection Reestablished`)
);

mongoose.connection.on('disconnected', () =>
  Logging.error(`MongoDB Connection Disconnected`)
);

mongoose.connection.on('close', () =>
  Logging.error(`MongoDB Connection Closed`)
);

mongoose.connection.on('error', (error) => {
  Logging.error('MongoDB ERROR: ' + error);

  process.exit(1);
});

const connectDB = async () => {
  const connectionUri = config.mongo.MONGO_URI;

  await mongoose.connect(connectionUri, {
    retryWrites: true,
    w: 'majority',
  });
};

export default connectDB;
