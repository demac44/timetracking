import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/app/components/ui/button";

interface PageLinkProps {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}

export function PageLink({ href, disabled, label, children }: PageLinkProps) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled aria-label={`${label} page`}>
        {children}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href={href} scroll={false} aria-label={`${label} page`}>
        {children}
      </Link>
    </Button>
  );
}
