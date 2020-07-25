'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const neo4j = require('neo4j-driver');

const keys = require('../config/keys');

const driver = neo4j.driver(
  keys.dbUri,
  neo4j.auth.basic('neo4j', keys.dbPassword)
);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'ok' });
});

router.post('/signup', async function(req, res, next) {
  const body = req.body;

  if (body.name === null || body.name === undefined || body.name === '') {
    const error = new Error('Invalid name');
    error.text = 'Invalid name';
    error.status = 400;
    return next(error);
  }

  if (body.email === null || body.email === undefined || body.email === '') {
    const error = new Error('Invalid email');
    error.text = 'Invalid email';
    error.status = 400;
    return next(error);
  }

  if (body.password === null || body.password === undefined || body.password === '') {
    const error = new Error('Invalid password');
    error.text = 'Invalid password';
    error.status = 400;
    return next(error);
  }

  if (body.confirmPassword === null || body.confirmPassword === undefined || body.confirmPassword === '') {
    const error = new Error('Invalid confirm password');
    error.text = 'Invalid confirm password';
    error.status = 400;
    return next(error);
  }

  if (body.password !== body.confirmPassword) {
    const error = new Error('Password and confirm password should match');
    error.text = 'Password and confirm password should match';
    error.status = 400;
    return next(error);
  }

  if (body.age === null || body.age === undefined || body.age === '') {
    const error = new Error('Invalid age');
    error.text = 'Invalid age';
    error.status = 400;
    return next(error);
  }

  if (body.gender === null || body.gender === undefined || body.gender === '') {
    const error = new Error('Invalid gender');
    error.text = 'Invalid gender';
    error.status = 400;
    return next(error);
  }

  if (body.bluetoothMac === null || body.bluetoothMac === undefined || body.bluetoothMac === '') {
    const error = new Error('Invalid Bluetooth MAC Address');
    error.text = 'Invalid Bluetooth MAC Address';
    error.status = 400;
    return next(error);
  }

  const session = driver.session({ database: keys.database });

  try {
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(body.password, salt);

    const userExistsQuery = 'MERGE (user:User { email: $email }) RETURN user AS u';

    const userRes = await session.run(userExistsQuery, { email: body.email });
    console.log(userRes.records[0]['_fields'][0]['properties']);

    if (userRes.records[0]['_fields'][0]['properties']['password'] !== undefined && userRes.records[0]['_fields'][0]['properties']['password'] !== null) {
      const user = userRes.records[0]['_fields'][0]['properties'];

      const token = jwt.sign({user: user}, keys.secret);
      res.status(200).json({ message: 'User already exists', object: { token: token }});
    } else {
      const query = 'CREATE (user:User { name: $name, email: $email, password: $password, age: $age, gender: $gender, bluetoothMac: $bluetoothMac }) RETURN user';

      const result = await session.run(query, { 
        name: body.name, email: body.email, password: hash, age: parseInt(body.age), gender: body.gender, bluetoothMac: body.bluetoothMac });

      const user = result.records[0]['_fields'][0]['properties'];
      const token = jwt.sign({user: user}, keys.secret);

      res.status(201).json({ message: 'ok', object: { token: token }});
    }
  } catch (err) {
    console.error(err);
    const error = new Error('Server error');
    error.text = 'Server error';
    error.status = 400;

    session.close();
    return next(error);
  } finally {
    session.close();
  }
});


router.post('/login', async function(req, res, next) {
  const body = req.body;

  if (body.email === null || body.email === undefined || body.email === '') {
    const error = new Error('Invalid email');
    error.text = 'Invalid email';
    error.status = 400;
    return next(error);
  }

  if (body.password === null || body.password === undefined || body.password === '') {
    const error = new Error('Invalid password');
    error.text = 'Invalid password';
    error.status = 400;
    return next(error);
  }

  const session = driver.session({ database: keys.database });

  try {
    const query = 'MERGE (user:User { email: $email }) RETURN user';

    const result = await session.run(query, { email: body.email });
    const user = result.records[0]['_fields'][0]['properties'];

    if (!bcrypt.compareSync(body.password, user.password)) {
      const error = new Error('Incorrect password');
      error.text = 'Incorrect password';
      error.status = 401;
      return next(error);
    }

    const token = jwt.sign({user: user}, keys.secret);

    res.status(200).json({ message: 'ok', object: { token: token }});
  } catch (err) {
    console.error(err);
    const error = new Error('Server error');
    error.text = 'Server error';
    error.status = 400;

    session.close();
    return next(error);
  } finally {
    session.close();
  }


});

module.exports = router;
