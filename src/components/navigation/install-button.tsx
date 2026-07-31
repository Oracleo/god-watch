"use client";

import { Download } from "lucide-react";
import { useInstallPrompt } from "@/hooks/use-pwa";
import { Button } from "@/components/ui/button";

/** PWA install button (appears when the browser fires beforeinstallprompt). */
export function InstallButton() {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <Button variant="ghost" size="sm" onClick={() => void install()} aria-label="Install app">
      <Download className="h-4 w-4" />
    </Button>
  );
}

