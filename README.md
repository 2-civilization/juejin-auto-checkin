# juejin-auto-checkin

![juejin-auto-checkin](https://socialify.git.ci/lonzzi/juejin-auto-checkin/image?font=Inter&language=1&logo=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F16703019&name=1&owner=1&pattern=Plus&stargazers=1&theme=Auto)

## Features

- Simulate clicks using Puppeteer.
- Send notifications using PushPlus.
- Use bun runtime to run TypeScript.

## Usage

### Docker

Use with docker compose:

```shell
mkdir juejin-auto-checkin
cd juejin-auto-checkin
wget https://raw.githubusercontent.com/lonzzi/juejin-auto-checkin/main/docker-compose.yml

docker compose up -d
```

Wait for the container to start, and then check the logs:

```shell
docker compose logs
```

### Maunal

To run this project, you need to have [bun](https://bun.sh/) installed.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Configuration

### Environment Variables

- `PUSH_PLUS_TOKEN`: Token of pushplus (optional)
- `CRON`: Cron expression, [Cron Syntax](https://github.com/kelektiv/node-cron?tab=readme-ov-file#cron-patterns) (optional, default: `0 0 8 * * *`)

## License

[MIT](./LICENSE)
