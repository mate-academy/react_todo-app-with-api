require('dotenv').config();
const express = require('express');
const cors = require('cors');
const todoService = require('./services/todo.service.js');
const todoRouter = require('./routes/todo.route.js');

const app = express();
exports.app = app;

// Model View Controller
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/', express.json(), todoRouter);

app.get('/users', (req, res) => {
  res.send([]);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
