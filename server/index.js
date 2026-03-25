require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const http         = require('http');
const pool         = require('./db/pool');
const setupWebSocket = require('./websocket');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());


app.use('/api/auth',   require('./routes/auth'));
app.use('/api/posts',  require('./routes/posts'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/chat',   require('./routes/chat'));
app.use('/api/admin',  require('./routes/admin'));

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});


const server = http.createServer(app);
setupWebSocket(server);

const parsedPort = Number(process.env.PORT);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000;

if (process.env.PORT && PORT === 5000 && process.env.PORT !== '5000') {
  console.warn(`Invalid PORT value "${process.env.PORT}". Falling back to 5000.`);
}

pool.query('SELECT 1')
  .then(() => {
    console.log('✅  PostgreSQL (Neon) connected');
    server.listen(PORT, () =>
      console.log(`✅  Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  DB connection failed:', err.message);
    process.exit(1);
  });
