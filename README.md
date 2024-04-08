## Requirements

To run this application, you will need:

* Docker installed on your machine
* A terminal or command prompt

## Installation

To install this application, follow these steps:

* Clone this repository to your machine: `git clone https://github.com/JHorlamide/thco-api.git`
* Navigate to the project directory: `cd thco-api`

## Running the Application

To start the application, follow these steps:

* `npm install`
* `npm run dev`
* To test the API endpoints, you can use a tool like [Postman](https://www.postman.com/downloads/) or [curl](https://curl.se/). For example, to create a new resource using `curl`, you can run the following command:

  * ```
    curl -X POST -H "Content-Type: application/json" -d '{ "firestname": "Jay", lastname: "Smith", username: "JaySmith" "email": "jay.smith@outlook.com", password: "test1234" }' http://localhost:8080/api/users
    ```

## Usage

The API endpoints of this application are described in the Postman link below:

* Link: `https://documenter.getpostman.com/view/8106031/2sA35MyJUo`

## Running Test

To ensure the reliability and accuracy of the application, I have implemented a simple suite of tests. While these tests are not exhaustive, but they cover some critical aspects of the API implementation. To run the tests, use the following commands:

* To run the tests in watch mode, use the command `npm run test:watch`.
* To run the tests without watch mode, use the command `npm run test`.

I take application testing seriously and am committed to ensuring the highest possible quality of software :)
