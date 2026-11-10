# Hermes Media Ops

Hermes desktop plugin for configuring and operating Media Operations MCP integrations.

## Current milestone

The first milestone is a small, read-only connection setup pane for an existing Media Operations MCP server. It will test the endpoint, discover capabilities, and report enabled integrations before adding deployment helpers or mutation controls.

## Repository structure

- `plugin.js` — desktop plugin entry point
- `docs/` — design and security notes

The backend MCP server remains a separate project. This plugin will configure and present that server rather than duplicate Radarr, Sonarr, or Seerr logic.
