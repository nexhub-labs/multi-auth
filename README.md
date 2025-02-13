# Multi-Auth

A NestJS application for multi-authentication using various strategies like JWT, Google OAuth20, and more.

## Description

This project is a NestJS application that demonstrates how to implement multiple authentication strategies. It includes support for JWT authentication, Google OAuth20, and more. The project is built using Prisma for database management and includes various utilities for hashing passwords, validating inputs, and more.

## Features

- JWT Authentication
- Google OAuth20 Authentication
- Password hashing using bcryptjs
- Input validation using class-validator
- Prisma for database management
- Unit and end-to-end testing using Jest

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/alphadevking/multi-auth.git
   cd multi-auth
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. You can use the `.env.example` file as a template.

4. Run the application:

   ```bash
   npm run start:dev
   ```

## Scripts

- `build`: Build the project.
- `format`: Format the code using Prettier.
- `start`: Start the application.
- `start:dev`: Start the application in development mode with watch.
- `start:debug`: Start the application in debug mode with watch.
- `start:prod`: Start the application in production mode.
- `lint`: Lint the code using ESLint.
- `test`: Run tests using Jest.
- `test:watch`: Run tests in watch mode.
- `test:cov`: Run tests and generate coverage report.
- `test:debug`: Run tests in debug mode.
- `test:e2e`: Run end-to-end tests.

## Dependencies

- `@nestjs/common`: ^10.0.0
- `@nestjs/config`: ^4.0.0
- `@nestjs/core`: ^10.0.0
- `@nestjs/jwt`: ^11.0.0
- `@nestjs/passport`: ^11.0.5
- `@nestjs/platform-express`: ^10.0.0
- `@prisma/client`: ^6.3.1
- `bcryptjs`: ^2.4.3
- `class-validator`: ^0.14.1
- `cookie-parser`: ^1.4.7
- `duratii`: ^0.1.0
- `passport-google-oauth20`: ^2.0.0
- `passport-jwt`: ^4.0.1
- `reflect-metadata`: ^0.2.0
- `rxjs`: ^7.8.1

## Dev Dependencies

- `@nestjs/cli`: ^10.0.0
- `@nestjs/schematics`: ^10.0.0
- `@nestjs/testing`: ^10.0.0
- `@types/cookie-parser`: ^1.4.8
- `@types/express`: ^5.0.0
- `@types/jest`: ^29.5.2
- `@types/node`: ^20.3.1
- `@types/supertest`: ^6.0.0
- `@typescript-eslint/eslint-plugin`: ^8.0.0
- `@typescript-eslint/parser`: ^8.0.0
- `eslint`: ^8.0.0
- `eslint-config-prettier`: ^9.0.0
- `eslint-plugin-prettier`: ^5.0.0
- `jest`: ^29.5.0
- `prettier`: ^3.0.0
- `prisma`: ^6.3.1
- `source-map-support`: ^0.5.21
- `supertest`: ^7.0.0
- `ts-jest`: ^29.1.0
- `ts-loader`: ^9.4.3
- `ts-node`: ^10.9.1
- `tsconfig-paths`: ^4.2.0
- `typescript`: ^5.1.3

## Configuration

The project uses Prisma for database management. Make sure to configure your database connection in the `.env` file.

## Testing

The project includes unit and end-to-end tests using Jest. You can run the tests using the following commands:

- `npm run test`: Run all tests.
- `npm run test:watch`: Run tests in watch mode.
- `npm run test:cov`: Run tests and generate coverage report.
- `npm run test:debug`: Run tests in debug mode.
- `npm run test:e2e`: Run end-to-end tests.

## License

This project is licensed under the [MIT](LICENSE) License.
