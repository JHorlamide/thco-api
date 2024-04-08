## Requirements

To run this application, you will need:

* Docker installed on your machine
* A terminal or command prompt

## Installation

To install this application, follow these steps:

* Clone this repository to your machine: `git clone https://github.com/JHorlamide/risevest-backend.git`
* Navigate to the project directory: `cd risevest-backend`

## Running the Application

To start the application use docker compose:

* `docker-compose up --build`
* In the docker contailer shell for the running make sure to run `npx prisma migrate dev --name init`
* To test the API endpoints, you can use a tool like [Postman](https://www.postman.com/downloads/) or [curl](https://curl.se/). For example, to create a new resource using `curl`, you can run the following command:

  * ```
    curl -X POST -H "Content-Type: application/json" -d '{ "name": "Jay Smith", "email": "jay.smith@outlook.com" }' http://localhost:8080/api/users
    ```

## Usage

The API endpoints of this application are described below:

* `POST /api/users`: Creates a user.
* `GET /api/user`s: Gets all created phases.
* `POST /api/users/:userId/posts:` Create new post for a user.
* `POST /api/posts/:postId/comments:` Creates a new comment for a post.
* `GET /api/users/top-users-with-latest-comments` Get top 3 users with most posts, and comments for each user.

## **Query Optimization Task**

Below is the optimized query related to the designed schema

`SELECT users.id, users.name, posts.title, comments.content FROM users LEFT JOIN posts ON users.id = posts.userId LEFT JOIN (     SELECT comments.postId, MAX(comments.createdAt) AS max_createdAt     FROM comments     GROUP BY comments.postId ) AS latest_comments ON posts.id = latest_comments.postId LEFT JOIN comments ON latest_comments.postId = comments.postId AND latest_comments.max_createdAt = comments.createdAt ORDER BY (SELECT COUNT(posts.id) FROM posts WHERE posts.userId = users.id) DESC LIMIT 3;`

## Running Test

To ensure the reliability and accuracy of the application, I have implemented a simple suite of tests. While these tests are not exhaustive, but they cover some critical aspects of the API implementation. To run the tests, use the following commands:

* To run the tests in watch mode, use the command `npm run test:watch`.
* To run the tests without watch mode, use the command `npm run test`.

I take application testing seriously and am committed to ensuring the highest possible quality of software :)
