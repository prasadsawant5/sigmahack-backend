'use strict';

const chai = require('chai');
const assert = chai.assert

const chaiHttp = require('chai-http');
const should = require('should');

const path = require('path');
const fs = require('fs');

chai.use(chaiHttp);

const storageFactory = require('../factory/storageFactory');

const HOST = 'http://localhost:3000/';

it ('Signup A', function(done) {
    const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

    const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
    if (fs.existsSync(filePath)) {
        const payloads = JSON.parse(fs.readFileSync(filePath));

        for (let payload of payloads) {
            const name= payload.name;

            // if (name === 'A') {
                chai.request(HOST)
                    .post('users/signup')
                    .send(payload)
                    .end(function(err, res) {
                        if (err) {
                            console.error(err);
                        } else if (res.status === 201) {
                            const token = res.body.object.token;

                            if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
                                let line = '{ "' + name + '": "' + token + '" },\n';
                                fs.appendFileSync(tokenFile, line);
                            }
                        }
                        (res.status).should.be.exactly(201);                   
                    });
            // }
        }
    }
    done();
});


// it ('Signup D', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'D') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });


// it ('Signup P', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'P') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });


// it ('Signup R', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'R') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });


// it ('Signup S', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'S') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });



// it ('Signup W', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'W') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });



// it ('Signup Z', function(done) {
//     const tokenFile = path.join(__dirname, '..', 'seed', 'tokens');

//     const filePath = path.join(__dirname, '..', 'seed', 'signup.json');
//     if (fs.existsSync(filePath)) {
//         const payloads = JSON.parse(fs.readFileSync(filePath));

//         for (let payload of payloads) {
//             const name= payload.name;

//             if (name === 'Z') {
//                 chai.request(HOST)
//                     .post('users/signup')
//                     .send(payload)
//                     .end(function(err, res) {
//                         if (err) {
//                             console.error(err);
//                         } else if (res.status === 201) {
//                             const token = res.body.object.token;

//                             if (name === 'A' || name === 'D' || name === 'P' || name === 'R' || name === 'S' || name === 'W' || name === 'Z') {
//                                 let line = '{ "' + name + '": "' + token + '" },\n';
//                                 fs.appendFileSync(tokenFile, line);
//                             }
//                         }
//                         (res.status).should.be.exactly(201);                   
//                         done();
//                     });
//                 }
//         }
//     }
// });