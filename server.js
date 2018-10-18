const express = require('express');
const { User, Incident, UserIncident } = require('./models');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5678;
const path = require('path');


const app = express();

// Static hosting for built files
app.use("/", express.static("./build/"));

const jwtSecret = 'xyz90785563'

app.use(bodyParser.json());

// user registration
app.post('/api/register', async (request, response) => {
  if (!request.body.username || !request.body.password) {
    response.status(404).send("JSON body must include username, password");
    return;
  }
  const existingUser = await User.findOne({
    where: {
      username: request.body.username
    }
  });
  if (existingUser) {
    response.status(409).send("Username already taken");
    return;
  }
  const encrypted = await bcrypt.hash(request.body.password, 12);
  await User.create({
    username: request.body.username,
    password: encrypted
  });
  const findId = await User.findOne({
    where: {
      username: request.body.username
    }
  });
  const token = jwt.sign({
    userId: findId.id
  }, jwtSecret);
  response.status(200).json(token);
});

// user login
app.post('/api/login', async (request, response) => {
  const { username, password } = request.body;
  if (!username || !password) {
    response.status(400).json({
      error: "Login requires a username and password in the request body."
    });
    return;
  }
  const existingUser = await User.findOne({
    where: {
      username: username
    }
  });

  if (existingUser === null) {
    response.status(401).json({
      message: "Invalid username or password."
    });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (isPasswordCorrect) {
    const token = jwt.sign({ userId: existingUser.id }, jwtSecret);
    response.json(token);
  } else {
    response.status(401).json({
      message: "Invalid username or password."
    })
  }
});

// current user
app.get('/api/current-user/', async (request, response) => {
  const token = request.headers['jwt-token'];
  let verification;
  try {
    verification = jwt.verify(token, jwtSecret);
  } catch (e) {
    console.log(e);
  }
  const findId = await User.findOne({
    where: {
      id: verification.userId
    }
  });
  response.status(200).json(findId);
});

// update user bookmarks
app.put('/api/current-user/', async (request, response) => {
  const token = request.headers['jwt-token'];
  const verification = await jwt.verify(token, jwtSecret);
  console.log(verification)
  const user = await User.findOne({
    where: {
      id: verification.userId
    }
  });

  if (user.bookmarks !== null) {
    user.bookmarks = user.bookmarks.concat(request.body.bookmarks);
  } else {
    user.bookmarks = [request.body.bookmarks];
  }

  await user.save();
  response.sendStatus(204);
});

// delete a bookmark
app.put('/api/delete-item/', async (request, response) => {
  const token = request.headers['jwt-token'];

  const verification = await jwt.verify(token, jwtSecret);

  const user = await User.findOne({
    where: {
      id: verification.userId
    }
  });
  user.bookmarks.splice(user.bookmarks.indexOf(request.body.bookmarks), 1);
  user.bookmarks = user.bookmarks;
  await user.save();

  response.sendStatus(204);
});

// delete a user
app.delete('/api/delete-item/', async (request, response) => {
  const token = request.headers['jwt-token'];

  const verification = await jwt.verify(token, jwtSecret);

  await User.destroy({
    where: {
      id: verification.userId
    }
  });

  response.sendStatus(204);
});

// create record in indicidents table
app.post('/api/create-incident', async (request, response) => {
  const token = request.headers['jwt-token'];
  // console.log(token);
  const userId = await jwt.verify(token, jwtSecret);
  console.log(userID);
  // const userId = verify.userId;
  const incident = await Incident.create({
    apiId: request.body.apiId,
    borough: request.body.borough,
    date: request.body.date,
    latitude: request.body.latitude,
    longitude: request.body.longitude,
    cyclistsInjured: request.body.cyclistsInjured,
    cyclistsKilled: request.body.cyclistsKilled,
    pedestriansInjured: request.body.pedestriansInjured,
    pedestriansKilled: request.body.pedestriansKilled,
    motoristsInjured: request.body.motoristsInjured,
    motoristsKilled: request.body.motoristsKilled,
    totalInjured: request.body.totalInjured,
    totalKilled: request.body.totalKilled,
  });

  // console.log(incident.id);
  // console.log('are we hitting this?')
  const userIncidentBookmark = await UserIncident.create({
    incidentId: incident.id,
    userId: userId,
  });

  response.sendStatus(200);
});

// access users' bookmarks
app.get('/api/bookmarks/:userId', async (request, response) => {
  console.log(request.params.userId);
  const bookmarks = await Incident.findAll({
    include: [
      {
        model: User,
        where: { id: request.params.userId }
      },
    ],
  });
  response.json(bookmarks);
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});