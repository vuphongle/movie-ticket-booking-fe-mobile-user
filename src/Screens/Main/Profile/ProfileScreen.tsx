import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@Contexts/AuthContext";
import { GuestProfileView } from "./Components/GuestProfileView";
import { AuthenticatedProfileView } from "./Components/AuthenticatedProfileView";

const ProfileScreen = React.memo(() => {
  const { state } = useAuth();
  const { isAuthenticated, isLoading } = state;

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

  // Show authenticated profile view
  return <AuthenticatedProfileView />;
});

export default ProfileScreen;
