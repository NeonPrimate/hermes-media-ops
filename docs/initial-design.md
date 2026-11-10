# Initial design

## Goal

Provide a guided Hermes desktop setup experience for a Media Operations MCP server without duplicating provider-specific logic in the plugin.

## First milestone

1. Load as a disabled-by-default desktop plugin.
2. Render a Media Ops pane.
3. Accept an existing MCP endpoint.
4. Test connectivity through the appropriate Hermes gateway/configuration path.
5. Discover and display server capabilities and integration status.
6. Keep all operations read-only.

## Later milestones

- Existing remote MCP registration
- Local stdio configuration
- Optional, explicit Docker deployment assistance
- Tool-group visibility controls
- Scheduled media-discovery digests
- Diagnostics and version compatibility checks

## Safety boundaries

- Never install Docker or access the Docker socket silently.
- Never store API keys in source files or plain plugin state.
- Keep release ranking and grab validation in the MCP backend.
- Keep grab tools disabled by default in the setup UI.
- Require explicit confirmation before changing Hermes MCP configuration.
