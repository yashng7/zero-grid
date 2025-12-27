import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

class DatabaseClient {
  private static instance: ReturnType<typeof drizzle>;

  private constructor() {}

  public static getInstance() {
    if (!DatabaseClient.instance) {
      const connectionString = process.env.DATABASE_URL!;
      const client = postgres(connectionString);
      DatabaseClient.instance = drizzle(client, { schema });
    }
    return DatabaseClient.instance;
  }
}

export const db = DatabaseClient.getInstance();