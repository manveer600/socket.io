import { Server } from "socket.io";
import dotenv from 'dotenv';
dotenv.config();


const io = new Server(process.env.SOCKET_PORT, {
  cors: {
    origin:process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    allowEIO3: true // Enable CORS for Socket.IO
  },
});

// CODE FOR SOCKET.IO IN BACKEND
io.on('connection', (socket) => {
    socket.on('get-document', async (documentId) => {
      const document = await getDocument(documentId);
      if(document){
        socket.join(documentId);
        socket.emit('load-document', document.data);
      }
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit('receive-changes', delta);
    })
      
    socket.on('save-document', async (data) =>{
      await updateDocument(documentId,data);
    } )
  });
});

