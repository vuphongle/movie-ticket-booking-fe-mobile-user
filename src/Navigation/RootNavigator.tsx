import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROOT_STACK } from "@Constants";
import { RootStackParamList } from "@Types/navigationTypes";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  initialRouteName?: keyof RootStackParamList;
}

const RootNavigator = ({ initialRouteName = ROOT_STACK.MAIN }: RootNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen
        name={ROOT_STACK.MAIN}
        component={TabNavigator}
        options={{
          animation: "fade",
          animationDuration: 300,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
