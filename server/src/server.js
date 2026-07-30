const http = require('http');
require('dotenv').config();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const app = require('./app');
const { supabaseAdmin, isSupabaseServerConfigured } = require('./config/supabase');
const { initSocket } = require('./sockets/socket');

// Verify Supabase connection
if (isSupabaseServerConfigured()) {
  console.log('✅ Supabase Admin client ready');
} else {
  console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — running in degraded mode');
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Bind Socket.io instance to Express app context for access in controllers
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5000;
const serverInstance = server.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  serverInstance.close(() => {
    process.exit(1);
  });
});
