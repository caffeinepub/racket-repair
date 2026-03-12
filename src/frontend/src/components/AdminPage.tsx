import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRepairRequests } from "@/hooks/useQueries";
import { Inbox, Loader2, LogOut, Printer, ShieldCheck } from "lucide-react";
import { useState } from "react";
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

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: requests, isLoading, isError } = useGetRepairRequests();

  function handlePrint() {
    window.print();
  }

  const generatedDate = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Print styles — only active during window.print() */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #print-statement, #print-statement * { visibility: visible !important; }
          #print-statement {
            position: fixed !important;
            display: block !important;
            top: 0;
            left: 0;
            width: 100%;
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
            word-break: break-word;
          }
          #print-statement th {
            background: #f0f0f0;
            font-weight: 700;
            color: #333;
          }
          #print-statement tr:nth-child(even) td { background: #fafafa; }
          .print-header { margin-bottom: 8px; }
          .print-title {
            font-size: 20px;
            font-weight: 800;
            color: #111;
          }
          .print-meta {
            font-size: 11px;
            color: #555;
            margin-top: 2px;
          }
          .print-footer {
            margin-top: 16px;
            font-size: 11px;
            color: #555;
            border-top: 1px solid #ddd;
            padding-top: 8px;
          }
        }
      `}</style>

      {/* Hidden print statement — made visible only during print via CSS */}
      <div id="print-statement" style={{ display: "none" }} aria-hidden="true">
        <div className="print-header">
          <div className="print-title">RacketFix &#8212; Repair Statement</div>
          <div className="print-meta">Generated: {generatedDate}</div>
          <div className="print-meta">
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
          Total Requests: {requests?.length ?? 0} &nbsp;|&nbsp; RacketFix,
          Visakhapatnam &#8212; Ph: 9440790818
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-display text-xl font-bold">
              RacketFix Admin
            </span>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs hidden sm:inline-flex">
              Dashboard
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 gap-2"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Repair Requests
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              All customer bookings submitted through the website
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && !isError && (
              <Badge className="bg-primary/15 text-primary border-primary/25 text-sm px-3 py-1">
                {requests?.length ?? 0} request
                {(requests?.length ?? 0) !== 1 ? "s" : ""} received
              </Badge>
            )}
            {!isLoading && !isError && requests && requests.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrint}
                className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
                data-ocid="admin.print_button"
              >
                <Printer className="w-4 h-4" />
                Print Statement
              </Button>
            )}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground"
            data-ocid="admin.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Loading repair requests…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-3"
            data-ocid="admin.error_state"
          >
            <p className="text-destructive">
              Failed to load repair requests. Please refresh.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && (!requests || requests.length === 0) && (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground border border-border rounded-xl"
            data-ocid="admin.empty_state"
          >
            <Inbox className="w-12 h-12 text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium text-foreground">
                No repair requests yet
              </p>
              <p className="text-sm mt-1">
                Bookings will appear here once customers submit the repair form.
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && requests && requests.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                  <TableHead className="text-muted-foreground w-10">
                    #
                  </TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden lg:table-cell">
                    Racket Brand
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    Damage Description
                  </TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">
                    Date Submitted
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req, i) => (
                  <TableRow
                    key={`${req.name}-${String(req.submissionTimestamp)}`}
                    className="border-border hover:bg-secondary/30"
                    data-ocid={`admin.row.${i + 1}`}
                  >
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {req.name}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {req.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {req.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary text-xs"
                      >
                        {req.racketBrand}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground max-w-xs">
                      <p className="truncate" title={req.damageDescription}>
                        {req.damageDescription}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                      {formatTimestamp(req.submissionTimestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
