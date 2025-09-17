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

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/IIoiXB?referralCode=wOLOAa)

### Deploy on Railway using CLI

Run this reposiroy on Github Codespaces, install Railway CLI and deploy:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Data Persistence

The template is configured for persistent data storage using volumes (Railway
deploys on `/app`):

- Database path: `/app/db/deno_kv.db`
- Automatically creates persistent volume
- Survives deployments and restarts

## Available Commands

```bash
# Start development server with hot reload
deno task dev

# Run tests
deno task test

# Run production server
deno task start
```

## Why Deploy Deno 2 and Deno KV on Railway?

Railway is a singular platform to deploy your infrastructure stack. Railway will
host your infrastructure so you don't have to deal with configuration, while
allowing you to vertically and horizontally scale it. This template gets you
started with Deno 2 and Deno KV with a single click.

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
