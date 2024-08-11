FROM oven/bun:canary AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules

# run the app
RUN apt-get update && \
    apt-get install -y libasound2 libgtk-3-0 libnss3 libdrm2 libgbm1 chromium
COPY . .
ENTRYPOINT [ "bun", "run", "index.ts" ]
