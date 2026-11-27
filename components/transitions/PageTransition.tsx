// components/transitions/PageTransition.tsx
"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import "./page-transition.css";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition-content">
      {children}
    </div>
  );
}
