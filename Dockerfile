# Use Alpine Deno for smaller production image size
FROM denoland/deno:alpine-${DENO_VERSION}

# Set the working directory
WORKDIR /app

# Copy dependency files first (better layer caching)
COPY deno.json deno.lock ./

# Install dependencies (cached unless deno.json changes)
RUN deno install

# Copy source code
COPY . .

# Cache the main application
RUN deno cache src/main.ts

# Configure port (defaults to 8000, can be overridden at runtime)
ENV PORT=8000
EXPOSE $PORT

# Run using task
CMD ["task", "start"]