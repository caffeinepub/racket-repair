import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RepairRequest {
    damageDescription: string;
    submissionTimestamp: Time;
    name: string;
    email: string;
    phone: string;
    racketBrand: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllRepairRequests(): Promise<Array<RepairRequest>>;
    submitRepairRequest(name: string, email: string, phone: string, racketBrand: string, damageDescription: string): Promise<void>;
}
