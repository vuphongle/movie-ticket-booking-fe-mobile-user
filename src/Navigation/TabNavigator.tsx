import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MAIN_TAB_STACK, COLORS, SPACING, FONT_SIZE } from "@Constants";
import { MainTabParamList } from "@Types/navigationTypes";
import { HomeScreen, BookingScreen, NewsScreen, ProfileScreen } from "@Screens";

const Tab = createBottomTabNavigator<MainTabParamList>();

const EMOJI: Record<string, string> = {
  [MAIN_TAB_STACK.HOME]: "🏠",
  [MAIN_TAB_STACK.BOOKING]: "🎫",
  [MAIN_TAB_STACK.NEWS]: "📰",
  [MAIN_TAB_STACK.PROFILE]: "👤",
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
          const { options } = descriptors[route.key];
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const onLongPress = () => {
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          const scale = new Animated.Value(isFocused ? 1 : 0.95);
          Animated.timing(scale, {
            toValue: isFocused ? 1 : 0.95,
            duration: 160,
            useNativeDriver: true,
          }).start();

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.itemTouchable}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Animated.View
                style={[styles.item, isFocused && styles.itemFocused, { transform: [{ scale }] }]}
              >
                <Text style={[styles.icon, { opacity: isFocused ? 1 : 0.6 }]}>
                  {EMOJI[route.name] ?? "📱"}
                </Text>

                <Text
                  style={[
                    styles.label,
                    {
                      color: isFocused ? COLORS.accent : COLORS.text.light,
                      opacity: isFocused ? 1 : 0.7,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {LABEL[route.name] ?? ""}
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
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen name={MAIN_TAB_STACK.HOME} component={HomeScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.BOOKING} component={BookingScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.NEWS} component={NewsScreen} />
      <Tab.Screen name={MAIN_TAB_STACK.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const CONTAINER_HEIGHT = Platform.select({ ios: 70, android: 66 });

const styles = StyleSheet.create({
  safeArea: {
    position: "absolute",
    left: SPACING.md,
    right: SPACING.md,
    bottom: 0,
    paddingBottom: Platform.select({ ios: 0, android: SPACING.sm }),
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
    marginBottom: Platform.select({ ios: 0, android: SPACING.xs }),

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    paddingHorizontal: 8,
    borderRadius: 14,
  },
  itemFocused: {
    backgroundColor: "rgba(233,69,96,0.12)",
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "600",
  },
});

export default TabNavigator;
