import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@Types/navigationTypes";
import { CouponDto, CouponPreviewResponse } from "@Types/couponTypes";
import { FONT_SIZE, SPACING } from "@Constants/theme";
import { PickView, PickText, PickButton, ScreenHeader, PickCheckbox } from "@Components";
import MovieInfoCard from "./Components/MovieInfoCard";
import TicketList from "./Components/TicketList";
import ServiceList from "./Components/ServiceList";
import VoucherPromoSection from "./Components/VoucherPromoSection";
import PaymentSection from "./Components/PaymentSection";
import { formatCurrency } from "@Utils/currencyUtils";
import { useBookingStore } from "@Store/useBookingStore";
import { useCreateOrder } from "@Hooks/payment/useCreateOrder";
import {
  useCouponByCode,
  usePreviewCoupon,
  usePreviewAllCoupons,
  useCoupons,
} from "@Hooks/coupon/useCoupon";
import VoucherModal from "./Modals/VoucherModal";
import PromoModal from "./Modals/PromoModal";
import BookingTimer from "@Screens/Main/Booking/BaseComponents/BookingTimer";
import UniversalConfirmModal from "@Components/Modals/UniversalConfirmModal";
import { useTranslation } from "@Hooks/useTranslation";

const TicketConfirmScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    expireAt,
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
  const [showVoucherErrorModal, setShowVoucherErrorModal] = useState(false);
  const [voucherErrorTitle, setVoucherErrorTitle] = useState("");
  const [voucherErrorMessage, setVoucherErrorMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAYOS" | "VNPAY" | null>(null);

  const { t } = useTranslation();
  const brandName = t("COMMON_APP_NAME");
  const couponsQuery = useCoupons();
  const previewAllCoupons = usePreviewAllCoupons();
  const couponByCodeQuery = useCouponByCode(voucherCode, false);
  const previewCouponMutation = usePreviewCoupon();

  useEffect(() => {
    const fetchPromo = async () => {
      if (!seats.length || !couponsQuery.data) return; // Chỉ chạy khi có coupons

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

        // Enrich dữ liệu với số lượng giới hạn và đã dùng
        const enrichedDetails = preview.detailResults.map((detail: any) => {
          let couponDetail = null;

          for (const coupon of couponsQuery.data) {
            const foundDetail = coupon.details.find((d: any) => d.id === detail.detailId);
            if (foundDetail) {
              couponDetail = foundDetail.terms;
              break;
            }
          }

          return {
            ...detail,
            limitQuantityApplied: couponDetail?.limitQuantityApplied as number | null,
            detailUsedCount: couponDetail?.detailUsedCount ?? 0,
          };
        });

        setPromoPreview({
          ...preview,
          detailResults: enrichedDetails,
        });

        if (enrichedDetails.length > 0) {
          const bestPromo = enrichedDetails.reduce((best, current) => {
            return (current.lineDiscount || 0) > (best.lineDiscount || 0) ? current : best;
          }, enrichedDetails[0]);

          setSelectedPromo(bestPromo);
          setPromoDiscount(bestPromo.lineDiscount || 0);
        }
      } catch (err: any) {
        Alert.alert(t("COMMON_ERROR"), err.message);
      } finally {
        setIsLoadingPromo(false);
      }
    };

    if (couponsQuery.data) {
      fetchPromo();
    }
  }, [seats, services, couponsQuery.data]);

  const openVoucherModal = (title: string, message: string) => {
    setVoucherErrorTitle(title);
    setVoucherErrorMessage(message);
    setShowVoucherErrorModal(true);
  };

  const handlePreviewDisplay = async () => {
    if (!seats.length || !couponsQuery.data) return;

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

      // enrich dữ liệu ngay trước khi set
      const enrichedDetails = preview.detailResults.map((detail: any) => {
        let couponDetail = null;
        for (const coupon of couponsQuery.data) {
          const foundDetail = coupon.details.find((d: any) => d.id === detail.detailId);
          if (foundDetail) {
            couponDetail = foundDetail.terms;
            break;
          }
        }
        return {
          ...detail,
          limitQuantityApplied: couponDetail?.limitQuantityApplied as number | null,
          detailUsedCount: couponDetail?.detailUsedCount ?? 0,
        };
      });

      setPromoPreview({ ...preview, detailResults: enrichedDetails });

      if (enrichedDetails.length > 0) {
        const bestPromo = enrichedDetails.reduce(
          (best, current) =>
            (current.lineDiscount || 0) > (best.lineDiscount || 0) ? current : best,
          enrichedDetails[0]
        );
        setSelectedPromo(bestPromo);
        setPromoDiscount(bestPromo.lineDiscount || 0);
      }

      setShowPromoModal(true);
    } catch (err: any) {
      Alert.alert(t("COMMON_ERROR"), err.message);
    } finally {
      setIsLoadingPromo(false);
    }
  };

  const handleCheckVoucher = async () => {
    if (!voucherCode) {
      openVoucherModal(t("BOOKING_VOUCHER_TITLE"), t("BOOKING_VOUCHER_ENTER_CODE"));
      return;
    }

    setIsCheckingVoucher(true);
    try {
      const coupon = await couponByCodeQuery.refetch();
      if (!coupon.data) {
        openVoucherModal(
          t("BOOKING_VOUCHER_INVALID_TITLE"),
          t("BOOKING_VOUCHER_INVALID_MESSAGE")
        );
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
      Alert.alert(t("COMMON_ERROR"), error.message);
    } finally {
      setIsCheckingVoucher(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!isAgree) {
      openVoucherModal(t("BOOKING_TERMS_TITLE"), t("BOOKING_TERMS_REQUIRED"));
      return;
    }

    if (!paymentMethod) {
      openVoucherModal(
        t("BOOKING_PAYMENT_METHOD_TITLE"),
        t("BOOKING_PAYMENT_METHOD_REQUIRED")
      );
      return;
    }

    try {
      const totalDiscount = (voucherDiscount || 0) + (promoDiscount || 0);
      const diffMs = expireAt ? expireAt - Date.now() : 0;
      const expireSeconds = Math.max(0, Math.floor(diffMs / 1000));

      // Chuẩn hóa danh sách voucher/promo áp dụng
      const coupons = [
        ...(voucherPreview?.detailResults
          ?.filter((d) => d.applied && selectedDetails.includes(d.detailId))
          ?.map((d) => ({
            detailId: d.detailId,
            code: selectedCoupon?.code || "DEFAULT_VOUCHER",
            discount: d.lineDiscount || 0,
            type: "voucher",
            gifts:
              voucherPreview?.gifts
                ?.filter((g) => g.serviceId === d.giftServiceId)
                ?.map((g) => ({
                  serviceId: g.serviceId,
                  serviceName: g.serviceName,
                  quantity: g.quantity,
                  thumbnail: g.thumbnail,
                })) || [],
          })) || []),
        ...(selectedPromo
          ? [
              {
                detailId: selectedPromo.detailId,
                code: "AUTO_PROMO",
                discount: selectedPromo.lineDiscount || 0,
                type: "promo",
                gifts:
                  promoPreview?.gifts
                    ?.filter((g) => g.serviceId === selectedPromo.giftServiceId)
                    ?.map((g) => ({
                      serviceId: g.serviceId,
                      serviceName: g.serviceName,
                      quantity: g.quantity,
                      thumbnail: g.thumbnail,
                    })) || [],
              },
            ]
          : []),
      ];

      // Gửi yêu cầu tạo đơn hàng
      const body = {
        showtimeId: showtimeId || 0,
        ticketItems: seats.map((seat: any) => ({
          seatId: seat.id,
          price: seat.price,
          priceId: seat.priceId || 0,
        })),
        serviceItems: services
          .filter((s: any) => s.quantity > 0)
          .map((s: any) => ({
            additionalServiceId: s.id,
            quantity: s.quantity,
            price: s.price,
            priceId: s.priceId || 0,
          })),
        discounts: {
          totalDiscount,
          coupons,
        },
        paymentMethod: paymentMethod,
        expireSeconds: expireSeconds,
        platform: "app",
      };

      createOrder(body, {
        onSuccess: (res) => {
          if (res?.url) {
            // Navigate đến WebView screen thay vì mở browser
            navigation.navigate("PaymentWebView", {
              paymentUrl: res.url,
            });
          } else {
            Alert.alert(t("COMMON_NOTICE"), t("BOOKING_PAYMENT_NO_URL"));
          }
        },
        onError: (err: any) => {
          Alert.alert(
            t("BOOKING_PAYMENT_ERROR_TITLE"),
            err?.message || t("BOOKING_PAYMENT_GENERIC_ERROR")
          );
        },
      });
    } catch (error: any) {
      Alert.alert(t("COMMON_ERROR"), error?.message || t("BOOKING_PAYMENT_GENERIC_ERROR"));
    }
  };

  const finalTotalPrice = totalPrice - voucherDiscount - promoDiscount;

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F3F5" }}>
      <ScreenHeader title={t("BOOKING_CONFIRM_TITLE")} />
      <BookingTimer />

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
              {t("BOOKING_CONFIRM_TOTAL_LABEL")}
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
          <PickCheckbox checked={isAgree} onToggle={setIsAgree} style={{ marginTop: SPACING.lg }}>
            <PickText
              style={{
                color: "#5A5A5A",
                fontSize: FONT_SIZE.sm,
                lineHeight: 20,
              }}
            >
              {t("BOOKING_CONFIRM_AGREE_PREFIX")}
              <Text style={{ fontWeight: "bold" }}>{t("BOOKING_CONFIRM_AGREE_TERMS")}</Text>
              {t("BOOKING_CONFIRM_AGREE_SEPARATOR")}
              <Text style={{ textDecorationLine: "underline" }}>
                {t("BOOKING_CONFIRM_AGREE_PRIVACY")}
              </Text>
              {t("BOOKING_CONFIRM_AGREE_SUFFIX", { brand: brandName })}
            </PickText>
          </PickCheckbox>
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
            title={
              isPending
                ? t("COMMON_PROCESSING")
                : t("BOOKING_CONFIRM_PAY", { amount: formatCurrency(finalTotalPrice) })
            }
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
      <UniversalConfirmModal
        visible={showVoucherErrorModal}
        title={voucherErrorTitle}
        message={voucherErrorMessage}
        buttons={[
          {
            text: t("COMMON_OK"),
            type: "primary",
            onPress: () => setShowVoucherErrorModal(false),
          },
        ]}
      />
    </View>
  );
};

export default TicketConfirmScreen;
