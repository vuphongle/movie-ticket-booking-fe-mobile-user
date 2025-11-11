import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, Alert } from "react-native";
import { PickView, PickText, ScreenHeader } from "@Components";
import { COLORS } from "@Constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdditionalServices } from "@Hooks/additionalService/useAdditionalService";
import { useBookingStore } from "@Store/useBookingStore";
import BookingSummary from "@Screens/Main/Booking/BaseComponents/BookingSummary";
import BookingTimer from "@Screens/Main/Booking/BaseComponents/BookingTimer";
import { useCancelSeatMulti } from "@Hooks/booking/useReservation";

import AdditionalTab from "./Components/AdditionalTab";
import AdditionalItem from "./Components/AdditionalItem";
import SelectedServiceList from "./Components/SelectedServiceList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";

type SelectScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "SelectSeat">;

const AdditionalServiceScreen: React.FC = () => {
  const navigation = useNavigation<SelectScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const { services: fetchedServices, isLoading } = useAdditionalServices();
  const { showtimeId, seats, services, addService, updateServiceQty, clearAll } = useBookingStore();
  const { mutateAsync: cancelSeatMulti } = useCancelSeatMulti();

  const [openTab, setOpenTab] = useState<"COMBO" | "SINGLE">("COMBO");

  useEffect(() => {
    if (fetchedServices.length > 0 && services.length === 0) {
      fetchedServices.forEach((s) =>
        addService({
          id: s.id,
          name: s.name,
          description: s.description,
          thumbnail: s.thumbnail,
          type: s.type as "COMBO" | "SINGLE",
          quantity: 0,
          price: s.price || 0,
          priceId: s.priceId || 0,
        })
      );
    }
  }, [fetchedServices]);

  const handleBackPress = () => {
    const hasSelectedSeatOrService = seats.length > 0 || services.some((s) => s.quantity > 0);

    if (hasSelectedSeatOrService) {
      Alert.alert(
        "Xác nhận rời khỏi",
        "Ghế và dịch vụ đã chọn sẽ bị hủy, bạn có chắc chắn muốn rời?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đồng ý",
            style: "destructive",
            onPress: async () => {
              try {
                if (seats.length > 0 && showtimeId) {
                  await cancelSeatMulti({
                    showtimeId,
                    seatIds: seats.map((s) => s.id),
                  });
                }

                clearAll();
                navigation.goBack();
              } catch (err) {
                console.error("Cancel seat failed:", err);
                Alert.alert("Lỗi", "Không thể hủy giữ ghế, vui lòng thử lại.");
              }
            },
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const filteredServices = services.filter((s) => s.type === openTab);
  const selectedItems = services.filter((s) => s.quantity > 0);

  return (
    <PickView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScreenHeader title="Dịch vụ bổ sung" onBackPress={handleBackPress} />
      <BookingTimer />

      <AdditionalTab openTab={openTab} setOpenTab={setOpenTab} />

      {isLoading ? (
        <PickView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <PickText>Đang tải dịch vụ...</PickText>
        </PickView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
        >
          {filteredServices.map((item) => (
            <AdditionalItem key={item.id} item={item} updateServiceQty={updateServiceQty} />
          ))}
        </ScrollView>
      )}

      <SelectedServiceList selectedItems={selectedItems} updateServiceQty={updateServiceQty} />
      <BookingSummary onContinue={() => navigation.navigate("TicketConfirm")} />
    </PickView>
  );
};

export default AdditionalServiceScreen;
