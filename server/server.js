import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CodeBlock from './model/CodeBlock.js';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { connectDB } from './db.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {cors: {origin: process.env.ORIGIN}});
var codeBlock = null;
var numOfParticipants = 0;

connectDB();

app.get('/', async (req, res) => {
  const codeblocks = await CodeBlock.find();
  res.send(codeblocks);
});

app.get('/codeblock/:id', async (req, res) => {
  codeBlock = codeBlock ?? await CodeBlock.findById(req.params.id);
  console.log(codeBlock);
  res.send(codeBlock);
});

io.on('connection', (socket) => {
  console.log(`a user connected ${socket.id}`);
  socket.emit('updateRole', (numOfParticipants === 0));
  numOfParticipants++;
  io.emit('updateNumOfParticipents', numOfParticipants);

  socket.on('updateCodeInServer', (data) => {
    console.log(data.currentCode);
    console.log(codeBlock.solutionCode);
    (data.currentCode === codeBlock.solutionCode) && io.emit('updateIsMatch');
    socket.broadcast.emit('updateCodeInClient', data);
    codeBlock.currentCode = data.currentCode;
  });

  socket.on('exitCodeBlock', (isMentor) => {
    if (isMentor) {
      io.emit('releaseClient');
      codeBlock = null;
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    numOfParticipants--;
    io.emit('updateNumOfParticipents', numOfParticipants);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server running on PORT ${process.env.PORT}`);
});