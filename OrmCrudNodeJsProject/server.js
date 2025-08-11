const express = require('express');
const bodyParser = require('body-parser');
const db = require('./SequelizeSetup');

// CRUD Fonksiyonları
const createUser = require('./Cruds/Create');
const deleteUser = require('./Cruds/Delete');
const updateUser = require('./Cruds/Update');

const app = express();
app.use(bodyParser.json());

// Create
app.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
app.get('/users', async (req, res) => {
  try {
    const users = await db.user.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put('/users/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await deleteUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, async () => {
  await db.sequelize.sync();
  console.log('Server is running on http://localhost:5000');
});
