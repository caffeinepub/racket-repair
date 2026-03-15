import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { useInternetIdentity } from "./useInternetIdentity";

export function useActor() {
  const { identity } = useInternetIdentity();
  const actorQuery = useQuery<backendInterface>({
    queryKey: ["actor", identity?.getPrincipal().toString() ?? "anon"],
    queryFn: async () => {
      if (!identity) {
        return await createActorWithConfig();
      }
      return await createActorWithConfig({
        agentOptions: { identity },
      });
    },
    staleTime: 30_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
    isError: actorQuery.isError,
    refetch: actorQuery.refetch,
  };
}
