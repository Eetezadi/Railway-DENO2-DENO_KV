import { assertEquals, assertExists } from "@std/assert";

Deno.test("Deno KV operations", async (t) => {
  // Use an in-memory KV store for testing to ensure no side-effects.
  const kv = await Deno.openKv(":memory:");

  await t.step("set and get", async () => {
    const user = "test_user";
    const userKey = ["users", user];
    const userData = { name: "Test User" };

    const setResult = await kv.set(userKey, userData);
    assertExists(setResult.versionstamp);

    const getResult = await kv.get(userKey);
    assertEquals(getResult.key, userKey);
    assertEquals(getResult.value, userData);
    assertEquals(getResult.versionstamp, setResult.versionstamp);
  });

  await t.step("delete", async () => {
    const key = ["a", "b"];
    await kv.set(key, "test");

    await kv.delete(key);

    const result = await kv.get(key);
    assertEquals(result.value, null);
  });

  kv.close();
});
