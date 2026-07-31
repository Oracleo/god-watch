"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** Notifications popover (placeholder that ties into reminders + achievements). */
export function NotificationsButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            You&apos;re all caught up. ✨
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

