# SERVER SIDE
Project apps task-management

## Route List API
List of routes:

|      Route        |  HTTP  |        Req.Body (required)             |
| ----------------- | ------ | -------------------------------------- |
| /login            | POST   | email, password                        |
| /login-facebook   | POST   | tokenFB                                |
| /register         | POST   | name, email, password, retype_password |

## Usage
```
npm install
Running Server : run npm dev
```

Access Server API via postman `http://localhost:3030/`
