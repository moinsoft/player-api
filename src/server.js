const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const shortid = require('shortid');
const fs = require('fs/promises');
const path = require('path');
const dbLocation = path.resolve('src', 'data.json');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

/**
 * Player Microservice
 * CRUD   -       Create Read Update Delete
 * GET    - /     - find all players  (Done 2nd)
 * POST   - /     - create a new player and save into db (Done 1st)
 * GET    - /:id  - find a single player by id (Done 3rd)
 * PUT    - /:id  - update all Data or create player  (Done 5th)
 * PATCH  - /:id  - update player only name or id or rank (Done 4th)
 * DELETE - /:id  - delete player from db  (Done 6th)
*/


// Naming Conventions

/**
 * GET      - /products         - find all available products from the system.
 * POST     - /products         - create new product.
 * GET      - /products/id      - find a single product.
 * PUT      - /products/id      - update a single product.
 * PATCH    - /products/id      - update a single product.
 * DELETE   - /products/id      - delete a single product.
*/




// DELETE - /:id  - delete player from db


app.delete('/:id', async (req, res) => {
  const id = req.params.id

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  let player = players.find(item => item.id === id);


  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }


  const newPlayers = players.filter(item => item.id !== id);

  await fs.writeFile(dbLocation, JSON.stringify(newPlayers));
  res.status(203).send();


});




// PUT    - /:id  - update all Data or create player

app.put('/:id', async (req, res) => {
  const id = req.params.id

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  let player = players.find(item => item.id === id);

  if (!player) {

    player = {
      ...req.body,
      id: shortid.generate()
    };

    players.push(player);

  } else {

    // player = {
    //   id: player.id,
    //   ...req.body
    // };


    player.name = req.body.name;
    player.country = req.body.country;
    player.rank = req.body.rank;

  }


  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);

});

//  PATCH  - /:id  - update player only name or id or rank

app.patch('/:id', async (req, res) => {
  const id = req.params.id

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  const player = players.find(item => item.id === id);

  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }


  player.name = req.body.name || player.name
  player.country = req.body.country || player.country
  player.rank = req.body.rank || player.rank

  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(200).json(player);


});

//  GET    - /:id  - find a single player by id

app.get('/:id', async (req, res) => {
  const id = req.params.id

  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);

  const player = players.find(item => item.id === id);

  if (!player) {
    return res.status(404).json({ message: 'Player Not Found' });
  }


  res.set('Cache-control', 'public, max-age=300');
  res.status(200).json(player);


});







//  POST   - /     - create a new player and save into db

app.post('/', async (req, res) => {

  const player = {
    ...req.body,
    id: shortid.generate()
  };


  
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  players.push(player)


  await fs.writeFile(dbLocation, JSON.stringify(players));
  res.status(201).json(player);

});


// GET    - /     - find all players

app.get('/', async (req, res) => {
  const data = await fs.readFile(dbLocation);
  const players = JSON.parse(data);
  res.set('Cache-control', 'public, max-age=300');
  res.status(201).json(players);
});







app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening on PORT ${port}`);
  console.log(`localhost:${port}`);
});
