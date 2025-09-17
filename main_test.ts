/**
 * Test suite for the Deno KV demo application.
 * Tests both the core KV operations and the HTTP server functionality.
 * Uses in-memory KV store to avoid side effects.
 * @module
 */

import { assert, assertEquals, assertExists } from "@std/assert";
import { addUser, getUser, handleRequest, type UserData } from "./main.ts";

/**
 * Tests the core user management functions.
 */
Deno.test("main.ts logic", async (t) => {
  // Using :memory: creates an isolated, temporary database for testing
  // This ensures our tests don't interfere with the real database
  const kv = await Deno.openKv(":memory:");

  await t.step("addUser() and getUser()", async () => {
    const username = "test_user";
    const userData: UserData = {
      name: "Test User",
      country: "Testland",
      registered: new Date(),
    };

    // Test adding a user
    const setResult = await addUser(kv, username, userData);
    assertExists(setResult.versionstamp);
    assertEquals(setResult.ok, true);

    // Test retrieving the user
    const retrievedUser = await getUser(kv, username);
    assertEquals(retrievedUser, userData);
  });

  await t.step("getUser() with non-existent user", async () => {
    const retrievedUser = await getUser(kv, "non_existent_user");
    assertEquals(retrievedUser, null);
  });

  kv.close();
});

/**
 * Tests the HTTP server request handler.
 * Verifies:
 * - Listing users on the root path
 * - Fetching individual user details
 * - Handling non-existent users
 * - Handling invalid paths
 */
Deno.test("HTTP server handler", async (t) => {
  // Each test gets its own fresh in-memory database
  // This ensures a clean state for testing the HTTP endpoints
  const kv = await Deno.openKv(":memory:");

  await t.step("handles valid user request", async () => {
    // Add a test user
    const userData: UserData = {
      name: "Test User",
      country: "Test Country",
      registered: new Date(),
    };
    await addUser(kv, "testuser", userData);

    // Test the request
    const req = new Request("http://localhost:8000/users/testuser");
    const res = await handleRequest(req, kv);

    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "application/json");

    const body = await res.json();
    assertEquals(body.name, userData.name);
    assertEquals(body.country, userData.country);
    assertEquals(new Date(body.registered), userData.registered);
  });

  await t.step("handles non-existent user", async () => {
    const req = new Request("http://localhost:8000/users/nonexistent");
    const res = await handleRequest(req, kv);

    assertEquals(res.status, 404);
    assertEquals(await res.text(), "User not found");
  });

  await t.step("handles invalid path", async () => {
    const req = new Request("http://localhost:8000/invalid");
    const res = await handleRequest(req, kv);

    assertEquals(res.status, 400);
    assertEquals(await res.text(), "Invalid path");
  });

  await t.step("displays list of users on root path", async () => {
    // Add some test users
    const users = [
      {
        username: "amara",
        data: {
          name: "Amara Okafor",
          country: "Nigeria",
          registered: new Date(),
        },
      },
      {
        username: "zola",
        data: {
          name: "Zola Ndlovu",
          country: "South Africa",
          registered: new Date(),
        },
      },
    ];

    for (const user of users) {
      await addUser(kv, user.username, user.data);
    }

    const req = new Request("http://localhost:8000/");
    const res = await handleRequest(req, kv);

    assertEquals(res.status, 200);
    assertEquals(res.headers.get("content-type"), "text/html");

    const html = await res.text();
    // Check if each user appears in the HTML
    for (const user of users) {
      assert(
        html.includes(user.data.name),
        `HTML should contain user ${user.data.name}`,
      );
      assert(
        html.includes(user.data.country),
        `HTML should contain country ${user.data.country}`,
      );
      assert(
        html.includes(`/users/${user.username}`),
        `HTML should contain link to ${user.username}`,
      );
    }
  });

  kv.close();
});
