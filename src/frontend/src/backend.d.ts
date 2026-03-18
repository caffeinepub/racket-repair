import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StockItem {
    id: bigint;
    name: string;
    unit: string;
    category: string;
}
export interface StockTransaction {
    id: bigint;
    itemId: bigint;
    notes: string;
    timestamp: Time;
    quantity: bigint;
    txType: string;
}
export type Time = bigint;
export interface RepairRequest {
    id: bigint;
    status: string;
    serviceType: string;
    damageDescription: string;
    submissionTimestamp: Time;
    name: string;
    email: string;
    numberOfRackets: bigint;
    paymentMode: string;
    phone: string;
    charges: string;
    racketBrand: string;
    stringType: string;
}
export interface backendInterface {
    addStockItem(name: string, category: string, unit: string): Promise<void>;
    addStockTransaction(itemId: bigint, txType: string, quantity: bigint, notes: string): Promise<boolean>;
    deleteRepairRequest(id: bigint): Promise<boolean>;
    deleteStockItem(id: bigint): Promise<boolean>;
    deleteStockTransaction(id: bigint): Promise<boolean>;
    getAllRepairRequests(): Promise<Array<RepairRequest>>;
    getStockItems(): Promise<Array<StockItem>>;
    getStockTransactions(): Promise<Array<StockTransaction>>;
    submitRepairRequest(name: string, email: string, phone: string, racketBrand: string, damageDescription: string, serviceType: string, stringType: string, paymentMode: string, numberOfRackets: bigint): Promise<void>;
    updateRepairRequest(id: bigint, name: string, email: string, phone: string, racketBrand: string, damageDescription: string, serviceType: string, stringType: string, paymentMode: string, status: string, numberOfRackets: bigint, charges: string): Promise<boolean>;
    updateStatus(id: bigint, status: string): Promise<boolean>;
}
