require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./src/routes/routes');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/webhook', routes);

// Health check
app.get('/', (req, res) => {
  res.send('WhatsApp Chatbot is running');
});

// Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});