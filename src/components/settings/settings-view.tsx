"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Bell, Moon, Palette, Shield, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettings } from "@/lib/actions";
import { exportToCSV, exportToPDF } from "@/lib/export";
import { TASK_COLORS } from "@/lib/constants";

interface SettingsViewProps {
  settings: {
    theme?: string;
    dailyReminderEnabled?: boolean;
    dailyReminderTime?: string;
    dailyReminderChannel?: string;
    defaultTaskColor?: string;
  } | null;
  hasData: boolean;
  exportRows?: { task: string; date: string; status: string }[];
}

/** Settings page — preferences, notifications, data export. */
export function SettingsView({ settings, hasData, exportRows = [] }: SettingsViewProps) {
  const [reminderEnabled, setReminderEnabled] = React.useState(settings?.dailyReminderEnabled ?? false);
  const [reminderTime, setReminderTime] = React.useState(settings?.dailyReminderTime ?? "20:00");
  const [reminderChannel, setReminderChannel] = React.useState(settings?.dailyReminderChannel ?? "browser");
  const [defaultColor, setDefaultColor] = React.useState(settings?.defaultTaskColor ?? TASK_COLORS[0]);

  const handleSave = async () => {
    const res = await updateSettings({
      dailyReminderEnabled: reminderEnabled,
      dailyReminderTime: reminderTime,
      dailyReminderChannel: reminderChannel,
      defaultTaskColor: defaultColor,
    });
    if (res.ok) toast.success("Settings saved");
    else toast.error(res.message ?? "Failed to save settings");
  };

  return (
    <div className="container space-y-6 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your preferences and data.</p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Moon className="h-4 w-4" />
              Appearance
            </CardTitle>
            <CardDescription>Theme is managed from the top navigation toggle.</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Default task color */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              Default Task Color
            </CardTitle>
            <CardDescription>New tasks will use this color.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            {TASK_COLORS.map((color) => (
              <button
                key={color}
                aria-label={`Set default color to ${color}`}
                onClick={() => setDefaultColor(color)}
                className={`h-8 w-8 rounded-full transition-transform ${
                  defaultColor === color ? "ring-2 ring-ring ring-offset-2" : "hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" />
              Daily Reminder
            </CardTitle>
            <CardDescription>Get a reminder to check in each day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reminder">Enable reminders</Label>
                <p className="text-xs text-muted-foreground">Requires notification permission.</p>
              </div>
              <Switch
                id="reminder"
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="time">Reminder time</Label>
                <Input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Channel</Label>
                <Select value={reminderChannel} onValueChange={setReminderChannel}>
                  <SelectTrigger id="channel" className="w-full">
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="browser">Browser notification</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data export */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" />
              Export Data
            </CardTitle>
            <CardDescription>Download your tracking history as CSV or PDF.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              disabled={!hasData}
              onClick={() => exportToCSV(exportRows)}
            >
              Export CSV
            </Button>
            <Button
              variant="secondary"
              disabled={!hasData}
              onClick={() => void exportToPDF(exportRows)}
            >
              Export PDF
            </Button>
            {!hasData && (
              <p className="w-full text-xs text-muted-foreground">
                No tracking data yet to export.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
            <CardDescription>
              Account security is handled via Google OAuth. Sessions expire after 30 days.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}

