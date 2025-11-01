import React, { useRef, useEffect, useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Portal } from "@gorhom/portal";
import { Modalize } from "react-native-modalize";
import { PickView, PickText } from "@Components";
import useThemedStyles from "@Theme/Hook/useThemedStyles";

interface AvatarOptionsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onUploadImage: () => void;
}

const AvatarOptionsBottomSheet: React.FC<AvatarOptionsBottomSheetProps> = ({
  visible,
  onClose,
  onCamera,
  onUploadImage,
}) => {
  const { colors, spacing } = useThemedStyles();
  const modalizeRef = useRef<Modalize>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (visible) {
        modalizeRef.current?.open();
      } else {
        modalizeRef.current?.close();
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [visible]);

  const handleCamera = useCallback(() => {
    modalizeRef.current?.close();
    requestAnimationFrame(() => {
      setTimeout(onCamera, 100);
    });
  }, [onCamera]);

  const handleUploadImage = useCallback(() => {
    modalizeRef.current?.close();
    requestAnimationFrame(() => {
      setTimeout(onUploadImage, 100);
    });
  }, [onUploadImage]);

  const handleCancel = useCallback(() => {
    modalizeRef.current?.close();
  }, []);

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight
        modalStyle={{ backgroundColor: colors.background["bg-primary"] }}
        onClosed={onClose}
        withHandle={false}
      >
        <PickView style={{ paddingVertical: spacing.s12 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              paddingVertical: spacing.s14,
              borderColor: colors.border["border-primary"],
              borderBottomWidth: 1,
              backgroundColor:
                pressedButton === "camera"
                  ? colors.background["bg-brand-quaternary"]
                  : "transparent",
            }}
            onPress={handleCamera}
            onPressIn={() => setPressedButton("camera")}
            onPressOut={() => setPressedButton(null)}
          >
            <PickView style={{ alignItems: "center" }}>
              <PickText
                variant="body_large"
                color={pressedButton === "camera" ? "body-inverted" : "body"}
                size={16}
              >
                Chụp ảnh
              </PickText>
            </PickView>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            style={{
              paddingVertical: spacing.s14,
              backgroundColor:
                pressedButton === "upload"
                  ? colors.background["bg-brand-quaternary"]
                  : "transparent",
            }}
            onPress={handleUploadImage}
            onPressIn={() => setPressedButton("upload")}
            onPressOut={() => setPressedButton(null)}
          >
            <PickView style={{ alignItems: "center" }}>
              <PickText
                variant="body_large"
                color={pressedButton === "upload" ? "body-inverted" : "body"}
                size={16}
              >
                Chọn từ thư viện
              </PickText>
            </PickView>
          </TouchableOpacity>

          <PickView
            height={8}
            width={"100%"}
            backgroundColor={colors.background["bg-secondary"]}
          ></PickView>

          <TouchableOpacity
            activeOpacity={1}
            style={{
              paddingVertical: spacing.s14,
              backgroundColor:
                pressedButton === "cancel" ? colors.background["bg-secondary"] : "transparent",
            }}
            onPress={handleCancel}
            onPressIn={() => setPressedButton("cancel")}
            onPressOut={() => setPressedButton(null)}
          >
            <PickView style={{ alignItems: "center" }}>
              <PickText variant="body_large" size={16} color="body">
                Hủy
              </PickText>
            </PickView>
          </TouchableOpacity>
        </PickView>
      </Modalize>
    </Portal>
  );
};

export default AvatarOptionsBottomSheet;
