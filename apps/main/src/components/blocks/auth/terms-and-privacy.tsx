// src/components/shared/auth/terms-and-privacy.tsx
import React from "react";

interface TermsAndPrivacyProps {
  authType?: "signup" | "signin";
}

export const TermsAndPrivacy = ({ authType = "signup" }: TermsAndPrivacyProps) => {
  const actionText = authType === "signup" ? "signing up" : "signing in";

  return (
    <p className="text-muted-foreground text-start p-6">
      By {actionText}, you agree to the{" "}
      <a href="/terms" className="underline hover:text-foreground">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="/privacy" className="underline hover:text-foreground">
        Privacy Policy
      </a>
      .
    </p>
  );
};
