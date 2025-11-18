import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator } from "react-native";
import { PickView, PickText, ScreenHeader } from "@Components";
import { COLORS } from "@Constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAdditionalServices } from "@Hooks/additionalService/useAdditionalService";
import { useBookingStore } from "@Store/useBookingStore";
import BookingSummary from "@Screens/Main/Booking/BaseComponents/BookingSummary";
import BookingTimer from "@Screens/Main/Booking/BaseComponents/BookingTimer";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { services: fetchedServices, isLoading } = useAdditionalServices();
  const { showtimeId, seats, services, addService, updateServiceQty, clearAll } = useBookingStore();
  const { mutateAsync: cancelSeatMulti } = useCancelSeatMulti();
  const [isPending, setIsPending] = useState(false);

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
      setShowLeaveModal(true);
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      navigation.navigate("TicketConfirm");
    } catch (err) {
      console.error("Continue failed:", err);
    } finally {
      setIsPending(false);
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
      <BookingSummary onContinue={handleContinue} isPending={isPending} />

      <UniversalConfirmModal
        visible={showLeaveModal}
        title="Xác nhận rời khỏi"
        message="Ghế và dịch vụ đã chọn sẽ bị hủy, bạn có chắc chắn muốn rời?"
        buttons={[
          {
            text: "Hủy",
            type: "cancel",
            onPress: () => setShowLeaveModal(false),
          },
          {
            text: "Đồng ý",
            type: "primary",
            onPress: async () => {
              try {
                if (seats.length > 0 && showtimeId) {
                  await cancelSeatMulti({
                    showtimeId,
                    seatIds: seats.map((s) => s.id),
                  });
                }
                clearAll();
                setShowLeaveModal(false);
                navigation.goBack();
              } catch (err) {
                console.error("Cancel seat failed:", err);
              }
            },
          },
        ]}
      />
    </PickView>
  );
};

export default AdditionalServiceScreen;
