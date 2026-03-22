import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";

let cachedActor: backendInterface | null = null;

export async function getActor(): Promise<backendInterface> {
  if (!cachedActor) {
    cachedActor = await createActorWithConfig();
  }
  return cachedActor;
}

export function clearActorCache() {
  cachedActor = null;
}
