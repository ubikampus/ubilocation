const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()

const adminUsername = 'admin';
const adminPassword = 'July1969#Apollo11';

loginRouter.post('/', (request: any, response: any) => {
  const body = request.body;

  if (!(body.username === adminUsername && body.password === adminPassword)) {
    return response.status(401).json({ error: 'invalid username or password'});
  }

  const userForToken = {
    username: body.username
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: body.username })
})

module.exports = loginRouter;
