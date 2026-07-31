"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { motion } from "framer-motion";
import { Icons } from "@/components/shared/icons";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { UserMenu } from "@/components/navigation/user-menu";
import { NotificationsButton } from "@/components/navigation/notifications-button";
import { SearchButton } from "@/components/search/search-button";
import { InstallButton } from "@/components/navigation/install-button";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

/** Sticky glass top navigation bar. */
export function TopNav({ session }: { session: Session }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass sticky top-0 z-40"
    >
      <div className="container flex h-14 items-center justify-between gap-2">
        {/* Left: logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.logo className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            God Watch
          </span>
        </Link>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <SearchButton />
          <InstallButton />
          <NotificationsButton />
          <Button asChild variant="ghost" size="icon" aria-label="Settings">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
          <ThemeToggle />
          <UserMenu session={session} />
        </div>
      </div>
    </motion.header>
  );
}

