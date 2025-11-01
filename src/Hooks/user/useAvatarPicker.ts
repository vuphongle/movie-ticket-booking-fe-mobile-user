import { Alert, Platform, PermissionsAndroid } from "react-native";
import type { Permission } from "react-native";
import { check, request, PERMISSIONS, RESULTS, openSettings } from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";

const ANDROID_API = {
  TIRAMISU: 33,
} as const;

const androidApiLevel =
  Platform.OS === "android"
    ? typeof Platform.Version === "number"
      ? Platform.Version
      : parseInt(String(Platform.Version), 10) || 0
    : 0;

const isAndroid13Plus = androidApiLevel >= ANDROID_API.TIRAMISU;

export interface ImagePickerResult {
  path: string;
  filename?: string;
  width: number;
  height: number;
  size: number;
}

export interface AvatarPickerOptions {
  width?: number;
  height?: number;
  compressImageQuality?: number;
  cropperCircleOverlay?: boolean;
  enableRotationGesture?: boolean;
  freeStyleCropEnabled?: boolean;
}

interface AvatarPickerProps {
  onImageSelected: (image: ImagePickerResult) => void;
  onError?: (error: string) => void;
  options?: AvatarPickerOptions;
}

const defaultOptions: AvatarPickerOptions = {
  width: 400,
  height: 400,
  compressImageQuality: 0.8,
  cropperCircleOverlay: true,
  enableRotationGesture: true,
  freeStyleCropEnabled: true,
};

export const useAvatarPicker = ({ onImageSelected, onError, options = {} }: AvatarPickerProps) => {
  const mergedOptions = { ...defaultOptions, ...options };

  const showPermissionDeniedAlert = (permissionType: "camera" | "library") => {
    const title =
      permissionType === "camera" ? "Yêu cầu quyền Camera" : "Yêu cầu quyền Thư viện ảnh";

    const message =
      permissionType === "camera"
        ? "Để chụp ảnh, vui lòng cho phép truy cập camera trong Cài đặt."
        : "Để chọn ảnh, vui lòng cho phép truy cập thư viện ảnh trong Cài đặt.";

    Alert.alert(title, message, [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Mở Cài đặt",
        onPress: () => {
          openSettings();
        },
      },
    ]);
  };

  const requestIOSPermissionForCamera = async () => {
    const permission = PERMISSIONS.IOS.CAMERA;
    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      return true;
    }

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED;
    }

    if (result === RESULTS.BLOCKED) {
      showPermissionDeniedAlert("camera");
      return false;
    }

    return false;
  };

  const requestIOSPermissionForLibrary = async () => {
    const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    const result = await check(permission);

    if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
      return true;
    }

    if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      return requestResult === RESULTS.GRANTED || requestResult === RESULTS.LIMITED;
    }

    if (result === RESULTS.BLOCKED) {
      showPermissionDeniedAlert("library");
      return false;
    }

    return false;
  };

  const requestAndroidPermissionsForCamera = async () => {
    const perms: string[] = [PermissionsAndroid.PERMISSIONS.CAMERA];

    if (isAndroid13Plus) {
      if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES) {
        perms.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      }
    } else {
      perms.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }

    // Check if permissions are already granted
    const cameraStatus = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (cameraStatus) {
      return true;
    }

    const res = await PermissionsAndroid.requestMultiple(perms as Permission[]);
    const allGranted = Object.values(res).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);

    if (!allGranted) {
      // Check if user selected "Never ask again"
      const cameraStatusAfterRequest = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (
        !cameraStatusAfterRequest &&
        res[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.DENIED
      ) {
        showPermissionDeniedAlert("camera");
      }
    }

    return allGranted;
  };

  const requestAndroidPermissionsForLibrary = async () => {
    const perms: string[] = [];
    if (isAndroid13Plus) {
      if (PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES) {
        perms.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      }
    } else {
      perms.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }

    if (perms.length === 0) return true;

    // Check if permissions are already granted
    const firstPerm = perms[0] as Permission;
    const permissionStatus = await PermissionsAndroid.check(firstPerm);
    if (permissionStatus) {
      return true;
    }

    const res = await PermissionsAndroid.requestMultiple(perms as Permission[]);
    const allGranted = Object.values(res).every((v) => v === PermissionsAndroid.RESULTS.GRANTED);

    if (!allGranted) {
      // Check if user selected "Never ask again"
      const permissionStatusAfterRequest = await PermissionsAndroid.check(firstPerm);
      if (!permissionStatusAfterRequest && res[firstPerm] === PermissionsAndroid.RESULTS.DENIED) {
        showPermissionDeniedAlert("library");
      }
    }

    return allGranted;
  };

  const openCamera = async () => {
    try {
      let hasPermission = false;

      if (Platform.OS === "android") {
        hasPermission = await requestAndroidPermissionsForCamera();
      } else {
        hasPermission = await requestIOSPermissionForCamera();
      }

      if (!hasPermission) {
        return;
      }

      const image = await ImagePicker.openCamera({
        width: mergedOptions.width!,
        height: mergedOptions.height!,
        cropping: true,
        cropperCircleOverlay: mergedOptions.cropperCircleOverlay!,
        compressImageMaxWidth: mergedOptions.width!,
        compressImageMaxHeight: mergedOptions.height!,
        compressImageQuality: mergedOptions.compressImageQuality!,
        includeBase64: false,
        mediaType: "photo",
        enableRotationGesture: mergedOptions.enableRotationGesture!,
        freeStyleCropEnabled: mergedOptions.freeStyleCropEnabled!,
        cropperStatusBarColor: "#000000",
        cropperToolbarColor: "#000000",
        cropperActiveWidgetColor: "#ffffff",
        cropperToolbarWidgetColor: "#ffffff",
      });

      onImageSelected({
        path: image.path,
        filename: image.filename,
        width: image.width,
        height: image.height,
        size: image.size,
      });
    } catch (error: any) {
      if (error.code !== "E_PICKER_CANCELLED") {
        onError?.("Không thể mở camera.");
      }
    }
  };

  const openLibrary = async () => {
    try {
      let hasPermission = false;

      if (Platform.OS === "android") {
        hasPermission = await requestAndroidPermissionsForLibrary();
      } else {
        hasPermission = await requestIOSPermissionForLibrary();
      }

      if (!hasPermission) {
        return;
      }

      const image = await ImagePicker.openPicker({
        width: mergedOptions.width!,
        height: mergedOptions.height!,
        cropping: true,
        cropperCircleOverlay: mergedOptions.cropperCircleOverlay!,
        compressImageMaxWidth: mergedOptions.width!,
        compressImageMaxHeight: mergedOptions.height!,
        compressImageQuality: mergedOptions.compressImageQuality!,
        includeBase64: false,
        mediaType: "photo",
        enableRotationGesture: mergedOptions.enableRotationGesture!,
        freeStyleCropEnabled: mergedOptions.freeStyleCropEnabled!,
        cropperStatusBarColor: "#000000",
        cropperToolbarColor: "#000000",
        cropperActiveWidgetColor: "#ffffff",
        cropperToolbarWidgetColor: "#ffffff",
      });

      onImageSelected({
        path: image.path,
        filename: image.filename,
        width: image.width,
        height: image.height,
        size: image.size,
      });
    } catch (error: any) {
      if (error.code !== "E_PICKER_CANCELLED") {
        onError?.("Không thể mở thư viện ảnh.");
      }
    }
  };

  const showImagePickerAlert = () => {
    Alert.alert("Thay đổi ảnh đại diện", "Chọn nguồn ảnh", [
      {
        text: "Chụp ảnh",
        onPress: openCamera,
      },
      {
        text: "Chọn từ thư viện",
        onPress: openLibrary,
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  return {
    showImagePickerAlert,
    openCamera,
    openLibrary,
  };
};
