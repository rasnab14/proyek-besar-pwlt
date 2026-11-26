import React from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "default" | "pri" | "acc" | "dng";
export type ButtonSize = "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const variantClass = variant !== "default" ? variant : "";
  const sizeClass = size === "sm" ? "sm" : "";

  return (
    <button
      className={cn("btn", variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}
