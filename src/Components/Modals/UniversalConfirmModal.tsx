import React from "react";
import { Modal, View, Pressable } from "react-native";
import { PickText, PickView } from "@Components";
import { COLORS, SPACING, RADIUS } from "@Constants/theme";

export interface ConfirmButton {
  text: string;
  onPress: () => void;
  type?: "primary" | "cancel" | "danger";
}

interface UniversalConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons: ConfirmButton[];
  onClose?: () => void;
}

const UniversalConfirmModal: React.FC<UniversalConfirmModalProps> = ({
  visible,
  title,
  message,
  buttons,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <PickView
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
        }}
      >
        <PickView
          style={{
            width: "100%",
            backgroundColor: "white",
            borderRadius: RADIUS.md,
            padding: SPACING.lg,
            paddingBottom: 0,
            overflow: "hidden",
          }}
        >
          {title && (
            <PickText
              style={{
                fontSize: 20,
                fontWeight: "700",
                marginBottom: SPACING.md,
                textAlign: "center",
              }}
            >
              {title}
            </PickText>
          )}

          {message && (
            <PickText
              style={{
                fontSize: 15,
                color: COLORS.text.secondary,
                marginBottom: SPACING.lg,
                textAlign: "center",
              }}
            >
              {message}
            </PickText>
          )}

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: -SPACING.lg,
            }}
          >
            {buttons.map((btn, index) => (
              <Pressable
                key={index}
                onPress={btn.onPress}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  backgroundColor: pressed
                    ? btn.type === "primary"
                      ? "#013d94"
                      : btn.type === "danger"
                      ? "#8f271d"
                      : "#e5e5e5"
                    : btn.type === "primary"
                    ? "#012e6e"
                    : btn.type === "danger"
                    ? "#b33126"
                    : "#f3f3f3",

                  justifyContent: "center",
                  alignItems: "center",
                })}
              >
                <PickText
                  style={{
                    color: btn.type === "primary" || btn.type === "danger" ? "white" : "black",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  {btn.text}
                </PickText>
              </Pressable>
            ))}
          </View>
        </PickView>
      </PickView>
    </Modal>
  );
};

export default UniversalConfirmModal;
