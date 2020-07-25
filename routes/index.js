const express = require('express');
const router = express.Router();

const neo4j = require('neo4j-driver');

const keys = require('../config/keys');

const driver = neo4j.driver(
  keys.dbUri,
  neo4j.auth.basic('neo4j', keys.dbPassword)
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: 'ok' });
});

router.delete('/', async function(req, res, next) {
  try {
    const query = 'MATCH (user:User) DETACH DELETE user';
    const session = driver.session({ database: keys.database });

    const result = await session.run(query);

    res.status(200).json({ message: 'ok', object: result });
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
