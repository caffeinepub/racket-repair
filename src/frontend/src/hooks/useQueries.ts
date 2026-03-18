import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RepairRequest, StockItem, StockTransaction } from "../backend";
import { useActor } from "./useActor";

export function useRepairRequests() {
  const { actor, isFetching } = useActor();
  return useQuery<RepairRequest[]>({
    queryKey: ["repairRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const results = await actor.getAllRepairRequests();
      return results.sort(
        (a, b) => Number(b.submissionTimestamp) - Number(a.submissionTimestamp),
      );
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: 3000,
    staleTime: 10000,
  });
}

export function useSubmitRepair() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      racketBrand: string;
      damageDescription: string;
      serviceType: string;
      stringType: string;
      paymentMode: string;
      numberOfRackets: bigint;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      await actor.submitRepairRequest(
        data.name,
        data.email,
        data.phone,
        data.racketBrand,
        data.damageDescription,
        data.serviceType,
        data.stringType,
        data.paymentMode,
        data.numberOfRackets,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

export function useUpdateStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

export function useUpdateRepair() {
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
      serviceType: string;
      stringType: string;
      paymentMode: string;
      status: string;
      numberOfRackets: bigint;
      charges: string;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.updateRepairRequest(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.racketBrand,
        data.damageDescription,
        data.serviceType,
        data.stringType,
        data.paymentMode,
        data.status,
        data.numberOfRackets,
        data.charges,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

export function useDeleteRepair() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.deleteRepairRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repairRequests"] });
    },
  });
}

// --- Stock / Inventory hooks ---

export function useStockItems() {
  const { actor, isFetching } = useActor();
  return useQuery<StockItem[]>({
    queryKey: ["stockItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10000,
  });
}

export function useStockTransactions() {
  const { actor, isFetching } = useActor();
  return useQuery<StockTransaction[]>({
    queryKey: ["stockTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStockTransactions();
    },
    enabled: !!actor && !isFetching,
    staleTime: 10000,
  });
}

export function useAddStockItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      unit: string;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.addStockItem(data.name, data.category, data.unit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockItems"] });
    },
  });
}

export function useAddStockTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      itemId: bigint;
      txType: string;
      quantity: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.addStockTransaction(
        data.itemId,
        data.txType,
        data.quantity,
        data.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockTransactions"] });
    },
  });
}

export function useDeleteStockItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.deleteStockItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockItems"] });
      queryClient.invalidateQueries({ queryKey: ["stockTransactions"] });
    },
  });
}

export function useDeleteStockTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend not ready");
      return actor.deleteStockTransaction(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockTransactions"] });
    },
  });
}
