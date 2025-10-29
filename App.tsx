import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { PortalProvider } from "@gorhom/portal";
import { enableScreens } from "react-native-screens";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@Components/ErrorBoundary";
import { Routes } from "@Navigation";
import { queryClient } from "@Services/queryClient";

// Enable screens for better navigation performance
enableScreens();

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PortalProvider>
          <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            <ErrorBoundary>
              <Routes />
            </ErrorBoundary>
          </SafeAreaProvider>
        </PortalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
