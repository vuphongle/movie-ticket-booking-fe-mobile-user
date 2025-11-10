import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { CouponDto, CouponPreviewResponse } from "@Types/couponTypes";
import { FONT_SIZE, SPACING } from "@Constants/theme";
import { PickView, PickText, PickButton, ScreenHeader } from "@Components";
import MovieInfoCard from "./Components/MovieInfoCard";
import TicketList from "./Components/TicketList";
import ServiceList from "./Components/ServiceList";
import VoucherPromoSection from "./Components/VoucherPromoSection";
import PaymentSection from "./Components/PaymentSection";
import { formatCurrency } from "@Utils/currencyUtils";
import { useBookingStore } from "@Store/useBookingStore";
import { useCreateOrder } from "@Hooks/payment/useCreateOrder";
import { useCouponByCode, usePreviewCoupon, usePreviewAllCoupons } from "@Hooks/coupon/useCoupon";
import VoucherModal from "./Modals/VoucherModal";
import PromoModal from "./Modals/PromoModal";

const TicketConfirmScreen = () => {
  const {
    showtimeId,
    movie,
    cinema,
    auditorium,
    showtime,
    format,
    seats,
    services,
    totalPrice,
    clearAll,
  } = useBookingStore();

  const { mutate: createOrder, isPending } = useCreateOrder();

  const [isAgree, setIsAgree] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponDto | null>(null);
  const [voucherPreview, setVoucherPreview] = useState<CouponPreviewResponse | null>(null);
  const [promoPreview, setPromoPreview] = useState<CouponPreviewResponse | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<number[]>([]);
  const [isCheckingVoucher, setIsCheckingVoucher] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"PAYOS" | "VNPAY" | null>(null);

  const previewAllCoupons = usePreviewAllCoupons();
  const couponByCodeQuery = useCouponByCode(voucherCode, false);
  const previewCouponMutation = usePreviewCoupon();

  useEffect(() => {
    const fetchPromo = async () => {
      if (!seats.length) return;
      setIsLoadingPromo(true);
      try {
        const preview = await previewAllCoupons.mutateAsync({
          body: {
            tickets: seats.map((seat: any) => ({
              seatTypeId: seat.id,
              qty: 1,
              unitPrice: seat.price,
            })),
            services: services
              .filter((s) => s.quantity > 0)
              .map((s) => ({
                serviceId: s.id,
                qty: s.quantity,
                unitPrice: s.price,
              })),
          },
        });

        setPromoPreview(preview);

        if (preview.detailResults.length > 0) {
          const bestPromo = preview.detailResults.reduce((best, current) => {
            return (current.lineDiscount || 0) > (best.lineDiscount || 0) ? current : best;
          }, preview.detailResults[0]);

          setSelectedPromo(bestPromo);
          setPromoDiscount(bestPromo.lineDiscount || 0);
        }
      } catch (err: any) {
        Alert.alert("Lỗi", err.message);
      } finally {
        setIsLoadingPromo(false);
      }
    };

    fetchPromo();
  }, []);

  const handlePreviewDisplay = async () => {
    setIsLoadingPromo(true);
    try {
      const preview = await previewAllCoupons.mutateAsync({
        body: {
          tickets: seats.map((seat) => ({
            seatTypeId: seat.id,
            qty: 1,
            unitPrice: seat.price,
          })),
          services: services
            .filter((s) => s.quantity > 0)
            .map((s) => ({
              serviceId: s.id,
              qty: s.quantity,
              unitPrice: s.price,
            })),
        },
      });

      setPromoPreview(preview);
      setShowPromoModal(true);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setIsLoadingPromo(false);
    }
  };

  const handleCheckVoucher = async () => {
    if (!voucherCode) {
      Alert.alert("Voucher", "Vui lòng nhập mã voucher");
      return;
    }

    setIsCheckingVoucher(true);
    try {
      const coupon = await couponByCodeQuery.refetch();
      if (!coupon.data) {
        Alert.alert("Không hợp lệ", "Không tìm thấy voucher này.");
        return;
      }

      setSelectedCoupon(coupon.data);

      const preview = await previewCouponMutation.mutateAsync({
        id: coupon.data.id,
        body: {
          tickets: seats.map((seat: any) => ({
            seatTypeId: seat.id,
            qty: 1,
            unitPrice: seat.price,
          })),
          services: services
            .filter((s) => s.quantity > 0)
            .map((s) => ({
              serviceId: s.id,
              qty: s.quantity,
              unitPrice: s.price,
            })),
        },
      });

      setVoucherPreview(preview);
      setShowVoucherModal(true);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setIsCheckingVoucher(false);
    }
  };

  const handleConfirmPayment = () => {
    if (!isAgree) {
      Alert.alert("Điều khoản", "Vui lòng đồng ý với điều khoản sử dụng trước khi thanh toán.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Phương thức thanh toán", "Vui lòng chọn phương thức thanh toán.");
      return;
    }

    createOrder(
      {
        showtimeId: showtimeId || 0,
        ticketItems: seats.map((seat) => ({ seatId: seat.id, price: seat.price })),
        serviceItems: services.map((s) => ({
          additionalServiceId: s.id,
          quantity: s.quantity,
          price: s.price,
        })),
        paymentMethod,
      },
      {
        onSuccess: (res) => {
          Alert.alert("Thanh toán", `Đi đến: ${res.url}`);
          clearAll();
        },
        onError: (err) => Alert.alert("Lỗi", err.message),
      }
    );
  };

  const finalTotalPrice = totalPrice - voucherDiscount - promoDiscount;

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
      <ScreenHeader title="Thanh toán" />

      <MovieInfoCard
        movie={movie}
        cinema={cinema}
        auditorium={auditorium}
        showtime={showtime}
        format={format}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F2F3F5" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Thông tin vé và dịch vụ đi kèm */}
          <TicketList seats={seats} />
          <ServiceList services={services} />

          {/* Tổng cộng */}
          <PickView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFF",
              borderRadius: 16,
              padding: SPACING.md,
              marginTop: SPACING.md,
              shadowColor: "#00000015",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <PickText style={{ fontWeight: "500", fontSize: FONT_SIZE.md, color: "#2B2B2B" }}>
              Tổng cộng
            </PickText>
            <PickText style={{ fontWeight: "700", fontSize: FONT_SIZE.lg, color: "#012e6e" }}>
              {formatCurrency(totalPrice)}
            </PickText>
          </PickView>

          <VoucherPromoSection
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            isCheckingVoucher={isCheckingVoucher}
            handleCheckVoucher={handleCheckVoucher}
            isLoadingPromo={isLoadingPromo}
            handlePreviewDisplay={handlePreviewDisplay}
            voucherPreview={voucherPreview}
            selectedDetails={selectedDetails}
            promoPreview={promoPreview}
            selectedPromo={selectedPromo}
          />

          <PaymentSection paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

          {/* Checkbox xác nhận */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: SPACING.lg,
              gap: SPACING.sm,
            }}
            onPress={() => setIsAgree((prev) => !prev)}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderWidth: 1,
                borderColor: "#C4C4C4",
                borderRadius: 6,
                marginTop: 3,
                backgroundColor: isAgree ? "#012e6e" : "#FFF",
              }}
            />
            <PickText
              style={{
                flex: 1,
                color: "#5A5A5A",
                fontSize: FONT_SIZE.sm,
                lineHeight: 20,
              }}
            >
              Tôi xác nhận các thông tin đặt vé đã chính xác và đồng ý với{" "}
              <Text style={{ fontWeight: "bold" }}>Điều khoản dịch vụ</Text>,{" "}
              <Text style={{ textDecorationLine: "underline" }}>Chính sách bảo mật</Text> & của Go
              Cinema.
            </PickText>
          </TouchableOpacity>
        </ScrollView>

        {/* Footer */}
        <View
          style={{
            padding: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: "#E2E2E2",
            backgroundColor: "#FFF",
            width: "100%",
          }}
        >
          <PickButton
            title={isPending ? "Đang xử lý..." : `Thanh toán ${formatCurrency(finalTotalPrice)}`}
            type="Primary"
            onPress={handleConfirmPayment}
            disabled={isPending}
          />
        </View>
      </KeyboardAvoidingView>

      <VoucherModal
        visible={showVoucherModal}
        voucherPreview={voucherPreview}
        selectedCoupon={selectedCoupon}
        selectedDetails={selectedDetails}
        setSelectedDetails={setSelectedDetails}
        setVoucherDiscount={setVoucherDiscount}
        setVisible={setShowVoucherModal}
      />

      <PromoModal
        visible={showPromoModal}
        promoPreview={promoPreview}
        selectedPromo={selectedPromo}
        setSelectedPromo={setSelectedPromo}
        setPromoDiscount={setPromoDiscount}
        setVisible={setShowPromoModal}
      />
    </View>
  );
};

export default TicketConfirmScreen;
