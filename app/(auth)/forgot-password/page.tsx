"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-8 text-center">
          <Link href="/" className="flex justify-center">
            <Logo />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              If an account exists for {email}, you&apos;ll receive a password reset link.
              Wire this up to your auth provider when ready.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/sign-in">Back to sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <Link href="/" className="flex justify-center">
          <Logo />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending…" : "Send reset link"}
          </Button>
        </form>

        <p className="text-center">
          <Link href="/sign-in" className="text-muted-foreground hover:text-primary text-sm">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
