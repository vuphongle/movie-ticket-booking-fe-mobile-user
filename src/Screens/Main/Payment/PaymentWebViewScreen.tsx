import React, { useRef, useState, useEffect } from "react";
import { View, Alert, ActivityIndicator, BackHandler } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { ScreenHeader } from "@Components";
import { useBookingStore } from "@Store/useBookingStore";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentWebView">;

const PaymentWebViewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paymentUrl } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const { clearAll } = useBookingStore();

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }

      Alert.alert("Hủy thanh toán", "Bạn có chắc chắn muốn hủy thanh toán? Giao dịch sẽ bị hủy.", [
        { text: "Tiếp tục thanh toán", style: "cancel" },
        {
          text: "Hủy thanh toán",
          style: "destructive",
          onPress: () => {
            clearAll();
            navigation.navigate("Main");
          },
        },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [canGoBack, clearAll, navigation]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    setCanGoBack(navState.canGoBack);

    // Kiểm tra URL success - PayOS trả về URL dạng: .../success/ hoặc .../success?...
    if (url.includes("/success")) {
      Alert.alert("Thành công", "Thanh toán thành công! Vui lòng kiểm tra vé trong lịch sử.", [
        {
          text: "OK",
          onPress: () => {
            clearAll();
            navigation.reset({
              index: 0,
              routes: [{ name: "Main" }],
            });
          },
        },
      ]);
      return;
    }

    // Kiểm tra URL cancel hoặc failure
    if (url.includes("/cancel") || url.includes("/failure")) {
      Alert.alert("Đã hủy", "Giao dịch thanh toán đã bị hủy hoặc thất bại.", [
        {
          text: "OK",
          onPress: () => {
            clearAll();
            navigation.navigate("Main");
          },
        },
      ]);
      return;
    }
  };

  const handleError = () => {
    Alert.alert(
      "Lỗi",
      "Không thể tải trang thanh toán. Vui lòng kiểm tra kết nối mạng và thử lại.",
      [
        {
          text: "Thử lại",
          onPress: () => {
            if (webViewRef.current) {
              webViewRef.current.reload();
            }
          },
        },
        {
          text: "Hủy",
          style: "cancel",
          onPress: () => {
            clearAll();
            navigation.navigate("Main");
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
      <ScreenHeader
        title="Thanh toán"
        onBackPress={() => {
          Alert.alert(
            "Hủy thanh toán",
            "Bạn có chắc chắn muốn hủy thanh toán? Giao dịch sẽ bị hủy.",
            [
              { text: "Tiếp tục thanh toán", style: "cancel" },
              {
                text: "Hủy thanh toán",
                style: "destructive",
                onPress: () => {
                  clearAll();
                  navigation.navigate("Main");
                },
              },
            ]
          );
        }}
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
        // Security settings
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        // iOS specific
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Android specific
        mixedContentMode="always"
        geolocationEnabled={false}
      />
    </View>
  );
};

export default PaymentWebViewScreen;
