"use client";

import "./globals.css";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center p-6 font-sans">
        <title>Something went wrong · Memtime</title>
        <div className="max-w-sm space-y-4 text-center">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <p className="text-sm text-muted-foreground">
            Memtime hit an unexpected error. Your saved time entries are safe.
          </p>
          <button
            onClick={() => retry()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
