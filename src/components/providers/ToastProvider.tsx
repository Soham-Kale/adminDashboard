"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "hsl(240 10% 5.9%)",
          color: "hsl(0 0% 98%)",
          border: "1px solid hsl(240 3.7% 15.9%)",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "hsl(240 10% 5.9%)" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "hsl(240 10% 5.9%)" },
        },
      }}
    />
  );
}
