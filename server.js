const express = require('express');
const {User, Incident, Character} = require('./models');
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

app.post('/api/register', async (request, response) => {
  if (!request.body.username || !request.body.password) {
    response.status(404).send("JSON body must include username, password");
    return;
  }
  const existingUser =  await User.findOne({
    where: {
      username: request.body.username
    }
  });
  if (existingUser){
    response.status(409).send("Username already taken");
    return;
  }
  const encrypted = await bcrypt.hash(request.body.password,12);
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
    response.json({
      token: token
    });
  } else {
    response.status(401).json({
      message: "Invalid username or password."
    })
  }
});

app.get('/api/current-user', async (request, response) => {
  
  const token = request.headers['jwt-token'];
  let verification;
  try{
    verification = jwt.verify(token, jwtSecret);
  }catch(e) {
    console.log(e);
  }
  const findId = await User.findOne({
    where: {
      id: verification.userId
    }
  });
  response.status(200).json(findId);
});

// app.put('/api/current-user', async (request, response) => {
//   const token = request.headers['jwt-token'];

//   const verification = jwt.verify(token, jwtSecret);
  
//   const user = await User.findOne({
//     where: {
//       id: verification.userId
//     }
//   });
//   if (user.favoritesList !== null) {
//     user.favoritesList = user.favoritesList.concat(request.body.favoritesList);
//   } else {
//     user.favoritesList = [request.body.favoritesList];
//   }
  
//   await user.save();
//   response.sendStatus(204);
// });

// app.put('/api/delete-item/', async (request, response) => {
//   const token = request.headers['jwt-token'];

//   const verification = jwt.verify(token, jwtSecret);
  
//   const user = await User.findOne({
//     where: {
//       id: verification.userId
//     }
//   });
//   user.favoritesList.splice(user.favoritesList.indexOf(request.body.favoritesList), 1);
//   user.favoritesList = user.favoritesList;
//   await user.save();

//   response.sendStatus(204);
// });

app.delete('/api/delete-item/', async (request, response) => {
  const token = request.headers['jwt-token'];

  const verification = jwt.verify(token, jwtSecret);
  
  await User.destroy({
    where: {
      id: verification.userId
    }
  });

  response.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
