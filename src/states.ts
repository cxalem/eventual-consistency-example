type Modes = "BOOT" | "LIVE";

let mode = "BOOT" as Modes;

export function getMode() {
  return mode;
}

export function setMode(newMode: "BOOT" | "LIVE") {
  if (newMode !== "BOOT" && newMode !== "LIVE") {
    throw new Error("Invalid mode");
  }

  mode = newMode;
}
