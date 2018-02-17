# SERVER SIDE
Project apps task-management

## Route List API
List of routes:

|            Route           |  HTTP  |        Req.Body (required)             |
| -------------------------- | ------ | -------------------------------------- |
| api/users/login            | POST   | email, password                        |
| api/users/login-facebook   | POST   | tokenFB                                |
| api/users/register         | POST   | name, email, password, retype_password |

## Usage
```
npm install
Running Server : run npm dev
```

Access Server API via postman `http://localhost:3030/`
Access Server API via gcloud  `http://35.198.204.175:3030/`
