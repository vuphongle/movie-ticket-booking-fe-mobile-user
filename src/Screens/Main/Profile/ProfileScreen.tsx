import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useIsAuthenticated } from "@Hooks/Profile";
import { GuestProfileView } from "./Components/GuestProfileView";

const ProfileScreen = React.memo(() => {
  const isAuthenticated = useIsAuthenticated();

  // TODO: Replace with actual loading state from auth hook
  const isLoading = false;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6d5edc" />
      </View>
    );
  }

  // Show guest view if not authenticated
  if (!isAuthenticated) {
    return <GuestProfileView />;
  }

  // TODO: Show authenticated profile view
  return <GuestProfileView />;
});

export default ProfileScreen;
