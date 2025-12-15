import React, { useRef, useState, useEffect } from "react";
import { View, ActivityIndicator, BackHandler, Alert } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { ScreenHeader } from "@Components";
import { useBookingStore } from "@Store/useBookingStore";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import { useTranslation } from "@Hooks/useTranslation";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentWebView">;

const PaymentWebViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paymentUrl } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const { clearAll } = useBookingStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const hasHandledResult = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      setShowCancelModal(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    setCanGoBack(navState.canGoBack);

    if (hasHandledResult.current) {
      return;
    }

    if (url.includes("/success")) {
      hasHandledResult.current = true;
      clearAll();
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
      Alert.alert(t("COMMON_SUCCESS"), t("BOOKING_PAYMENT_SUCCESS_ALERT_MESSAGE"));
      return;
    }

    if (url.includes("failed")) {
      hasHandledResult.current = true;
      clearAll();
      navigation.navigate("Main");
      Alert.alert(t("BOOKING_PAYMENT_FAILED_TITLE"), t("BOOKING_PAYMENT_FAILED_ALERT_MESSAGE"));
      return;
    }
  };

  const handleError = () => {
    setShowErrorModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
      <ScreenHeader
        title={t("BOOKING_CONFIRM_TITLE")}
        onBackPress={() => setShowCancelModal(true)}
      />

      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            zIndex: 1,
          }}
        >
          <ActivityIndicator size="large" color="#012e6e" />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={handleError}
        onHttpError={handleError}
        startInLoadingState={true}
        renderLoading={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
            }}
          >
            <ActivityIndicator size="large" color="#012e6e" />
          </View>
        )}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        geolocationEnabled={false}
      />

      <UniversalConfirmModal
        visible={showCancelModal}
        title={t("BOOKING_PAYMENT_CANCEL_TITLE")}
        message={t("BOOKING_PAYMENT_CANCEL_MESSAGE")}
        buttons={[
          {
            text: t("BOOKING_PAYMENT_CONTINUE_BUTTON"),
            type: "cancel",
            onPress: () => setShowCancelModal(false),
          },
          {
            text: t("BOOKING_PAYMENT_CANCEL_BUTTON"),
            type: "danger",
            onPress: () => {
              setShowCancelModal(false);
              clearAll();
              navigation.navigate("Main");
            },
          },
        ]}
      />

      <UniversalConfirmModal
        visible={showErrorModal}
        title={t("COMMON_ERROR")}
        message={t("BOOKING_PAYMENT_WEBVIEW_ERROR")}
        buttons={[
          {
            text: t("COMMON_RETRY"),
            type: "primary",
            onPress: () => {
              setShowErrorModal(false);
              webViewRef.current?.reload();
            },
          },
          {
            text: t("COMMON_CANCEL"),
            type: "cancel",
            onPress: () => {
              setShowErrorModal(false);
              clearAll();
              navigation.navigate("Main");
            },
          },
        ]}
      />
    </View>
  );
};

export default PaymentWebViewScreen;
