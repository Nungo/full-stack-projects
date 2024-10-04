import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://admin:KpM6wT7B8x1Icb1ELmFHYk8gKZCCLR2V@dpg-crkjfnu8ii6s7380q5c0-a.frankfurt-postgres.render.com/nungo_rajd',
  ssl: { rejectUnauthorized: true },
});

pool.connect()
  .then(() => console.log('Connected successfully'))
  .catch(err => console.error('Error connecting to the database:', err))
  .finally(() => pool.end());
