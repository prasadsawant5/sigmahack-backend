'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const neo4j = require('neo4j-driver');

const keys = require('../config/keys');

const driver = neo4j.driver(
  keys.dbUri,
  neo4j.auth.basic('neo4j', keys.dbPassword)
);



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


router.get('/positive', async function(req, res, next) {
    const decoded = jwt.decode(req.headers.authorization.split(' ')[1]);

    if (decoded === null) {
        const error = new Error('Invalid Token');
        error.text = 'Invalid token';
        error.status = 401;
        return next(error);
    }

    const session = driver.session({ database: keys.database });

    try {
        const query = 'MATCH (user:User { email: $email }) SET user.isDiagnosed = $isDiagnosed RETURN user';

        const result = await session.run(query, { email: decoded.user.email, isDiagnosed: true });
        const user = result.records[0]['_fields'][0]['properties'];

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
