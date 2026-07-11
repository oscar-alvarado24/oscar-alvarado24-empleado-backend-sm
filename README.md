# Oscar Alvarado's Employee Microservice 🧑‍💼

A robust Node.js and TypeScript microservice designed for managing employee data, including personnel information for providers. This backend service leverages Clean Architecture principles and integrates with MongoDB for data persistence.

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 📄 Table of Contents

*   [🚀 Project Overview](#project-overview)
*   [✨ Features](#features)
*   [🛠️ Tech Stack](#tech-stack)
*   [📦 Prerequisites](#prerequisites)
*   [🚀 Installation](#installation)
*   [💡 Usage](#usage)
*   [⚙️ Project Structure](#project-structure)
*   [🔒 API Reference](#api-reference)
*   [📚 Logging](#logging)
*   [🐳 Docker Integration](#docker-integration)
*   [🤝 Contributing](#contributing)
*   [📜 License](#license)
*   [🔗 Important Links](#important-links)
*   [❤️ Footer](#footer)

## 🚀 Project Overview

This microservice is built to manage employee and provider personnel data. It follows a Clean Architecture pattern to ensure maintainability, scalability, and testability. The primary technology stack includes Node.js, TypeScript, Express.js, and MongoDB.

## ✨ Features

*   **Employee Management:** Full CRUD (Create, Read, Update, Delete) operations for employee records. 📝
*   **Clean Architecture:** Adheres to architectural principles for a well-organized and maintainable codebase (Domain, Application, Infrastructure layers). 🏛️
*   **TypeScript:** Utilizes TypeScript for static typing, enhancing code quality and developer experience. ✍️
*   **DTOs with Validation:** Implements Data Transfer Objects (DTOs) with `class-validator` and `class-transformer` for robust input data validation. ✅
*   **MongoDB Integration:** Uses Mongoose as an ODM for seamless interaction with a MongoDB database. 🗄️
*   **Configurable Logging:** Integrated Winston logger for comprehensive logging of application events, requests, and errors. 📣
*   **Environment-based Configuration:** Manages application settings using `.env` files for different environments. ☁️
*   **AWS SDK Integration:** Utilizes AWS SDK for services like Cognito and SES, indicating potential for user management and email notifications.
*   **Data Encryption:** Implements a `CryptoService` for encrypting sensitive data, enhancing security. 🔒

## 🛠️ Tech Stack

*   **Languages:** TypeScript, JavaScript, JSON, Markdown
*   **Frameworks/Libraries:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Development Tools:** Nodemon, ts-node, Jest, Supertest, TypeScript
*   **Utilities:** Winston (Logging), bcrypt (Hashing), Helmet (Security), CORS, dotenv
*   **AWS Services:** Cognito Identity Provider, SES (via SDK)
*   **Containerization:** Docker

## 📦 Prerequisites

*   **Node.js:** Version 16+ recommended.
*   **MongoDB:** A running instance of MongoDB (local or cloud).
*   **NPM:** (Node Package Manager) or Yarn.
*   **AWS Account:** Required if utilizing Cognito or SES features fully (e.g., `AWS_REGION`, `COGNITO_USER_POOL_ID`, `COGNITO_CLIENT_ID`).

## 🚀 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/oscar-alvarado24/oscar-alvarado24-empleado-backend-sm.git
    cd oscar-alvarado24-empleado-backend-sm
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the project by copying the example:
    ```bash
    cp .env.example .env
    ```
    Configure the following variables in your `.env` file:
    *   `PORT`: The port the server will listen on (default: `3001`).
    *   `NODE_ENV`: Environment (`development`, `production`, `test`).
    *   `MONGODB_URI`: Your MongoDB connection string. (e.g., `mongodb://localhost:27017/employee_db_typescript_example`)
    *   `AWS_REGION`: Your AWS region (if using AWS services).
    *   `COGNITO_USER_POOL_ID`: Your Cognito User Pool ID.
    *   `COGNITO_CLIENT_ID`: Your Cognito App Client ID.
    *   `CRYPTO_SECRET_KEY`: A strong secret key for data encryption (Base64 encoded, 32 bytes).

    **Example `.env`:**
    ```ini
    PORT=3001
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/employee_db_typescript_example
    AWS_REGION=us-east-1
    COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
    COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxx
    CRYPTO_SECRET_KEY=your-base64-encoded-32-byte-secret-key==
    ```

## 💡 Usage

### Running the Application

*   **Development Mode:** (With automatic reloading via `nodemon`)
    ```bash
    npm run dev
    ```
    The server will start, typically on `http://localhost:3001`.

*   **Production Mode:**
    1.  Build the TypeScript code:
        ```bash
        npm run build
        ```
        This compiles TypeScript to JavaScript in the `dist/` folder.
    2.  Start the application:
        ```bash
        npm start
        ```
        This runs the compiled JavaScript from `dist/server.js`.

### Building the Project

*   To compile TypeScript to JavaScript:
    ```bash
    npm run build
    ```

### Testing

*   Run unit tests:
    ```bash
    npm test
    ```
*   Generate test coverage report:
    ```bash
    npm run test:coverage
    ```

## ⚙️ Project Structure

The project follows a Clean Architecture pattern:

*   **`src/domain`**: Core business logic, entities (`Employee`), value objects (`Email`, `Position`), and repository interfaces. Independent of external concerns.
*   **`src/application`**: Orchestrates use cases (e.g., `CreateEmployee`, `GetEmployeeById`) and defines DTOs. Depends on the domain layer.
*   **`src/infrastructure`**: Implements external concerns:
    *   `database`: MongoDB connection (`connectDB`), Mongoose models (`EmployeeModel`), and repository implementations (`MongoEmployeeRepository`).
    *   `output/web/express`: Express setup, controllers (`EmployeeController`), routes (`employeeRoutes`), and middlewares (`errorHandler`, `security`, `cognitoAuth`).
    *   `config`: Application configuration (e.g., `logger.ts`).
    *   `helper`: Utility classes and exceptions (e.g., `CryptoService`, Cognito-related exceptions).
*   **`src/`**: Entry points (`app.ts`, `server.ts`).
*   **`config/`**: Configuration files (e.g., `logger.ts`).
*   **`tests/`**: (Implicit) Contains test files.

## 🔒 API Reference

Base URL: `/api/v1/employee`

All endpoints require authentication via Cognito JWT tokens and specific group permissions (e.g., `pacientes`).

*   **`POST /save`**: Create a new employee.
    *   **Authentication:** Requires group `pacientes`.
    *   **Request Body:** JSON object conforming to `CreateEmployeeDto`.
    *   **Example:**
        ```json
        {
          "id": 101,
          "firstName": "John",
          "lastName": "Doe",
          "email": "john.doe@example.com",
          "position": "Developer",
          "address": "123 Main St",
          "cellPhone": "555-1234",
          "residencesType": "House",
          "neighborhood": "Downtown",
          "company": 1,
          "workplace": "Office A"
        }
        ```

*   **`GET /`**: Get all employees.
    *   **Authentication:** Requires group `pacientes`.

*   **`GET /:id`**: Get a specific employee by ID.
    *   **Authentication:** Requires group `pacientes`.
    *   **Path Parameter:** `id` (Employee ID).

*   **`PUT /:id`**: Update an existing employee by ID.
    *   **Authentication:** Requires group `pacientes`.
    *   **Path Parameter:** `id` (Employee ID).
    *   **Request Body:** JSON object with fields to update, conforming to `UpdateEmployeeDto`.

*   **`DELETE /:id`**: Delete an employee by ID.
    *   **Authentication:** Requires group `pacientes`.
    *   **Path Parameter:** `id` (Employee ID).

*   **`GET /doctors/by-id-list`**: Get a list of doctors by their encrypted IDs.
    *   **Authentication:** Requires group `pacientes`.
    *   **Query Parameter:** `ids` (comma-separated encrypted IDs).
    *   **Returns:** Encrypted `DataDoctorProcedure` objects.

**Note on Validation:** Request bodies are validated. Invalid requests will return a `400 Bad Request` with error details.

## 📚 Logging

Uses Winston for logging. Log levels and output format are configurable via `src/infrastructure/config/logger.ts` and the `NODE_ENV` environment variable.

*   **Log Levels:** `debug`, `info`, `warn`, `error`.
*   **Output:** Console (colorized) with timestamps and message.
*   **Requests:** Logged with method, URL, status code, duration, IP, and User-Agent.
*   **Errors:** Unhandled rejections, uncaught exceptions, and application errors are logged.

## 🐳 Docker Integration

Includes a `Dockerfile` for containerizing the application. It sets up a multi-stage build for a lean production image.

*   **Base Image:** `node:20.19.6-alpine3.23`
*   **Build Stage:** Compiles TypeScript code.
*   **Production Stage:** Copies compiled code and production dependencies, runs as a non-root user.
*   **Health Check:** Includes a `HEALTHCHECK` instruction to monitor the `/health` endpoint.
*   **Entrypoint:** Uses `dumb-init` for proper signal handling.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📜 License

This project is not explicitly licensed. Please refer to the repository for any licensing information.

## 🔗 Important Links

*   **Repository:** [oscar-alvarado24/oscar-alvarado24-empleado-backend-sm](https://github.com/oscar-alvarado24/oscar-alvarado24-empleado-backend-sm)

## ❤️ Footer

This project is maintained by Oscar Alvarado.

Made with ❤️ and ☕.

--- 

© 2023 Oscar Alvarado. All rights reserved.

[⬆ Back to Top](#table-of-contents)


---
**<p align="center">Generated by [ReadmeCodeGen](https://www.readmecodegen.com/)</p>**