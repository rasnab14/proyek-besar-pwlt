import React from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "ok" | "wn" | "er" | "in" | "nu";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "in", className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("b", variant, className)} {...props}>
      {children}
    </span>
  );
}
