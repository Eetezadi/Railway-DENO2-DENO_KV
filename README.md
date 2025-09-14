# Deno 2 with Deno KV Starter Template for Railway

A production-ready starter template showcasing Deno KV with a web interface.
While Railway's default runtime doesn't support Deno 2 yet, this template
provides a custom Docker configuration to ensure full compatibility.

This repo is also ready for Github Codespaces.

## Features

- 🌐 **Web Interface**: Simple HTTP server with HTML and JSON endpoints
- 🗄️ **Deno KV Storage**: Deno's built-in persistent key-value store based on
  Sqlite in folder /db.
- 🚂 **Railway Ready**: Configured for easy deployment

## Railway Deployment

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/new/template/ZweBXA?utm_medium=integration&utm_source=button&utm_campaign=generic)

### Deploy on Railway using CLI

Run this reposiroy on Github Codespaces, install Railway CLI and deploy:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway link
railway up
```

## Available Commands

```bash
# Start development server with hot reload
deno task dev

# Run tests
deno task test

# Run production server
deno task start
```

## License

This project is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.

## Acknowledgments

- [Deno](https://deno.land/) for the runtime
- [Railway](https://railway.app/) for hosting

---

Made with ❤️ by [Eetezadi](https://github.com/Eetezadi)
