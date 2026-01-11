# Pokémon API Backend

![Pokedex Image](https://ichef.bbci.co.uk/news/976/cpsprodpb/147C0/production/_132740938_indeximage.jpg)

A robust REST API backend for managing Pokémon collection with user authentication, built with modern technologies.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Password Security**: BCrypt hashing for password storage
- **Pokémon Management**: Catch, release, and view your Pokémon collection
- **PokeAPI Integration**: Fetch real-time Pokémon data from the official PokeAPI
- **Input Validation**: Comprehensive validation for all user inputs
- **Type Safety**: Full TypeScript support
- **Database**: SQLite with Prisma ORM

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/)
- **Database**: SQLite with [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Git

## 🔧 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KeldenPDorji/02230285_WEB102_PA2.git
   cd 02230285_WEB102_PA2
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your configuration:

   ```env
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your-secret-key-here"
   JWT_EXPIRY="1h"
   PORT=3000
   NODE_ENV="development"
   ```

4. **Set up the database:**

   ```bash
   bun run db:generate
   bun run db:migrate
   ```

## 🚀 Running the Application

**Development mode (with hot reload):**

```bash
bun run dev
```

**Production mode:**

```bash
bun run start
```

The server will be running at `http://localhost:3000`

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Health Check

- **GET** `/`
  - Returns API status and version

### Authentication Endpoints

#### Register

- **POST** `/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User user@example.com created successfully"
  }
  ```
- **Validation:**
  - Email must be valid format
  - Password must be at least 6 characters

#### Login

- **POST** `/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
  ```

### Pokémon Endpoints

#### Fetch Pokémon Data from PokeAPI

- **GET** `/pokemon/:name`
- **Example:** `/pokemon/pikachu`
- **Response:**
  ```json
  {
    "data": {
      "name": "pikachu",
      "id": 25,
      "types": [...],
      ...
    }
  }
  ```

### Protected Endpoints

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### Catch Pokémon

- **POST** `/protected/catch`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Body:**
  ```json
  {
    "name": "pikachu"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Pokémon caught successfully",
    "data": {
      "id": "uuid",
      "userId": "uuid",
      "pokemonId": "uuid",
      "caughtAt": "2024-06-13T10:25:25.474Z",
      "pokemon": {
        "id": "uuid",
        "name": "pikachu"
      }
    }
  }
  ```

#### Release Pokémon

- **DELETE** `/protected/release/:id`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "message": "Pokémon released successfully"
  }
  ```

#### Get Caught Pokémon

- **GET** `/protected/caught`
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response:**
  ```json
  {
    "message": "Caught Pokémon retrieved successfully",
    "count": 5,
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "pokemonId": "uuid",
        "caughtAt": "2024-06-13T10:25:25.474Z",
        "pokemon": {
          "id": "uuid",
          "name": "pikachu"
        }
      }
    ]
  }
  ```

## 🗃️ Database Schema

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `hashedPassword`: String
- `caughtPokemon`: Relation to CaughtPokemon[]

### Pokemon
- `id`: UUID (Primary Key)
- `name`: String (Unique)
- `caughtPokemon`: Relation to CaughtPokemon[]

### CaughtPokemon
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `pokemonId`: String (Foreign Key)
- `caughtAt`: DateTime (Default: now)

## 🧪 Database Management

```bash
# Generate Prisma Client
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema to database
bun run db:push

# Open Prisma Studio (Database GUI)
bun run db:studio
```

## 🔒 Security Features

- **Password Hashing**: BCrypt with configurable cost factor
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated before processing
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS**: Configurable CORS policy

## 📁 Project Structure

```
.
├── src/
│   ├── index.ts          # Main application file
│   ├── config.ts         # Configuration management
│   ├── types.ts          # TypeScript type definitions
│   └── validators.ts     # Input validation utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── .env                  # Environment variables (not in repo)
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Kelden P. Dorji**

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing Pokémon data
- [Hono](https://hono.dev/) for the lightweight web framework
- [Prisma](https://www.prisma.io/) for the excellent ORM

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ and ☕ by Kelden P. Dorji
    Authorization: Bearer <JWT_TOKEN>

Response:

    {
    "data": [
        {
        "id": "b23f7255-50f2-479b-8304-d650243d917d",
        "userId": "2a5eb751-c1fb-4cfc-a846-9991e721428a",
        "pokemonId": "f4e0b859-1a46-4fab-874b-f8aecc0ca0f3",
        "caughtAt": "2024-06-13T10:25:25.474Z",
        "pokemon": {
            "id": "f4e0b859-1a46-4fab-874b-f8aecc0ca0f3",
            "name": "mew",
        }
        }
    ]
    }