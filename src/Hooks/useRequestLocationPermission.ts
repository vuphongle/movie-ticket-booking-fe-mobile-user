import { PermissionsAndroid, Platform } from "react-native";

export const requestLocationPermission = async () => {
  if (Platform.OS !== "android") return true;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Quyền truy cập vị trí",
        message: "Ứng dụng cần truy cập vị trí để tính khoảng cách đến rạp.",
        buttonNeutral: "Hỏi lại sau",
        buttonNegative: "Từ chối",
        buttonPositive: "Đồng ý",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
