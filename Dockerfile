# Use Alpine Deno for smaller production image size
FROM denoland/deno:alpine-2.6.9

# Set the working directory
WORKDIR /app

# Copy dependency files first (better layer caching)
COPY deno.json deno.lock ./

# Install dependencies (cached unless deno.json changes)
RUN deno install

# Copy source code
COPY . .

# Cache the main application
RUN deno cache main.ts

# Configure port (defaults to 8000, can be overridden at runtime)
ARG PORT=8000
EXPOSE $PORT

# Run using task
CMD ["deno", "task", "start"]
