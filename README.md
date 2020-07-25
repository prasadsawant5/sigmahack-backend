# Contact Tracing using Neo4J (SigmaHack Hackathon)

### Dependencies:
1. [NodeJS](https://nodejs.org/en/download/): Please download and install the latest stable version of NodeJS based on your operating system.
2. [Neo4J](https://neo4j.com/download/): Please download and install Neo4J based on your operating system.
3. Open terminal and `cd` into the root directory of this project `eg: cd ~/sigmahack-backend`
4. Then run `NODE_ENV='dev' npm start`. Running this command will start the NodeJS API server.

### API Endpoints:
1. Signup:
For signing-up, make an HTTP POST request to the following URL with the following payload,

URL
```
http://<ip-address-of-the-system-running-NodeJS-API>:3000/uses/signup
```

PAYLOAD
```
{
	"name": "John Doe",
	"email": "john.doe@gmail.com",
	"password": "password",
	"confirmPassword": "password",
	"age": 30,
	"gender": "male",
    "bluetoothMac": "MAC address of bluetooth adapter",
    "latitude": 65.4567,
    "longitude": -122.567,
    "firebaseId": "firebase notification service ID"
}
```

You will receive the following response from the request:
```
{
    "message": "ok",
    "object": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDA1JHlQVjQvcmhGQ1BBNC5ZMHp3TEVNak8xZmk2MmROek9MOURhbzlqVzdFM3pQUXowNjVzYlY2IiwiZ2VuZGVyIjoibWFsZSIsImZpcmViYXNlSWQiOiJub3RpZmljYXRpb25JZCIsImJsdWV0b290aE1hYyI6ImJsdWV0b290aE1hYyIsImxhdGl0dWRlIjozNy43NzM5NzIsIm5hbWUiOiJKb2huIERvZSIsImlzRGlhZ25vc2VkIjpmYWxzZSwiZW1haWwiOiJqb2huLmRvZUBnbWFpbC5jb20iLCJhZ2UiOjMwLCJsb25naXR1ZGUiOi0xMjIuNDMxMjk3fSwiaWF0IjoxNTk1NjkxNTcwfQ.Iw_fxBF3q6Lip-s2Xw8s9eLhSlz3x7qJyoL1RBB3qXs"
    }
}
```
The token present in the response payload needs to be saved as it will be used as a `Bearer Token` in the following requests to the API.

2. Login:
Make an HTTP POST request to the following URL with the following payload,

URL
```
http://<ip-address-of-the-system-running-NodeJS-API>:3000/uses/login
```

PAYLOAD
```
{
	"email": "john.doe@gmail.com",
	"password": "password"
}
```

You will receive the following response from the request:
```
{
    "message": "ok",
    "object": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDA1JHlQVjQvcmhGQ1BBNC5ZMHp3TEVNak8xZmk2MmROek9MOURhbzlqVzdFM3pQUXowNjVzYlY2IiwiZ2VuZGVyIjoibWFsZSIsImZpcmViYXNlSWQiOiJub3RpZmljYXRpb25JZCIsImJsdWV0b290aE1hYyI6ImJsdWV0b290aE1hYyIsImxhdGl0dWRlIjozNy43NzM5NzIsIm5hbWUiOiJKb2huIERvZSIsImlzRGlhZ25vc2VkIjpmYWxzZSwiZW1haWwiOiJqb2huLmRvZUBnbWFpbC5jb20iLCJhZ2UiOjMwLCJsb25naXR1ZGUiOi0xMjIuNDMxMjk3fSwiaWF0IjoxNTk1NjkxNTcwfQ.Iw_fxBF3q6Lip-s2Xw8s9eLhSlz3x7qJyoL1RBB3qXs"
    }
}
```
The token present in the response payload needs to be saved as it will be used as a `Bearer Token` in the following requests to the API.

3. Report COVID positive:
Make an HTTP GET request to the following URL with the following headers,
```
Authorization: Bearer <token received after signing up/logging in>
```

URL
```
http://<ip-address-of-the-system-running-NodeJS-API>:3000/covid/positive
```

You will receive the following response from the request:
```
{
    "message": "ok",
    "object": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InBhc3N3b3JkIjoiJDJiJDA1JHlQVjQvcmhGQ1BBNC5ZMHp3TEVNak8xZmk2MmROek9MOURhbzlqVzdFM3pQUXowNjVzYlY2IiwiZ2VuZGVyIjoibWFsZSIsImZpcmViYXNlSWQiOiJub3RpZmljYXRpb25JZCIsImJsdWV0b290aE1hYyI6ImJsdWV0b290aE1hYyIsImxhdGl0dWRlIjozNy43NzM5NzIsIm5hbWUiOiJKb2huIERvZSIsImlzRGlhZ25vc2VkIjpmYWxzZSwiZW1haWwiOiJqb2huLmRvZUBnbWFpbC5jb20iLCJhZ2UiOjMwLCJsb25naXR1ZGUiOi0xMjIuNDMxMjk3fSwiaWF0IjoxNTk1NjkxNTcwfQ.Iw_fxBF3q6Lip-s2Xw8s9eLhSlz3x7qJyoL1RBB3qXs"
    }
}
```
On hitting this endpoint, you will receive an updated token. Please save it as it will be used as a `Bearer Token` in the following requests to the API.


4. Contact between two individuals
When two individuals are close to each other, a bluetooth scan catches the MAC address of the other and makes an HTTP POST request to the following endpoint with the following body and headers,
```
Authorization: Bearer <token received after signing up/logging in>
```

URL
```
http://<ip-address-of-the-system-running-NodeJS-API>:3000/users/contact
```

PAYLOAD:
```
{
	"bluetoothMac": "R:BT:MAC",
	"latitude": 37.773972,
	"longitude": -122.431297
}
```

The endpoint tries to create a relationship between the two nodes. First it checks if a relationship was created within the last 5 minutes. If yes, then it does not create one. Else, it creates one. Irrespective of the relationship been created or not, the endpoint checks the `isDiagnosed` property of both users. If it is true for either of the person then it sends a push notification to the other person.

5. Reset Database (Admin API):
Make an HTTP DELETE request to the following URL,
URL
```
http://<ip-address-of-the-system-running-NodeJS-API>:3000/
```