require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/db');

async function run() {
  try {
    const sqlPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Running Migration SQL...');
    await pool.query(sql);
    console.log('✅ Tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

run();