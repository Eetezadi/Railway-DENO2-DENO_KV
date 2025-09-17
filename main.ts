/**
 * A simple demonstration of Deno KV with a web interface.
 * This example shows how to:
 * - Use Deno KV for data storage
 * - Create a web server with Deno
 * - Handle different routes and response types (HTML and JSON)
 * - Structure a small but complete web application
 *
 * @module
 */

/**
 * Represents user data stored in the KV store.
 * All fields are required.
 */
export interface UserData {
  /** The full name of the user */
  name: string;
  /** The country where the user is from */
  country: string;
  /** When the user registered */
  registered: Date;
}

/**
 * Adds or updates a user in the KV store.
 * Uses a composite key structure ['users', username] for easy listing and retrieval.
 *
 * @param kv - The Deno KV store instance
 * @param username - Unique identifier for the user
 * @param data - User information to store
 * @returns A promise that resolves to the Deno.KvCommitResult
 */
export async function addUser(kv: Deno.Kv, username: string, data: UserData) {
  const userKey = ["users", username];
  return await kv.set(userKey, data);
}

/**
 * Retrieves a user from the KV store by username.
 *
 * @param kv - The Deno KV store instance
 * @param username - The username to look up
 * @returns The user data if found, null otherwise
 */
export async function getUser(kv: Deno.Kv, username: string) {
  const userKey = ["users", username];
  const entry = await kv.get<UserData>(userKey);
  return entry.value;
}

/**
 * HTTP request handler for the web server.
 * Supports two routes:
 * - GET / : Shows an HTML list of all users
 * - GET /users/:username : Returns JSON data for a specific user
 *
 * For a proper Webserver consider using a framework like Hono, Oak or Fresh.
 *
 * @param req - The incoming HTTP request
 * @param kv - The Deno KV store instance to use
 * @returns A Response with either HTML or JSON content
 */
export async function handleRequest(
  req: Request,
  kv: Deno.Kv,
): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.split("/");

  // Handle root path - show list of all users
  if (url.pathname === "/") {
    const userList = kv.list({ prefix: ["users"] });
    let html = "<html><head><title>Users List</title></head><body>";
    html += "<h1>Users List</h1><ul>";

    for await (const entry of userList) {
      const username = entry.key[1] as string;
      const user = entry.value as UserData;
      html +=
        `<li><a href="/users/${username}">${user.name}</a> from ${user.country}</li>`;
    }

    html += "</ul></body></html>";
    return new Response(html, {
      headers: { "content-type": "text/html" },
    });
  }

  // Handle /users/:username path and return user data as JSON
  if (path[1] === "users" && path[2]) {
    const username = path[2];
    const user = await getUser(kv, username);

    if (user) {
      return new Response(JSON.stringify(user), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response("User not found", { status: 404 });
    }
  }

  return new Response("Invalid path", { status: 400 });
}

/**
 * Sets up graceful shutdown handling for the server.
 * Ensures clean exit on SIGTERM (Docker/Railway) and SIGINT (Ctrl+C).
 *
 * @param server - The Deno server instance to shut down
 * @param kv - The KV store instance to close
 */
function setupGracefulShutdown(
  server: ReturnType<typeof Deno.serve>,
  kv: Deno.Kv,
) {
  const shutdownHandler = () => {
    console.log("Received shutdown signal, closing server gracefully...");
    server.shutdown();

    // Allow in-flight requests to complete
    setTimeout(async () => {
      await kv.close();
      console.log("Shutdown complete");
      Deno.exit(0);
    }, 100);
  };

  // Handle Docker/Railway shutdown and Ctrl+C
  Deno.addSignalListener("SIGTERM", shutdownHandler);
  Deno.addSignalListener("SIGINT", shutdownHandler);
}

/**
 * Main application entry point.
 * When run directly, this function:
 * 1. Opens a connection to the Deno KV store located in /db
 * 2. Populates it with sample user data
 * 3. Starts a web server on port 8000
 * 4. Sets up graceful shutdown handling
 *
 * The server provides a simple web interface to view the sample data.
 */
async function main() {
  // Initialize the KV store
  // In Railway, create a persistent volume named '/app/db' (Railway deploy to /app)
  const kv = await Deno.openKv("./db/deno_kv.db");

  // Define sample users with diverse backgrounds
  const users = [
    {
      username: "yasmin",
      data: {
        name: "Yasmin Nasser",
        country: "Palestine",
        registered: new Date("2025-08-27"),
      },
    },
    {
      username: "isabella",
      data: {
        name: "Isabella Rodriguez",
        country: "Colombia",
        registered: new Date("2025-09-01"),
      },
    },
    {
      username: "pierre",
      data: {
        name: "Pierre Dubois",
        country: "France",
        registered: new Date("2025-09-10"),
      },
    },
  ];

  // Add all users to the KV store
  for (const user of users) {
    await addUser(kv, user.username, user.data);
    console.log(`Added user ${user.data.name} from ${user.data.country}`);
  }

  // Get port from environment variable or use default 8000
  const port = parseInt(Deno.env.get("PORT") || "8000");

  // Create and start the server
  const server = Deno.serve({ port }, (req) => handleRequest(req, kv));

  // Set up graceful shutdown handling, this is important to avoid data corruption and crashes on Railway
  setupGracefulShutdown(server, kv);

  // Log server information
  console.log(`Server running at http://localhost:${port}`);
  console.log("Available routes:");
  console.log("GET / : Shows list of all users");
  console.log("GET /users/:username : Shows details for a specific user");

  // Wait for server to finish
  await server.finished;
}

// This ensures the main function is called only when the script is executed directly
if (import.meta.main) {
  main().catch(console.error);
}
