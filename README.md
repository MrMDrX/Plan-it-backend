# Plan it app backend

This is the backend implementation for the Plan it app, An offline-first task management app with user authentication, task creation, management, and synchronization. This backend uses TypeScript and is powered by Node.js, with a PostgreSQL database handled through Drizzle ORM.

## Getting Started

To run this backend application locally, follow the instructions below.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (for package management)
- [Docker](https://www.docker.com/) (for containerization)

## Configuration

1. **Database Configuration**:  
   The app uses a PostgreSQL database for data persistence. The database connection is configured in `src/db/index.ts` and the schema definitions are located in `src/db/schema.ts`.

2. **Authentication Middleware**:  
   The authentication logic is handled through middleware found in `src/middleware/auth.ts`. It ensures that users can securely access API routes related to tasks.

3. **Drizzle ORM**:  
   The backend utilizes Drizzle ORM to interact with the PostgreSQL database. Configuration for Drizzle ORM can be found in `src/drizzle.config.ts`.

## Running the App

### Local Development

1. Clone this repository:

   ```bash
   git clone https://github.com/MrMDrX/Plan-it-backend.git
   cd Plan-it-backend
   ```

2. Install dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Run the application:

   ```bash
   pnpm dev
   ```

   This will start the backend server using `nodemon` in development mode.

### Docker Setup

If you prefer using Docker for development, you can set up the environment using Docker Compose.

1. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. This will spin up a container with the backend and PostgreSQL database.

---

## API Routes

The backend provides the following API routes:

### Authentication Routes

- **POST `/auth/signup`** : Creates a new user account.
- **POST `/auth/login`** : Logs in an existing user.
- **POST `/auth/isTokenValid`** : Verifies if the provided JWT token is valid. Expects the token to be passed in the `x-auth-token` header.
- **GET `/auth/`** : Retrieves the current authenticated user details.

### Task Routes

- **POST `/tasks`** : Creates a new task for the authenticated user.
- **GET `/tasks`** : Retrieves all tasks for the authenticated user.
- **DELETE `/tasks`** : Deletes a specific task by its `taskId`.
- **POST `/tasks/sync`** : Synchronizes tasks between the client and the server.

These routes are secured with authentication middleware, requiring users to be logged in to access them.

## Contributing

We welcome contributions! If you have suggestions or improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for detail.
