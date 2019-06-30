# SERVER SIDE
Project apps task-management

## Route List API
List of routes:

|            Route           |  HTTP  |        Req Body (required)             |           Return (Object)              |
| -------------------------- | ------ | -------------------------------------- | -------------------------------------- |
| api/users/login            | POST   | email, password                        | message, token                         |
| api/users/login-facebook   | POST   | tokenFB                                | message                                |
| api/users/register         | POST   | name, email, password, retype_password | message, token                         |

## Usage
```
npm install
Running Server : run npm dev
```

Access Server API via postman `http://localhost:3030/` 

Access Server API via gcloud  `http://35.198.204.175:3030/`
