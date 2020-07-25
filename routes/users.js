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
    console.log('name');
    const error = new Error('Invalid name');
    error.text = 'Invalid name';
    error.status = 400;
    return next(error);
  }

  if (body.email === null || body.email === undefined || body.email === '') {
    console.log('email');
    const error = new Error('Invalid email');
    error.text = 'Invalid email';
    error.status = 400;
    return next(error);
  }

  if (body.password === null || body.password === undefined || body.password === '') {
    console.log('password');
    const error = new Error('Invalid password');
    error.text = 'Invalid password';
    error.status = 400;
    return next(error);
  }

  if (body.confirmPassword === null || body.confirmPassword === undefined || body.confirmPassword === '') {
    console.log('confirmPassword');
    const error = new Error('Invalid confirm password');
    error.text = 'Invalid confirm password';
    error.status = 400;
    return next(error);
  }

  if (body.password !== body.confirmPassword) {
    console.log('password mismatch');
    const error = new Error('Password and confirm password should match');
    error.text = 'Password and confirm password should match';
    error.status = 400;
    return next(error);
  }

  if (body.age === null || body.age === undefined || body.age === '') {
    console.log('age');
    const error = new Error('Invalid age');
    error.text = 'Invalid age';
    error.status = 400;
    return next(error);
  }

  if (body.gender === null || body.gender === undefined || body.gender === '') {
    console.log('gender');
    const error = new Error('Invalid gender');
    error.text = 'Invalid gender';
    error.status = 400;
    return next(error);
  }

  if (body.latitude === null || body.latitude === undefined || body.latitude === '') {
    console.log('latitude');
    const error = new Error('Invalid latitude');
    error.text = 'Invalid latitude';
    error.status = 400;
    return next(error);
  }

  if (body.longitude === null || body.longitude === undefined || body.longitude === '') {
    console.log('longitude');
    const error = new Error('Invalid longitude');
    error.text = 'Invalid longitude';
    error.status = 400;
    return next(error);
  }

  if (body.bluetoothMac === null || body.bluetoothMac === undefined || body.bluetoothMac === '') {
    console.log('bluetoothMac');
    const error = new Error('Invalid Bluetooth MAC Address');
    error.text = 'Invalid Bluetooth MAC Address';
    error.status = 400;
    return next(error);
  }

  const session = driver.session({ database: keys.database });

  try {
    const salt = bcrypt.genSaltSync(5);
    const hash = bcrypt.hashSync(body.password, salt);

    const userExistsQuery = 'MATCH (user:User { email: $email }) RETURN user AS u';

    const userRes = await session.run(userExistsQuery, { email: body.email });

    if (userRes.records.length !== 0 && userRes.records[0]['_fields'][0]['properties']['password'] !== undefined && userRes.records[0]['_fields'][0]['properties']['password'] !== null) {
      const user = userRes.records[0]['_fields'][0]['properties'];

      const token = jwt.sign({user: user}, keys.secret);
      res.status(200).json({ message: 'User already exists', object: { token: token }});
    } else {
      const query = 'CREATE (user:User { name: $name, email: $email, password: $password, age: $age, gender: $gender, bluetoothMac: $bluetoothMac, isDiagnosed: $isDiagnosed, latitude: $latitude, longitude: $longitude, firebaseId: $firebaseId }) RETURN user';

      const result = await session.run(query, { 
        name: body.name, 
        email: body.email, 
        password: hash, 
        age: parseInt(body.age), 
        gender: body.gender, 
        bluetoothMac: body.bluetoothMac,
        isDiagnosed: false,
        latitude: body.latitude,
        longitude: body.longitude,
        firebaseId: body.firebaseId 
      });

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
    const query = 'MATCH (user:User { email: $email }) RETURN user';

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


/**
 * @description Express authorization middleware.
 * 
 * @param {HttpRequest} req - Express HTTP request object
 * @param {HttpResponse} res - Express HTTP response object
 * @returns {ExpressMiddleware} next - Express middleware
 */
router.use('/', function(req, res, next) {
  if (!req.headers.authorization) {
    const error = new Error(process.env.NODE_ENV === 'dev' ? messages.errors.tokenMissing : 'Unauthorized');
    error.text = messages.errors.tokenMissing;
    error.status = 401;
    return next(error);
  }

  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, keys.secret, function(err, decoded) {
    if (err) {
      console.error(err);

      const error = new Error('Invalid Token');
      error.text = 'Invalid token';
      error.status = 401;
      return next(error);
    }

    next();
  });
});


router.post('/contact', async function(req, res, next) {
  const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);

  if (decoded === null) {
      const error = new Error('Invalid Token');
      error.text = 'Invalid token';
      error.status = 401;
      return next(error);
  }

  const body = req.body;

  if (body.bluetoothMac === null || body.bluetoothMac === undefined || body.bluetoothMac === '') {
    const error = new Error('Invalid bluetooth MAC');
    error.text = 'Invalid bluetooth MAC';
    error.status = 400;
    return next(error);
  }

  if (body.latitude === null || body.latitude === undefined || body.latitude === '') {
    const error = new Error('Invalid latitude');
    error.text = 'Invalid latitude';
    error.status = 400;
    return next(error);
  }

  if (body.longitude === null || body.longitude === undefined || body.longitude === '') {
    const error = new Error('Invalid longitude');
    error.text = 'Invalid longitude';
    error.status = 400;
    return next(error);
  }

  const session = driver.session({ database: keys.database });

  try {
    const readRelQuery = 'MATCH (u1:User { email: $email })-[rel:HAD_CONTACT { bluetoothMac: $bluetoothMacRel }]->(u2:User { bluetoothMac: $bluetoothMac }) RETURN rel';
    const searchRes = await session.run(readRelQuery, { 
      email: decoded.user.email, 
      bluetoothMacRel: body.bluetoothMac, 
      bluetoothMac: body.bluetoothMac 
    });

    console.log(searchRes.records);
    if (searchRes.records.length !== 0) {
      const rel = result.records[0]['_fields'][0]['properties'];

      const currentEpoch = new Date().getTime() / 1000;

      if (currentEpoch - rel.epochs <= 5 * 60) {
        session.end();
        return res.status(200).json({ message: 'relation already exists', object: rel });
      }
    }

    const query = 'MATCH (u1:User) AND (u2: User) WHERE u1.email = $email AND u2.bluetoothMac: $bluetoothMac ' +
        'CREATE (u1)-[rel:HAD_CONTACT { epochs: $epochs, latitude: $latitude, longitude: $longitude }]->(u2) RETURN rel';

    const result = await session.run(query, { 
      email: decoded.user.email, 
      bluetoothMac: body.bluetoothMac, 
      epochs: new Date().getTime() / 1000, 
      latitude: body.latitude, 
      longitude: body.longitude 
    });

    const rel = result.records[0]['_fields'][0]['properties'];
    console.log(rel);

    // TODO: Check if either of the two parties are COVID +ve and if yes, then send notification to the other party

    res.status(200).json({ message: 'ok', object: result});
    session.close();
  } catch (err) {
    console.error(err);
    const error = new Error('Server error');
    error.text = 'Server error';
    error.status = 400;

    session.close();
    return next(error);
  }
});

module.exports = router;
