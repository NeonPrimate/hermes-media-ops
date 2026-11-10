import { jsx } from "react/jsx-runtime";

function MediaOpsPane() {
  return jsx("div", {
    style: {
      display: "grid",
      gap: "10px",
      padding: "12px",
      color: "var(--ui-text-primary)",
    },
    children: [
      jsx("h3", { children: "Media Ops", key: "title" }),
      jsx("p", {
        style: { color: "var(--ui-text-secondary)", margin: 0 },
        children: "Connect this Hermes desktop to a Media Operations MCP server.",
        key: "description",
      }),
      jsx("p", {
        style: { color: "var(--ui-text-secondary)", margin: 0 },
        children: "Connection setup is not implemented yet.",
        key: "status",
      }),
    ],
  });
}

export default {
  id: "hermes-media-ops",
  name: "Media Ops",
  description: "Configure and operate Media Operations MCP integrations.",
  defaultEnabled: false,
  register(ctx) {
    ctx.register({
      id: "media-ops-pane",
      area: "panes",
      data: { placement: "right", title: "Media Ops", width: "360px" },
      render: () => jsx(MediaOpsPane, {}),
    });
  },
};
