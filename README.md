# Pokémon API Backend

![Pokedex Image](https://ichef.bbci.co.uk/news/976/cpsprodpb/147C0/production/_132740938_indeximage.jpg)

This is a Pokémon API backend built using Hono, Prisma, and SQLite. It provides user authentication, Pokémon catching, and retrieval functionalities, including integration with the PokeAPI to fetch real-time Pokémon data.

## Features

- User Registration and Login with JWT authentication
- Catch Pokémon by name
- Retrieve details of caught Pokémon
- Integration with PokeAPI to fetch real-time Pokémon data

## Prerequisites

- Node.js (version 14 or higher)
- bun

## Installation

1. **Clone the repository:**

   git clone <https://github.com/KeldenPDorji/02230285_WEB102_PA2.git>

2. **Install dependencies:**

    bun install

3. **Set up the Prisma database:**

Create a .env file in the root of the project with the following content:

    DATABASE_URL="file:./dev.db"

4. **Generate Prisma client and migrate the database:**

    npx prisma generate
    npx prisma migrate dev --name init

5. **Running the Application**

To start the development server, run:

    bun run dev
    The server will be running at http://localhost:3000.

## Pokémon Endpoints
### Fetch Pokémon Data from PokeAPI

    URL: /pokemon/:name
    Method: GET
    Response:

    {
      "data": { /* PokeAPI response data */ }
    }

### Catch Pokémon (Protected)

    URL: /protected/catch
    Method: POST
    Headers:
    Authorization: Bearer <JWT_TOKEN>

Body:

    {
    "name": "mew"
    }

Response:

    {
    "message": "Pokemon caught",
    "data": {
        "id": "b23f7255-50f2-479b-8304-d650243d917d",
        "userId": "2a5eb751-c1fb-4cfc-a846-9991e721428a",
        "pokemonId": "f4e0b859-1a46-4fab-874b-f8aecc0ca0f3",
        "caughtAt": "2024-06-13T10:25:25.474Z"
    }
    }

### Release Pokémon (Protected)

    URL: /protected/release/:id
    Method: DELETE
    Headers:
    Authorization: Bearer <JWT_TOKEN>

Response:

    {
    "message": "Pokemon released"
    }

Get Caught Pokémon (Protected)

    URL: /protected/caught
    Method: GET
    Headers:
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