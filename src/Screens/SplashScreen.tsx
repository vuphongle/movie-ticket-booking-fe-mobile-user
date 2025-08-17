import { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { RootStackNavigationProp } from "@Types/navigationTypes";
import { ROOT_STACK } from "@Constants";

interface SplashScreenProps {
  navigation: RootStackNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(ROOT_STACK.MAIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" translucent={false} />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🎬</Text>
          <Text style={styles.title}>GO CINEMA</Text>
          <Text style={styles.subtitle}>Đặt vé xem phim dễ dàng</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
  },
});

export default SplashScreen;
