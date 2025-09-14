/**
 * A simple demonstration of Deno KV.
 */

// By default, Deno.openKv() will open a local SQLite-backed store.
const kv = await Deno.openKv("./db/deno_kv.db");

// Define a key and a value.
const user = "yasmin";
const userKey = ["users", user];
const userData = {
  name: "Yasmin",
  country: "Palestine",
  registered: new Date("2025-08-27"),
};

// Set a value in the KV store.
const setResult = await kv.set(userKey, userData);
console.log(
  `Value set for key '${
    userKey.join(".")
  }'. Versionstamp: ${setResult.versionstamp}`,
);

// Retrieve the value.
const entry = await kv.get(userKey);
console.log(`Retrieved value for key '${entry.key.join(".")}':`, entry.value);

// List entries with a given prefix.
const iter = kv.list({ prefix: ["users"] });
for await (const res of iter) {
  console.log(`Found user: ${String(res.key[1])}`);
}

// The KV store will be automatically closed when the process exits.
// Or you can explicitly close it.
kv.close();
