import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "racketfix2024") {
      localStorage.setItem("racketfix_admin", "true");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-bold text-primary">
              RacketFix
            </span>
          </div>
        </div>
        <Card className="border-border bg-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-3xl text-foreground">
              Admin Login
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to view repair bookings
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  data-ocid="admin.input"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  data-ocid="admin.input"
                  autoComplete="current-password"
                />
              </div>
              {error && (
                <div
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2"
                  data-ocid="admin.error_state"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold mt-2"
                data-ocid="admin.submit_button"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground text-xs mt-4">
          Admin access only — not for customers
        </p>
      </div>
    </div>
  );
}
