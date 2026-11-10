import { host, ROUTES_AREA, SIDEBAR_NAV_AREA } from "@hermes/plugin-sdk";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

function healthUrl(endpoint) {
  const raw = endpoint.trim();
  const trimmed = raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (!trimmed) return "";
  return `${trimmed.endsWith("/mcp") ? trimmed.slice(0, -4) : trimmed}/api/health`;
}

function ConnectionSection({ storage }) {
  const [endpoint, setEndpoint] = useState("");
  const [status, setStatus] = useState({ kind: "idle", message: "" });
  const [services, setServices] = useState([]);
  const [testedEndpoint, setTestedEndpoint] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("");

  useEffect(() => {
    Promise.resolve(storage.get("endpoint")).then((saved) => {
      if (typeof saved === "string" && saved) setEndpoint(saved);
    });
  }, [storage]);

  async function testConnection() {
    const url = healthUrl(endpoint);
    if (!url) {
      setStatus({ kind: "error", message: "Enter an MCP server URL first." });
      return;
    }
    setStatus({ kind: "working", message: "Testing connection…" });
    setServices([]);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || `HTTP ${response.status}`);
      }
      setServices(Object.entries(payload.data || {}).map(([name, value]) => ({
        name,
        value: value?.reachable === true ? "Connected" : value?.reachable === false ? "Unavailable" : "Reported",
      })));
      await Promise.resolve(storage.set("endpoint", endpoint.trim()));
      setTestedEndpoint(endpoint.trim());
      setStatus({ kind: "success", message: "Media Operations MCP is reachable." });
      host.notify({ kind: "success", message: "Media Operations MCP connection succeeded." });
    } catch (error) {
      setStatus({ kind: "error", message: `Connection failed: ${error.message}` });
    }
  }

  async function registerWithHermes() {
    const value = endpoint.trim();
    if (!value || value !== testedEndpoint) {
      setRegistrationStatus("Test this endpoint successfully before registering it.");
      return;
    }
    if (!window.confirm("Register Media Operations MCP in Hermes? This changes Hermes MCP configuration.")) return;
    setRegistrationStatus("Registering with Hermes…");
    try {
      const added = await host.request("mcp.servers.add", {
        name: "media-ops",
        config: { url: value },
      });
      const configured = await host.request("mcp.servers.list", {});
      const entries = configured?.servers || configured?.result?.servers || [];
      const found = entries.some((entry) => entry?.name === "media-ops" && entry?.url === value);
      if (!found && added?.server?.url !== value) throw new Error("Hermes did not return the registered server during verification.");
      setRegistrationStatus("Registered in Hermes MCP configuration.");
      host.notify({ kind: "success", message: "Media Operations MCP registered in Hermes." });
    } catch (error) {
      setRegistrationStatus(`Registration failed: ${error.message}`);
    }
  }

  return jsxs("section", {
    className: "flex max-w-3xl flex-col gap-4 rounded-lg border border-(--ui-stroke-secondary) p-5",
    children: [
      jsx("div", { className: "text-lg font-medium", children: "Existing MCP connection" }),
      jsx("div", {
        className: "text-(--ui-text-tertiary)",
        children: "Connect Hermes Desktop to an existing Media Operations MCP server. This test is read-only.",
      }),
      jsx("label", {
        className: "flex flex-col gap-1",
        children: [
          jsx("span", { className: "text-(--ui-text-secondary)", children: "MCP server URL" }),
          jsx("input", {
            className: "rounded border border-(--ui-stroke-secondary) bg-transparent px-3 py-2",
            type: "url",
            placeholder: "http://media-ops-host:10938/mcp",
            value: endpoint,
            onChange: (event) => setEndpoint(event.target.value),
          }),
        ],
      }),
      jsxs("div", {
        className: "flex flex-wrap gap-2",
        children: [
          jsx("button", {
            className: "w-fit rounded border border-(--ui-accent) px-3 py-2 font-medium text-(--ui-accent) shadow-sm transition hover:bg-(--ui-accent)/10 disabled:cursor-not-allowed disabled:opacity-50",
            type: "button",
            onClick: testConnection,
            children: "Test connection",
          }),
          jsx("button", {
            className: "w-fit rounded border border-(--ui-accent) px-3 py-2 font-medium text-(--ui-accent) shadow-sm transition hover:bg-(--ui-accent)/10 disabled:cursor-not-allowed disabled:opacity-50",
            type: "button",
            disabled: endpoint.trim() !== testedEndpoint,
            onClick: registerWithHermes,
            children: "Register in Hermes",
          }),
        ],
      }),
      registrationStatus ? jsx("div", { className: "text-(--ui-text-secondary)", children: registrationStatus }) : null,
      status.message
        ? jsx("div", {
            className: status.kind === "error" ? "text-(--ui-danger)" : "text-(--ui-text-secondary)",
            children: status.message,
          })
        : null,
      services.length
        ? jsxs("div", {
            className: "flex flex-col gap-1",
            children: [
              jsx("div", { className: "font-medium", children: "Service status" }),
              ...services.map((service) =>
                jsxs("div", {
                  className: "flex justify-between text-(--ui-text-secondary)",
                  children: [jsx("span", { children: service.name }), jsx("span", { children: service.value })],
                  key: service.name,
                }),
              ),
            ],
          })
        : null,
    ],
  });
}

function MediaOpsPage({ storage }) {
  return jsxs("main", {
    className: "flex h-full flex-col gap-6 overflow-auto p-8",
    children: [
      jsx("div", {
        children: [
          jsx("h1", { className: "text-2xl font-semibold", children: "Media Ops" }),
          jsx("p", {
            className: "mt-2 text-(--ui-text-tertiary)",
            children: "Configure and operate Media Operations MCP integrations.",
          }),
        ],
      }),
      jsx(ConnectionSection, { storage }),
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
      id: "media-ops-page",
      area: ROUTES_AREA,
      data: { path: "/media-ops" },
      render: () => jsx(MediaOpsPage, { storage: ctx.storage }),
    });
    ctx.register({
      id: "media-ops-nav",
      area: SIDEBAR_NAV_AREA,
      data: { path: "/media-ops", label: "Media Ops", codicon: "device-camera-video" },
    });
  },
};
