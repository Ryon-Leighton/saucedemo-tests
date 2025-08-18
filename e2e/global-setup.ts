import * as dotenv from 'dotenv';
import path from 'path';

export default async () => {
  if (!process.env.__ENV_LOADED__) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    process.env.__ENV_LOADED__ = '1';
  }
};
