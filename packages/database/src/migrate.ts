import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

async function runMigrations() {
  console.log('Running migrations...');

  await migrate(db, {
    migrationsFolder: './migrations',
  });

  console.log('Migrations complete.');
}

runMigrations()
  .then(() => {
    client.end();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    client.end();
    process.exit(1);
  });
