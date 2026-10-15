export const PATHS: readonly string[] = [
  "/",
  "/about",
  "/projects",
  "/tools",
  "/marketplace",
  "/faq",
] as const;

export const NAV_PATHS = PATHS.filter((p) => p !== "/");

