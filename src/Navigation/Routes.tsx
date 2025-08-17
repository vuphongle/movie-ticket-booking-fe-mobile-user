import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./RootNavigator";
import { ROOT_STACK } from "@Constants";
import { RootStackParamList } from "@Types/navigationTypes";

const Routes = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>(ROOT_STACK.SPLASH);

  useEffect(() => {
    // Keep splash screen for branding purposes
    // setInitialRoute(ROOT_STACK.SPLASH);
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
};

export default Routes;
