import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetRepairRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["repairRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRepairRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRepairRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      racketBrand: string;
      damageDescription: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitRepairRequest(
        data.name,
        data.email,
        data.phone,
        data.racketBrand,
        data.damageDescription,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

export function useUpdateRepairRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      email: string;
      phone: string;
      racketBrand: string;
      damageDescription: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRepairRequest(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.racketBrand,
        data.damageDescription,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

export function useDeleteRepairRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteRepairRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}
