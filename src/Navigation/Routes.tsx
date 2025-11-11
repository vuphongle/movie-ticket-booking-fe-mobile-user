import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { hideSplash } from "react-native-splash-view";
import RootNavigator from "./RootNavigator";
import { ROOT_STACK } from "@Constants";
import { AuthProvider, useAuth } from "@Contexts/AuthContext";
import { ChatWidget } from "@Components";

const AppNavigator = () => {
  const { state } = useAuth();
  const { isLoading } = state;

  useEffect(() => {
    if (!isLoading) {
      hideSplash();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootNavigator initialRouteName={ROOT_STACK.MAIN} />
      <ChatWidget />
    </NavigationContainer>
  );
};

const Routes = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default Routes;
