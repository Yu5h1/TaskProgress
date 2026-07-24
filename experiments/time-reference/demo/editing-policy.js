const localEditingHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function canEditFromLocation(locationLike) {
  const protocol = String(locationLike?.protocol ?? "").toLowerCase();
  const hostname = String(locationLike?.hostname ?? "")
    .toLowerCase()
    .replace(/\.$/, "");

  if (protocol === "file:") return hostname === "" || hostname === "localhost";
  return ["http:", "https:"].includes(protocol) && localEditingHosts.has(hostname);
}

globalThis.TimeEditingPolicy = Object.freeze({
  canEditFromLocation,
});
