# Node.js & Express Employee CRUD Microservice (Clean Architecture + TypeScript)

This project implements a RESTful API for managing employee data, built with Node.js, Express, and TypeScript. It follows Clean Architecture principles to promote separation of concerns, maintainability, and testability.

## Features

*   **REST API:** Provides Create, Read, Update, and Delete (CRUD) operations for employees.
*   **Clean Architecture:** Organizes code into distinct layers (Domain, Application, Infrastructure) for better structure.
*   **TypeScript:** Utilizes TypeScript for static typing, improving code quality and developer experience.
*   **DTOs with Validation:** Employs Data Transfer Objects (DTOs) with `class-validator` and `class-transformer` for request payload validation.
*   **MongoDB Integration:** Uses Mongoose for Object Data Modeling (ODM) with a MongoDB database.
*   **Configurable Logging:** Integrated Winston logger for application events, requests, and errors.
*   **Environment-based Configuration:** Uses `.env` files for managing environment-specific settings.

## Directory Structure Overview

*   `src/domain`: Contains the core business logic, entities (e.g., `Employee`), value objects (e.g., `Email`, `Position`), and repository interfaces. This layer is independent of frameworks and external concerns.
*   `src/application`: Orchestrates the use cases of the application. It contains application services/use cases (e.g., `CreateEmployee`, `UpdateEmployee`) and DTOs. This layer depends on the domain layer.
*   `src/infrastructure`: Provides implementations for external concerns like databases, web frameworks, and third-party services.
    *   `src/infrastructure/database`: Contains MongoDB connection logic, Mongoose schemas (`EmployeeModel`), and repository implementations (`MongoEmployeeRepository`).
    *   `src/infrastructure/web/express`: Contains Express.js specific setup, controllers (`EmployeeController`), routes, and middlewares (e.g., `errorHandler`).
*   `src/config`: Houses application configuration, such as the logger setup.

## Prerequisites

*   **Node.js:** v16+ recommended.
*   **MongoDB:** A running instance of MongoDB (local or cloud).
*   **NPM:** (Comes with Node.js) or Yarn.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
    (Replace `<repository-url>` with the actual URL of this repository)

2.  **Navigate to the project directory:**
    ```bash
    cd <project-directory>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Environment Variables:**
    *   Copy the example environment file `.env.example` to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and configure the variables as needed:
        *   `PORT`: The port on which the application server will listen (e.g., 3001).
        *   `MONGODB_URI`: The connection string for your MongoDB instance (e.g., `mongodb://localhost:27017/employee_db_typescript`).
        *   `NODE_ENV`: The application environment (e.g., `development`, `production`, `test`).

    **Example `.env`:**
    ```ini
    # .env
    PORT=3001
    MONGODB_URI=mongodb://localhost:27017/employee_db_typescript
    NODE_ENV=development
    ```

## Running the Application

*   **Development Mode (with auto-restart using Nodemon and ts-node):**
    ```bash
    npm run dev
    ```
    The server will typically start on the port specified in your `.env` file (e.g., `http://localhost:3001`).

*   **Production Mode:**
    1.  Build the TypeScript code:
        ```bash
        npm run build
        ```
        This compiles the TypeScript files from `src/` to JavaScript in the `dist/` directory.
    2.  Start the application:
        ```bash
        npm start
        ```
        This runs the compiled JavaScript code from `dist/server.js`.

## Build

*   To compile the TypeScript code to JavaScript (output to `dist/` directory):
    ```bash
    npm run build
    ```

*   **Note on `src/infrastructure/input/rest/`:**
    *   The primary application code is organized under `src/domain`, `src/application`, `src/config`, `src/infrastructure/database`, and `src/infrastructure/web`. This core part of the application should compile cleanly.
    *   There is an additional module located at `src/infrastructure/input/rest/` which seems to contain a separate or older API implementation. As of the last project update, this specific module has known TypeScript compilation errors (e.g., missing `CognitoService`, `SESService`, and different `EmployeeRepository` implementations).
    *   To achieve a clean build of the primary application (excluding the `src/infrastructure/input/rest/` module), you can modify the `exclude` array in your `tsconfig.json` file:

        ```json
        // tsconfig.json example snippet
        {
          "compilerOptions": {
            // ... your existing compiler options ...
          },
          "include": [
            "src/**/*"
          ],
          "exclude": [
            "node_modules",
            "**/*.spec.ts",
            "**/*.test.ts",
            "src/infrastructure/input/rest/**/*.ts" // Add or ensure this line is present
          ]
        }
        ```
        Adding `"src/infrastructure/input/rest/**/*.ts"` to the `exclude` array will instruct the TypeScript compiler to ignore this directory during the build process, allowing the main application to compile without errors from this auxiliary module.

## API Endpoints

Base URL: `/api/v1/employees`

*   **`POST /`**: Create a new employee.
    *   **Request Body**: JSON object. Refer to `src/application/dtos/CreateEmployeeDto.ts` for field requirements and validation rules (e.g., `firstName`, `lastName`, `email`, `position`, `department` are required; `email` must be a valid format).
*   **`GET /`**: Get all employees.
*   **`GET /:id`**: Get a specific employee by their ID.
*   **`PUT /:id`**: Update an existing employee by their ID.
    *   **Request Body**: JSON object. Refer to `src/application/dtos/UpdateEmployeeDto.ts` for available fields (all fields are optional for update).
*   **`DELETE /:id`**: Delete an employee by their ID.

**Note on Validation:** Request bodies for `POST` and `PUT` operations are validated using the defined DTOs. The API will return a 400 Bad Request response with error details if validation fails.

## Logging

The application uses the Winston library for logging, configured in `src/config/logger.ts`.
Logs include:
*   Server start-up and database connection status.
*   Incoming HTTP requests (method, URL, IP).
*   Controller actions (e.g., employee creation, retrieval, errors).
*   Unhandled promise rejections and uncaught exceptions.
*   Error details in the `errorHandler` middleware.

By default, logs are output to the console with timestamps and colorization for different log levels.

## Clean Architecture

This project adheres to Clean Architecture principles:
*   **Entities (Domain):** Core business objects (e.g., `Employee`).
*   **Use Cases (Application):** Application-specific business rules, orchestrating data flow between entities and infrastructure.
*   **Interface Adapters (Infrastructure):** Controllers, presenters, and gateways that convert data for use cases and external tools.
*   **Frameworks & Drivers (Infrastructure):** External tools like databases, web frameworks (Express.js), etc.

This separation of concerns aims for a system that is:
*   Independent of Frameworks.
*   Testable.
*   Independent of UI.
*   Independent of Database.
*   Independent of any external agency.

This makes the core logic more robust, easier to maintain, and adaptable to changes in external technologies.
