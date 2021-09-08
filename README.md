# Rest API
 
## Description
This project uses Express with Sequelize in order to create a REST API.  Users can use the API to create Users, and Courses which will persist to a database

## Built using
* Javascript
* Express
* Sequelize

## Installation
* Download project files
* Navigate to directory in command line tool
* Run `npm install` to install all dependencies
* Use `npm start` to start the server and connect to database
* Use a API platform such as Postman to interact with the routes via `localhost:5000`

### App Functionality
There are 2 main routes to interact with:

**Users** 
* `GET` to `/api/users` will return the details for the current Authenticated user
* `POST` to `/api/courses` will create a new user within the Database. **NOTE: Email Address must be unique** Required credentials to pass in body:
    * firstName: `STRING`
    * lastName: `STRING`
    * emailAddress: `STRING`
    * password: `STRING`

**Courses**
* `GET` to `/api/courses/` will return a list of all courses and the User which owns the course. 
    * No Auth Necessary
* `GET` to `/api/courses/:id` will return the details of an individual course
    * No auth necessary
* `POST` to `/api/courses` will create a new course.
    * **Course Details to pass in to body of request:**
        * title: `STRING` _required_
        * description: `TEXT` _required_
        * userID: `INTEGER` _required_
        * estimatedTime: `STRING`
        * materialsNeeded: `STRING`
* `PUT` to `/api/courses/:id` will allow for course details to be updated.
    * Required parameters to include in body are same as a `POST` with one difference:
        * id: `INTEGER` _required_
* `DELETE` to `/api/courses/:id` will remove that course from the database

### Validation and Authorization
When making `GET` requests to `/users` as well as `POST`, `PUT`, or `DELETE` calls, you must provide Username and Password Credentials as Basic Auth. Username == Email Address.

If no Authorization is provided, the app will return a 403 forbidden error.

When updating or deleting courses, the user credentials must match the userId for the provided course.  If credentials do not match, the update or delete will fail.

If incomplete or inaccurate data is passed into the body of a request, the app will notify the user of the missing details.

