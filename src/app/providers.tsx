"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { AuthProvider } from "@/shared/hooks/useAuth";
import { Provider } from "react-redux";
import { store } from "@/shared/lib/store/store";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "@/shared/ui/toaster";
import "@/shared/utils/lang/i18n";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NuqsAdapter>
          <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="app-theme">
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </NuqsAdapter>
      </Provider>
    </QueryClientProvider>
  );
}
