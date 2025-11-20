import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  MAIN_TAB_STACK,
  COLORS,
  SPACING,
  FONT_SIZE,
} from "@Constants";
import { MainTabParamList } from "@Types/navigationTypes";

import {
  HomeScreen,
  QuicklyBookingScreen,
  NewsScreen,
  ProfileScreen,
} from "@Screens";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICON_ACTIVE_COLOR = "#174078";
const ICON_INACTIVE_COLOR = "#566157";

const ICONS: Record<string, string> = {
  [MAIN_TAB_STACK.HOME]: "home-variant",
  [MAIN_TAB_STACK.BOOKING]: "ticket-confirmation",
  [MAIN_TAB_STACK.NEWS]: "newspaper-variant",
  [MAIN_TAB_STACK.PROFILE]: "account-circle",
};

const LABEL: Record<string, string> = {
  [MAIN_TAB_STACK.HOME]: "Trang chủ",
  [MAIN_TAB_STACK.BOOKING]: "Đặt vé",
  [MAIN_TAB_STACK.NEWS]: "Tin tức",
  [MAIN_TAB_STACK.PROFILE]: "Cá nhân",
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          const scale = new Animated.Value(isFocused ? 1 : 0.92);
          Animated.timing(scale, {
            toValue: isFocused ? 1 : 0.92,
            duration: 150,
            useNativeDriver: true,
          }).start();

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.itemTouchable}
            >
              <Animated.View
                style={[
                  styles.item,
                  isFocused && styles.itemFocused,
                  { transform: [{ scale }] },
                ]}
              >
                <Icon
                  name={ICONS[route.name]}
                  size={isFocused ? 30 : 25}
                  color={isFocused ? ICON_ACTIVE_COLOR : ICON_INACTIVE_COLOR}
                  style={{
                    marginBottom: 2,
                    textShadowColor: isFocused ? "rgba(255,77,109,0.4)" : "transparent",
                    textShadowRadius: isFocused ? 6 : 0,
                  }}
                />

                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? ICON_ACTIVE_COLOR : ICON_INACTIVE_COLOR,
                      fontWeight: isFocused ? "700" : "500",
                    },
                  ]}
                >
                  {LABEL[route.name]}
                </Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name={MAIN_TAB_STACK.HOME} component={HomeScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.BOOKING} component={QuicklyBookingScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.NEWS} component={NewsScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const CONTAINER_HEIGHT = Platform.select({ ios: 68, android: 66 });

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    left: SPACING.md,
    right: SPACING.md,
    bottom: 0,
  },
  tabContainer: {
    height: CONTAINER_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Platform.select({ ios: 0, android: SPACING.md }),

    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  itemTouchable: {
    flex: 1,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  itemFocused: {
    backgroundColor: "#c7ddf9",
  },
  label: {
    fontSize: FONT_SIZE.xs,
  },
});

export default TabNavigator;
