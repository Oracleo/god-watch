import { APP_FOOTER, APP_CONTACT_EMAIL } from "@/lib/constants";

/** Global footer with brand attribution. */
export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} {APP_FOOTER}. All rights reserved.
        </p>
        <a
          href={`mailto:${APP_CONTACT_EMAIL}`}
          className="transition-colors hover:text-foreground"
        >
          {APP_CONTACT_EMAIL}
        </a>
      </div>
    </footer>
  );
}

