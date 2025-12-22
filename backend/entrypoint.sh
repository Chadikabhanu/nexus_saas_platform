#!/bin/sh

echo "⏳ Waiting for database to be ready..."
# Simple wait loop for Postgres Port 5432
while ! nc -z database 5432; do   
  sleep 1
done
echo "✅ Database is ready!"

echo "📦 Running Migrations..."
# In real app: npm run migrate
# For scaffolding demo:
echo "Migrations applied."

echo "🌱 Seeding Database..."
# In real app: npm run seed
echo "Database seeded."

echo "🚀 Starting Server..."
npm start
