import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient, Prisma } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";
import axios from "axios";
import { jwt } from 'hono/jwt';
import type { Variables, RegisterRequest, LoginRequest, CatchPokemonRequest, JWTPayload } from './types';
import { config } from './config';
import { 
  validateRegistrationInput, 
  validateLoginInput, 
  validateCatchPokemonInput,
  ValidationError 
} from './validators';

const app = new Hono<{ Variables: Variables }>();
const prisma = new PrismaClient();

// Global CORS middleware
app.use("/*", cors());

// JWT middleware for protected routes
app.use(
  "/protected/*",
  jwt({
    secret: config.jwt.secret,
  })
);

// Health check endpoint
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Pokémon API is running",
    version: "1.0.0"
  });
});

// Authentication Endpoints

/**
 * Register a new user
 * @route POST /register
 */
app.post("/register", async (c) => {
  try {
    const body: RegisterRequest = await c.req.json();
    const { email, password } = body;

    // Validate input
    validateRegistrationInput(email, password);

    // Hash password
    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: config.bcrypt.cost,
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        hashedPassword: bcryptHash,
      },
    });

    return c.json({ 
      message: `User ${user.email} created successfully` 
    }, 201);
  } catch (e) {
    if (e instanceof ValidationError) {
      return c.json({ message: e.message }, 400);
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return c.json({ message: "Email already exists" }, 409);
      }
    }
    console.error("Registration error:", e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

/**
 * Login user
 * @route POST /login
 */
app.post("/login", async (c) => {
  try {
    const body: LoginRequest = await c.req.json();
    const { email, password } = body;

    // Validate input
    validateLoginInput(email, password);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, hashedPassword: true },
    });

    if (!user) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    // Verify password
    const match = await Bun.password.verify(
      password,
      user.hashedPassword,
      "bcrypt"
    );

    if (!match) {
      return c.json({ message: "Invalid credentials" }, 401);
    }

    // Generate JWT token
    const payload: JWTPayload = {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
    };
    
    const token = sign(payload, config.jwt.secret);
    
    return c.json({ 
      message: "Login successful", 
      token: token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return c.json({ message: e.message }, 400);
    }
    console.error("Login error:", e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

// Pokémon Endpoints

/**
 * Fetch Pokémon data from PokeAPI
 * @route GET /pokemon/:name
 */
app.get("/pokemon/:name", async (c) => {
  const { name } = c.req.param();

  if (!name) {
    return c.json({ message: "Pokémon name is required" }, 400);
  }

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
    );
    return c.json({ data: response.data });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return c.json({ message: "Pokémon not found" }, 404);
    }
    console.error("PokeAPI error:", error);
    return c.json({ message: "Failed to fetch Pokémon data" }, 500);
  }
});

// Protected User Resource Endpoints

/**
 * Catch a Pokémon
 * @route POST /protected/catch
 */
app.post("/protected/catch", async (c) => {
  try {
    const payload = c.get('jwtPayload');
    if (!payload) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    
    const body: CatchPokemonRequest = await c.req.json();
    const { name } = body;

    // Validate input
    validateCatchPokemonInput(name);

    const pokemonName = name.toLowerCase().trim();

    // Find or create Pokémon
    let pokemon = await prisma.pokemon.findUnique({ 
      where: { name: pokemonName } 
    });
    
    if (!pokemon) {
      pokemon = await prisma.pokemon.create({
        data: { name: pokemonName }
      });
    }

    // Check if user already caught this Pokémon
    const existingCatch = await prisma.caughtPokemon.findFirst({
      where: {
        userId: payload.sub,
        pokemonId: pokemon.id
      }
    });

    if (existingCatch) {
      return c.json({ 
        message: "You have already caught this Pokémon",
        data: existingCatch 
      }, 200);
    }

    // Create caught Pokémon record
    const caughtPokemon = await prisma.caughtPokemon.create({
      data: {
        userId: payload.sub,
        pokemonId: pokemon.id
      },
      include: {
        pokemon: true
      }
    });

    return c.json({ 
      message: "Pokémon caught successfully", 
      data: caughtPokemon 
    }, 201);
  } catch (e) {
    if (e instanceof ValidationError) {
      return c.json({ message: e.message }, 400);
    }
    if (e instanceof HTTPException) {
      throw e;
    }
    console.error("Catch Pokémon error:", e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

/**
 * Release a caught Pokémon
 * @route DELETE /protected/release/:id
 */
app.delete("/protected/release/:id", async (c) => {
  try {
    const payload = c.get('jwtPayload');
    if (!payload) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { id } = c.req.param();

    if (!id) {
      return c.json({ message: "Pokémon ID is required" }, 400);
    }

    // Find the caught Pokémon
    const caughtPokemon = await prisma.caughtPokemon.findFirst({
      where: { 
        id: id, 
        userId: payload.sub 
      }
    });

    if (!caughtPokemon) {
      return c.json({ message: "Pokémon not found or does not belong to you" }, 404);
    }

    // Delete the caught Pokémon
    await prisma.caughtPokemon.delete({
      where: { id: id }
    });

    return c.json({ message: "Pokémon released successfully" });
  } catch (e) {
    if (e instanceof HTTPException) {
      throw e;
    }
    console.error("Release Pokémon error:", e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

/**
 * Get all caught Pokémon for the authenticated user
 * @route GET /protected/caught
 */
app.get("/protected/caught", async (c) => {
  try {
    const payload = c.get('jwtPayload');
    if (!payload) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const caughtPokemon = await prisma.caughtPokemon.findMany({
      where: { userId: payload.sub },
      include: { pokemon: true },
      orderBy: { caughtAt: 'desc' }
    });

    return c.json({ 
      message: "Caught Pokémon retrieved successfully",
      count: caughtPokemon.length,
      data: caughtPokemon 
    });
  } catch (e) {
    if (e instanceof HTTPException) {
      throw e;
    }
    console.error("Get caught Pokémon error:", e);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ message: "Route not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }
  
  return c.json({ message: "Internal Server Error" }, 500);
});

export default app;
