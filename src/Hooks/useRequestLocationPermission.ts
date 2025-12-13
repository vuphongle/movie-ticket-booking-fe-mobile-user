import { PermissionsAndroid, Platform } from "react-native";
import { i18n } from "@Locales/i18n";

export const requestLocationPermission = async () => {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: i18n.t("PERMISSION_LOCATION_TITLE"),
        message: i18n.t("PERMISSION_LOCATION_MESSAGE"),
        buttonNeutral: i18n.t("COMMON_ASK_LATER"),
        buttonNegative: i18n.t("COMMON_DENY"),
        buttonPositive: i18n.t("COMMON_ALLOW"),
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
