import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteRepairRequest,
  useGetRepairRequests,
  useUpdateRepairRequest,
} from "@/hooks/useQueries";
import {
  Inbox,
  Loader2,
  LogOut,
  Pencil,
  Printer,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RepairRequest } from "../backend.d";
import { AdminLogin } from "./AdminLogin";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const date = new Date(ms);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("racketfix_admin") === "true",
  );

  function handleLogout() {
    localStorage.removeItem("racketfix_admin");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function EditDialog({
  request,
  open,
  onClose,
}: {
  request: RepairRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    racketBrand: "",
    damageDescription: "",
  });
  const updateMutation = useUpdateRepairRequest();

  // Sync form when request changes
  const prevId = useState<bigint | null>(null);
  if (request && request.id !== prevId[0]) {
    prevId[1](request.id);
    setForm({
      name: request.name,
      email: request.email,
      phone: request.phone,
      racketBrand: request.racketBrand,
      damageDescription: request.damageDescription,
    });
  }

  function handleSave() {
    if (!request) return;
    updateMutation.mutate(
      { id: request.id, ...form },
      {
        onSuccess: () => {
          toast.success("Booking updated successfully");
          onClose();
        },
        onError: () => {
          toast.error("Failed to update booking");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="admin.dialog"
        style={{ backgroundColor: "#ffffff", border: "1px solid #c7d8f5" }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#0f2d6e", fontWeight: 800 }}>
            Edit Booking
          </DialogTitle>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Name
            </Label>
            <Input
              data-ocid="admin.edit.input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Phone
            </Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Email
            </Label>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Racket Brand
            </Label>
            <Input
              value={form.racketBrand}
              onChange={(e) =>
                setForm((p) => ({ ...p, racketBrand: e.target.value }))
              }
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
          <div>
            <Label
              style={{ color: "#5c7aaa", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Damage Description
            </Label>
            <Textarea
              data-ocid="admin.edit.textarea"
              value={form.damageDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, damageDescription: e.target.value }))
              }
              rows={3}
              style={{ borderColor: "#c7d8f5", marginTop: 4 }}
            />
          </div>
        </div>
        <DialogFooter style={{ marginTop: 8 }}>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="admin.edit.cancel_button"
            style={{ borderColor: "#c7d8f5", color: "#5c7aaa" }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending}
            data-ocid="admin.edit.save_button"
            style={{
              backgroundColor: "#1a56db",
              color: "#ffffff",
              border: "none",
            }}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 6,
                    display: "inline",
                  }}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAlertDialog({
  request,
  open,
  onClose,
}: {
  request: RepairRequest | null;
  open: boolean;
  onClose: () => void;
}) {
  const deleteMutation = useDeleteRepairRequest();

  function handleDelete() {
    if (!request) return;
    deleteMutation.mutate(request.id, {
      onSuccess: () => {
        toast.success("Booking deleted");
        onClose();
      },
      onError: () => {
        toast.error("Failed to delete booking");
      },
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent
        data-ocid="admin.delete.dialog"
        style={{ backgroundColor: "#ffffff", border: "1px solid #fca5a5" }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: "#0f2d6e", fontWeight: 800 }}>
            Delete Booking
          </AlertDialogTitle>
          <AlertDialogDescription style={{ color: "#5c7aaa" }}>
            Are you sure you want to delete the booking for{" "}
            <strong style={{ color: "#0f2d6e" }}>{request?.name}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="admin.delete.cancel_button"
            style={{ borderColor: "#c7d8f5", color: "#5c7aaa" }}
            onClick={onClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="admin.delete.confirm_button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            style={{
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
            }}
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2
                  style={{
                    width: 14,
                    height: 14,
                    marginRight: 6,
                    display: "inline",
                  }}
                  className="animate-spin"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: requests, isLoading, isError } = useGetRepairRequests();
  const [editTarget, setEditTarget] = useState<RepairRequest | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RepairRequest | null>(null);

  const generatedDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function handlePrint() {
    window.print();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-statement, #print-statement * { visibility: visible !important; }
          #print-statement {
            position: fixed !important;
            display: block !important;
            top: 0; left: 0; width: 100%;
            padding: 24px;
            background: white;
            color: #111;
            font-family: Arial, sans-serif;
            font-size: 12px;
          }
          #print-statement table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          #print-statement th, #print-statement td {
            border: 1px solid #ccc;
            padding: 6px 10px;
            text-align: left;
            font-size: 11px;
          }
          #print-statement th { background: #f0f0f0; font-weight: 700; }
          .print-footer { margin-top: 16px; font-size: 11px; color: #555; border-top: 1px solid #ddd; padding-top: 8px; }
        }
      `}</style>

      {/* Hidden print block */}
      <div id="print-statement" style={{ display: "none" }} aria-hidden="true">
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            RacketFix — Repair Statement
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
            Generated: {generatedDate}
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            Address: 48-14-61 Beside Ramachandra Brothers, Near Ramatalkies,
            Visakhapatnam 530016
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Racket Brand</th>
              <th>Damage Description</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((req, i) => (
              <tr key={`${String(req.submissionTimestamp)}-${req.name}`}>
                <td>{i + 1}</td>
                <td>{req.name}</td>
                <td>{req.phone}</td>
                <td>{req.email}</td>
                <td>{req.racketBrand}</td>
                <td>{req.damageDescription}</td>
                <td>{formatTimestamp(req.submissionTimestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="print-footer">
          Total Requests: {requests?.length ?? 0} | RacketFix, Visakhapatnam —
          Ph: 9440790818
        </div>
      </div>

      {/* Edit Dialog */}
      <EditDialog
        request={editTarget}
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
      />

      {/* Delete Alert Dialog */}
      <DeleteAlertDialog
        request={deleteTarget}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #c7d8f5",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(26,86,219,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck style={{ color: "#1a56db", width: 24, height: 24 }} />
          <span
            style={{ color: "#0f2d6e", fontWeight: 800, fontSize: "1.2rem" }}
          >
            RacketFix Admin
          </span>
          <span
            style={{
              backgroundColor: "#e0eaff",
              color: "#1a56db",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px",
              border: "1px solid #c7d8f5",
            }}
          >
            Dashboard
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          data-ocid="admin.secondary_button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            backgroundColor: "#ffffff",
            color: "#dc2626",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <LogOut style={{ width: 16, height: 16 }} />
          Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* Title row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                color: "#0f2d6e",
                fontWeight: 800,
                fontSize: "1.6rem",
                margin: 0,
              }}
            >
              Repair Requests
            </h1>
            <p
              style={{
                color: "#5c7aaa",
                fontSize: "0.88rem",
                margin: "4px 0 0 0",
              }}
            >
              All customer bookings submitted through the website
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!isLoading && !isError && (
              <span
                style={{
                  backgroundColor: "#e0eaff",
                  color: "#1a56db",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  padding: "4px 14px",
                  borderRadius: "999px",
                  border: "1px solid #c7d8f5",
                }}
              >
                {requests?.length ?? 0} request
                {(requests?.length ?? 0) !== 1 ? "s" : ""}
              </span>
            )}
            {!isLoading && !isError && requests && requests.length > 0 && (
              <button
                type="button"
                onClick={handlePrint}
                data-ocid="admin.print_button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  backgroundColor: "#ffffff",
                  color: "#1a56db",
                  border: "1px solid #c7d8f5",
                  borderRadius: "8px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Printer style={{ width: 16, height: 16 }} />
                Print Statement
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="admin.loading_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 12,
              color: "#5c7aaa",
            }}
          >
            <Loader2
              style={{
                width: 36,
                height: 36,
                color: "#1a56db",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ margin: 0 }}>Loading repair requests...</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            data-ocid="admin.error_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              color: "#dc2626",
            }}
          >
            Failed to load repair requests. Please refresh the page.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && (!requests || requests.length === 0) && (
          <div
            data-ocid="admin.empty_state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 12,
              border: "1px solid #c7d8f5",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              color: "#5c7aaa",
            }}
          >
            <Inbox style={{ width: 48, height: 48, color: "#c7d8f5" }} />
            <p style={{ fontWeight: 700, color: "#0f2d6e", margin: 0 }}>
              No repair requests yet
            </p>
            <p style={{ fontSize: "0.88rem", margin: 0 }}>
              Bookings will appear here once customers submit the repair form.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && requests && requests.length > 0 && (
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #c7d8f5",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                data-ocid="admin.table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f0f4ff",
                      borderBottom: "1px solid #c7d8f5",
                    }}
                  >
                    {[
                      "#",
                      "Name",
                      "Phone",
                      "Email",
                      "Racket Brand",
                      "Damage Description",
                      "Date Submitted",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          color: "#5c7aaa",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => (
                    <tr
                      key={`${req.name}-${String(req.submissionTimestamp)}`}
                      data-ocid={`admin.row.${i + 1}`}
                      style={{ borderBottom: "1px solid #eef2ff" }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#5c7aaa",
                          fontSize: "0.82rem",
                        }}
                      >
                        {i + 1}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#0f2d6e",
                          fontWeight: 600,
                        }}
                      >
                        {req.name}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#0f2d6e" }}>
                        {req.phone}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#5c7aaa" }}>
                        {req.email}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            backgroundColor: "#e0eaff",
                            color: "#1a56db",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            border: "1px solid #c7d8f5",
                          }}
                        >
                          {req.racketBrand}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#0f2d6e",
                          maxWidth: 200,
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={req.damageDescription}
                        >
                          {req.damageDescription}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          color: "#5c7aaa",
                          fontSize: "0.82rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatTimestamp(req.submissionTimestamp)}
                      </td>
                      <td
                        style={{ padding: "12px 16px", whiteSpace: "nowrap" }}
                      >
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            type="button"
                            data-ocid={`admin.edit_button.${i + 1}`}
                            onClick={() => setEditTarget(req)}
                            title="Edit booking"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              backgroundColor: "#e0eaff",
                              color: "#1a56db",
                              border: "1px solid #c7d8f5",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            <Pencil style={{ width: 14, height: 14 }} />
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.delete_button.${i + 1}`}
                            onClick={() => setDeleteTarget(req)}
                            title="Delete booking"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 32,
                              height: 32,
                              backgroundColor: "#fff0f0",
                              color: "#dc2626",
                              border: "1px solid #fca5a5",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
