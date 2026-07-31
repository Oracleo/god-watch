"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { Icons } from "@/components/shared/icons";

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border bg-card p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Icons.logo className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <Button
          variant="outline"
          className="w-full gap-3 py-6 text-base"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? (
            <Icons.spinner className="h-5 w-5 animate-spin" />
          ) : (
            <Icons.google className="h-5 w-5" />
          )}
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Every day leaves evidence. Track it.
        </p>
      </div>
    </motion.div>
  );
}

