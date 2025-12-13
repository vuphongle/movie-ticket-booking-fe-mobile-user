import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet, Animated } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@Types/navigationTypes";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FONT_SIZE, SPACING } from "@Constants/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FileText } from "lucide-react-native";
import { useTranslation } from "@Hooks/useTranslation";

const PaymentResultScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const { status, pdfUrl } = route.params || {};
  const [scaleAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (status === "success") {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [status]);

  const handleDownloadTicket = () => {
    if (pdfUrl) Linking.openURL(pdfUrl);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {status === "success" ? (
          <>
            <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={60} color="#22c55e" />
              </View>
            </Animated.View>

            <Text style={styles.title}>{t("BOOKING_PAYMENT_SUCCESS_TITLE")}</Text>
            <Text style={styles.subtitle}>{t("BOOKING_PAYMENT_SUCCESS_SUBTITLE")}</Text>

            {pdfUrl && (
              <TouchableOpacity onPress={handleDownloadTicket} style={styles.actionButton}>
                <FileText size={18} color="#fff" />
                <Text style={styles.actionButtonText}>{t("BOOKING_PAYMENT_VIEW_TICKETS")}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => navigation.navigate("Main")}
              style={[styles.primaryButton, { backgroundColor: "#012e6e" }]}
            >
              <Text style={styles.primaryButtonText}>{t("BOOKING_PAYMENT_BACK_HOME")}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require("@Assets/images/booking-fail.png")}
              style={styles.failImage}
              resizeMode="contain"
            />
            <Text style={[styles.title, { color: "#b91c1c" }]}>
              {t("BOOKING_PAYMENT_FAILED_TITLE")}
            </Text>
            <Text style={styles.subtitle}>{t("BOOKING_PAYMENT_FAILED_MESSAGE")}</Text>
            <Text style={styles.subtitle}>{t("BOOKING_PAYMENT_FAILED_RETRY")}</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Main")}
              style={[styles.primaryButton, { backgroundColor: "#012e6e" }]}
            >
              <Text style={styles.primaryButtonText}>{t("BOOKING_PAYMENT_BACK_HOME")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default PaymentResultScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: SPACING.lg,
    width: "90%",
    alignItems: "center",
    shadowColor: "#00000025",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#dcfce7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  successCircle: {
    width: 95,
    height: 95,
    borderRadius: 48,
    borderWidth: 5,
    borderColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    color: "#012e6e",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: "#555",
    textAlign: "center",
    marginBottom: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff8c42",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: SPACING.md,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginLeft: 8,
  },
  primaryButton: {
    marginTop: SPACING.lg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#00000030",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  failImage: {
    width: 100,
    height: 100,
    marginBottom: SPACING.md,
  },
});
