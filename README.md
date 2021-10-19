# Task Manager

Authors:
- CHIMIRRI ARMANDO
- IAMMARINO SOFIA
- BRAMINI MARCO
- DAMINO DESIRE'

## Instructions for testing

### Environment startup

A script is available to run both the app and its server with a single command:

```
 npm run start-with-server
```

Warning: The server will be started using the `node`command instead of `nodemon` due to platform compatibility.

### Test user credentials

A test user has been created to simplify the testing of the application:

```
  email: "test@email.com"
  password: "testtest"
```

## List of APIs offered by the server

### Auth APIs

| Name          | Description                          | Path                        | Method | Authenticated |
| ------------- | ------------------------------------ | --------------------------- | ------ | ------------- |
| **loginUser** | Logs the user inside the application | /task-manager/apis/sessions | POST   |

Request sample:

```json
POST task-manager/apis/sessions HTTP/1.1
Content-Type: application/json

{
  "username": "john.doe@polito.it",
  "password":"ciao"
}
```

Response sample:

```json
{
  "id": 1,
  "email": "john.doe@polito.it",
  "name": "John"
}
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **401 - Unauthorized**: The provided credentials are wrong. Caller must fix them and retry.

|                    |                                                    |                             |     |
| ------------------ | -------------------------------------------------- | --------------------------- | --- |
| **getCurrentUser** | Gets the current user authenticated in the session | /task-manager/apis/sessions | GET |

Request sample:

```
GET task-manager/apis/sessions/current HTTP/1.1
```

Response sample:

```json
{
  "id": 1,
  "email": "john.doe@polito.it",
  "name": "John"
}
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.

|                |                   |                             |        |
| -------------- | ----------------- | --------------------------- | ------ |
| **logoutUser** | Logs out the user | /task-manager/apis/sessions | DELETE |

Request sample:

```
DELETE task-manager/apis/sessions/current HTTP/1.1
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.

### TaskManage APIs

| Name           | Description                                                                                                              | Path                     | Method | Authenticated |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------ | ------------- |
| **CreateTask** | Creates a new task for the current user, populated with the passed parameters. Returns the id of the newly created task. | /task-manager/apis/tasks | POST   | ✅            |

Request sample:

```json
POST /task-manager/apis/tasks HTTP/1.1
Content-Type: application/json

{
    "description":"Go buy vodka!",
    "isImportant": false,
    "deadline" :"2022-06-22T14:00:00.000Z",
}
```

Response sample:

```json
{
  "newTaskId": 11
}
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **422 - Unprocessable Entity**: There was an error validating the request parameters. Caller must fix them and retry.

|             |                                                                      |                                  |     |     |
| ----------- | -------------------------------------------------------------------- | -------------------------------- | --- | --- |
| **GetTask** | Retrieves the task associated to the passed ID for the current user. | /task-manager/apis/tasks/:taskId | GET | ✅  |

Request sample:

```json
GET /task-manager/apis/tasks/9 HTTP/1.1

```

Response sample:

```json
{
  "id": 9,
  "userId": 1,
  "description": "Call Mary",
  "deadline": null,
  "isImportant": 1,
  "isPrivate": 1,
  "isCompleted": 0
}
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **422 - Unprocessable Entity**: There was an error validating the request parameters. Caller must fix them and retry.

|                      |                                                                            |                                           |     |     |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------- | --- | --- |
| **GetFilteredTasks** | Retrieves all the tasks that fullfill a given filter for the current user. | /task-manager/apis/tasks?filter=:filterId | GET | ✅  |

Request sample:

```json
GET /task-manager/apis/tasks?filterId=important HTTP/1.1

```

Response sample:

```json
[
    {
        "id": 9,
        "userId": 1,
        "description": "Call Mary",
        "deadline": null,
        "isImportant": 1,
        "isPrivate": 1,
        "isCompleted": 0
    },
    ...
]
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **422 - Unprocessable Entity**: There was an error validating the request parameters. Caller must fix them and retry.

|                |                                                                                                                                                                                                                                                              |                          |     |     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | --- | --- |
| **UpdateTask** | Updates a existing task, for the current user, using the values passed as parameters. Only the provided fields will be updated. The omitted (undefined) fields will remain untouched. Setting a field to null will provoke it to be set to null in the Task. | /task-manager/apis/tasks | PUT | ✅  |

Request sample:

```json
PUT /task-manager/apis/tasks/2 HTTP/1.1
Content-Type: application/json

{
    "description": "Go for walk",
    "isCompleted": true,
    "deadline": null,
    "userId": 1
}
```

Response sample:

```json
{
  "updatedTaskId": 10
}
```

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **422 - Unprocessable Entity**: There was an error validating the request parameters. Caller must fix them and retry.

|                |                                                                                         |                                  |        |     |
| -------------- | --------------------------------------------------------------------------------------- | -------------------------------- | ------ | --- |
| **DeleteTask** | Deletes an existing task for the current user selected by passing his ID as a parameter | /task-manager/apis/tasks/:TaskId | DELETE | ✅  |

Request sample:

```
DELETE /task-manager/apis/tasks/10  HTTP/1.1
```

Success code:

- **204 - No Content**: The task has been successfully deleted.

Error codes:

- **500 - Server Error**: Something went wrong on the server side. Error is logged on the server.
- **422 - Unprocessable Entity**: There was an error validating the request parameters. Caller must fix them and retry.
