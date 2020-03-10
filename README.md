# CSV processor

CSV file processor. It uploads a given file to AWS S3 bucket and processes it. Preview of the file is stored in the database. Processing progress is shared via WebSockets. The project contains a couple simple unit tests just as an example.

## Prerequisites
npm, node, mongodb, redis, aws credentials

## Instalation

 - clone repository
 - `npm install`
 - `cp .env.dist .env`
 - update .env with correct credentials

## Run

 - `npm start` or `node app.js`

## Run test

 - `npm test` or `jest`

## Endpoints

 - **GET** - /api/file/:id
 - **POST** - /api/file

## WebSocket events

 - **fileProcessProgress**
