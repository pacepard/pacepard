// src/components/layouts/auth-layout.tsx
import React, { ReactNode } from "react";

interface IAuthLayout {
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const AuthLayout = (props: IAuthLayout) => {
    
  const { title, description, children, maxWidth = "md" } = props;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }[maxWidth];

  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
      <div className={`${maxWidthClass} m-auto h-fit w-full`}>
        <div className="p-6 text-center">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};
