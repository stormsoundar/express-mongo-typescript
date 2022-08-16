import { config as Config } from 'dotenv';
import { resolve } from 'path';

// option to load conf from Param store as well
Config({ path: resolve(__dirname, '../../.env') });

export const config = {
  mongo: {
    MONGO_URI: process.env.MONGO_URI || '',
  },
  server: {
    PORT: Number(process.env.PORT) || 1337,
  },
};
