import React from "react";
import { TextInput } from "react-native";
import { PickView, PickText, PickButton } from "@Components";
import { SPACING, FONT_SIZE } from "@Constants/theme";
import { formatCurrency } from "@Utils/currencyUtils";
import { CouponPreviewResponse } from "@Types/couponTypes";
import { useTranslation } from "@Hooks/useTranslation";

interface VoucherPromoSectionProps {
  voucherCode: string;
  setVoucherCode: (code: string) => void;
  isCheckingVoucher: boolean;
  handleCheckVoucher: () => void;
  isLoadingPromo: boolean;
  handlePreviewDisplay: () => void;
  voucherPreview: CouponPreviewResponse | null;
  selectedDetails: number[];
  promoPreview: CouponPreviewResponse | null;
  selectedPromo?: any;
}

const VoucherPromoSection: React.FC<VoucherPromoSectionProps> = ({
  voucherCode,
  setVoucherCode,
  isCheckingVoucher,
  handleCheckVoucher,
  isLoadingPromo,
  handlePreviewDisplay,
  voucherPreview,
  selectedDetails,
  promoPreview,
  selectedPromo,
}) => {
  const { t } = useTranslation();

  return (
    <PickView>
      {/* Nhập voucher */}
      <PickView
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: SPACING.md,
          gap: SPACING.sm,
          backgroundColor: "#F9F9F9",
          borderRadius: 16,
        }}
      >
        <TextInput
          placeholder={t("BOOKING_VOUCHER_INPUT_PLACEHOLDER")}
          style={{
            flex: 1,
            borderWidth: 0,
            paddingHorizontal: 16,
            paddingVertical: 2,
            fontSize: FONT_SIZE.md,
            backgroundColor: "transparent",
            color: "#2B2B2B",
          }}
          value={voucherCode}
          onChangeText={setVoucherCode}
        />
        <PickButton
          title={isCheckingVoucher ? t("BOOKING_VOUCHER_CHECKING") : t("BOOKING_VOUCHER_CHECK")}
          type="Primary"
          onPress={handleCheckVoucher}
          disabled={isCheckingVoucher}
          style={{ borderRadius: 5, paddingHorizontal: 10, height: 40 }}
        />
      </PickView>

      {/* Nút Khuyến mại */}
      <PickButton
        title={isLoadingPromo ? t("BOOKING_PROMO_LOADING") : t("BOOKING_PROMO_BUTTON")}
        type="Primary"
        onPress={handlePreviewDisplay}
        disabled={isLoadingPromo}
        style={{
          borderRadius: 5,
          paddingHorizontal: 10,
          height: 40,
          backgroundColor: "#ff8c43",
          width: 120,
          marginTop: 10,
          marginBottom: 10,
        }}
      />

      {/* Voucher đã chọn */}
      {selectedDetails.length > 0 &&
      voucherPreview &&
      voucherPreview.detailResults
        .filter((d) => selectedDetails.includes(d.detailId))
        .map((d) => {
          const gift = voucherPreview.gifts.find((g) => g.serviceId === d.giftServiceId);
          return (
            <PickView
              key={d.detailId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: SPACING.sm,
                borderRadius: 8,
                backgroundColor: "white",
                marginBottom: 4,
              }}
            >
              <PickView
                style={{
                  backgroundColor: "#DFF5E1",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: "#4CAF50",
                }}
              >
                <PickText style={{ fontWeight: "700", color: "#1B5E20" }}>
                  {t("BOOKING_VOUCHER_BADGE")}
                </PickText>
              </PickView>
              <PickText style={{ fontWeight: "500", color: "#1B5E20" }}>
                {gift
                  ? `${gift.serviceName} x${gift.quantity}`
                  : `- ${formatCurrency(d.lineDiscount)}`}
              </PickText>
            </PickView>
          );
        })}

      {/* Khuyến mại đã chọn */}
      {selectedPromo && promoPreview && (
        <PickView
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: SPACING.sm,
            borderRadius: 8,
            backgroundColor: "white",
          }}
        >
          <PickView
            style={{
              backgroundColor: "#D7E8FF",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: "#014dba",
            }}
          >
            <PickText style={{ fontWeight: "700", color: "#0D47A1" }}>
              {t("BOOKING_PROMO_BADGE")}
            </PickText>
          </PickView>
          <PickText
            style={{ fontWeight: "500", color: "#0D47A1", marginLeft: SPACING.sm, flexShrink: 1 }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {promoPreview?.gifts.find((g) => g.serviceId === selectedPromo.giftServiceId)
              ? `${
                  promoPreview.gifts.find((g) => g.serviceId === selectedPromo.giftServiceId)
                    ?.serviceName
                } x${
                  promoPreview.gifts.find((g) => g.serviceId === selectedPromo.giftServiceId)
                    ?.quantity
                }`
              : `- ${formatCurrency(selectedPromo.lineDiscount || 0)}`}
          </PickText>
        </PickView>
      )}
    </PickView>
  );
};

export default VoucherPromoSection;
