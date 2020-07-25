'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const HOST = 'http://localhost:3000/';

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}


describe('Unit Test', () => {
    importTest('Auth Test', './user/authTest.js');
});