import React, { useRef, useState, useEffect } from "react";
import { View, ActivityIndicator, BackHandler } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { ScreenHeader } from "@Components";
import { useBookingStore } from "@Store/useBookingStore";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentWebView">;

const PaymentWebViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paymentUrl } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const { clearAll } = useBookingStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

    if (url.includes("/success")) {
      setShowSuccessModal(true);
      return;
    }

    if (url.includes("/cancel") || url.includes("/failure")) {
      setShowFailedModal(true);
      return;
    }
  };

  const handleError = () => {
    setShowErrorModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
      <ScreenHeader title="Thanh toán" onBackPress={() => setShowCancelModal(true)} />

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
        title="Hủy thanh toán"
        message="Bạn có chắc chắn muốn hủy thanh toán? Giao dịch sẽ bị hủy."
        buttons={[
          {
            text: "Tiếp tục thanh toán",
            type: "cancel",
            onPress: () => setShowCancelModal(false),
          },
          {
            text: "Hủy thanh toán",
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
        visible={showSuccessModal}
        title="Thành công"
        message="Thanh toán thành công! Vui lòng kiểm tra vé trong lịch sử."
        buttons={[
          {
            text: "OK",
            type: "primary",
            onPress: () => {
              setShowSuccessModal(false);
              clearAll();
              navigation.reset({
                index: 0,
                routes: [{ name: "Main" }],
              });
            },
          },
        ]}
      />

      <UniversalConfirmModal
        visible={showFailedModal}
        title="Đã hủy"
        message="Giao dịch thanh toán đã bị hủy hoặc thất bại."
        buttons={[
          {
            text: "OK",
            type: "primary",
            onPress: () => {
              setShowFailedModal(false);
              clearAll();
              navigation.navigate("Main");
            },
          },
        ]}
      />

      <UniversalConfirmModal
        visible={showErrorModal}
        title="Lỗi"
        message="Không thể tải trang thanh toán. Vui lòng kiểm tra kết nối mạng và thử lại."
        buttons={[
          {
            text: "Thử lại",
            type: "primary",
            onPress: () => {
              setShowErrorModal(false);
              webViewRef.current?.reload();
            },
          },
          {
            text: "Hủy",
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
