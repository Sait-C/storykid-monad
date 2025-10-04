const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');

const errorHandler = require('./middleware/error');
const { Server } = require('socket.io');

// Load env vars
dotenv.config({ path: "./config/config.env"});

// Route Files
const auth = require('./routes/auth/authRoute');
const stories = require('./routes/story/storyRoute');
const storyParts = require('./routes/story/storyPartRoute');

const cors = require('cors');
const app = express();

// CORS
var corsOptions = {
  origin: process.env.APP_URL,
  optionsSuccessStatus: 200,
  credentials: true,
  origin: true
}
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// File Uploading
app.use(fileupload({ useTempFiles: true }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/stories', stories);
app.use('/api/v1/storyparts', storyParts);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.APP_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible from other files
app.set('io', io);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});