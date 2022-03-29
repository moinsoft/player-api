const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shortid = require('shortid');
const fs = require('fs/promises');
const path = require('path');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/**
 * Player Microservice
 * CRUD   -       Create Read Update Delete
 * GET    - /     - find all players
 * POST   - /     - create a new player and save into db
 * GET    - /:id  - find a single player
 * PUT    - /:id  - update or create player
 * PATCH  - /:id  - update player
 * DELETE - /:id  - delete player from db
 */



//  POST   - /     - create a new player and save into db

app.post('/', async (req, res) => {
  const player = {
    ...req.body,
    id: shortid.generate()
  };


  const dbLocation = path.resolve('src', 'data.json')
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  players.push(player)


  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(201).json(player);

});







app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
  console.log(`localhost:${port}`);
});
