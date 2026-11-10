# Hermes Media Ops

![Hermes Media Ops](assets/hero-hermes-media-ops.png)

> **Connect your media stack once. Ask Hermes for what you want.**

Hermes Media Ops makes a self-hosted media library easier to use without turning every movie night into an administration task. Connect an existing Media Operations MCP server, test it safely, and register it with Hermes Desktop. After that, ask Hermes about your library in plain language.

## What this plugin provides

- A dedicated **Media Ops** page in Hermes Desktop
- Persistent storage for the MCP endpoint
- A read-only connection and service-health check
- Clear visibility into which connected services are available
- Explicit, confirmation-gated registration in Hermes
- Registration read-back verification before reporting success

The plugin is the setup and trust layer. The MCP server supplies the media capabilities, and Hermes provides the natural-language interface.

![Connection gate](assets/screenshot-connection-gated.png)

*Registration remains disabled until the endpoint passes a read-only connection test.*

![Verified connection](assets/screenshot-connection-verified.png)

*Test the connection and see which parts of the media stack are available before using them through Hermes.*

## The result: ask instead of app-juggle

Once connected, Hermes can help answer questions such as:

- “What movies are available this month?”
- “What is already in my library?”
- “Why is this episode missing?”
- “Show me what is currently downloading.”
- “Explain the best release choices before I decide.”

![Natural-language result](assets/screenshot-natural-language-result.png)

*Ask Hermes in plain language and receive a structured, understandable answer.*

## How the pieces fit together

![Hermes Media Ops architecture](assets/architecture-hermes-media-ops.png)

- **Hermes Media Ops plugin** — connects, tests, and verifies the endpoint
- **Media Operations MCP** — exposes media-management capabilities
- **Hermes Agent** — turns natural-language requests into understandable actions and explanations
- **Your services** — Radarr, Sonarr, Overseerr, Bazarr, qBittorrent, and other supported services

## Safety boundaries

The current plugin milestone is deliberately narrow:

- The connection test is read-only.
- Registration is a separate explicit action.
- Registration requires a successful test of the same endpoint.
- Hermes configuration changes are confirmed by the user.
- The plugin does not install Docker containers or change infrastructure.
- The plugin does not store service API keys or passwords.
- The plugin does not silently search, grab, delete, or modify media.

## Requirements and current limitations

- Hermes Desktop with desktop plugin support
- An already-running Media Operations MCP endpoint
- The endpoint must expose the read-only `/api/health` check used by this plugin
- The endpoint must be reachable from the machine running Hermes Desktop
- Direct browser requests may require the MCP deployment to permit the desktop origin

The current release focuses on connecting and verifying an existing remote HTTP MCP endpoint. Local stdio installation, Docker-managed deployment, generic MCP discovery, and automatic media actions are not part of this release.

## Companion backend

The companion public backend package is here:

<https://github.com/NeonPrimate/media-ops-mcp>

It is our sanitized Media Operations distribution built from the upstream `arr-mcp` project:

<https://github.com/sandraschi/arr-mcp>

## Development

The plugin is a single uncompiled ESM file. The catalog entrypoint is:

```text
desktop/plugin.js
```

Validate syntax with:

```bash
node --check desktop/plugin.js
```

## License

MIT. See [`LICENSE`](LICENSE).
