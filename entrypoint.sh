#!/bin/bash

# Run Prisma migrations
npx prisma migrate dev --name init

# Start the application
npm start
