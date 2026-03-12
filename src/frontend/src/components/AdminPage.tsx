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
import { Inbox, Loader2, LogOut, ShieldCheck } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Repair Requests
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              All customer bookings submitted through the website
            </p>
          </div>
          {!isLoading && !isError && (
            <Badge className="bg-primary/15 text-primary border-primary/25 text-sm px-3 py-1">
              {requests?.length ?? 0} request
              {(requests?.length ?? 0) !== 1 ? "s" : ""} received
            </Badge>
          )}
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
