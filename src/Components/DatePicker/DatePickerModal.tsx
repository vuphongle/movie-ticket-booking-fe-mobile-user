import React, { useState } from "react";
import { Modal, TouchableOpacity, View, StyleSheet, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PickText } from "@Components";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useTranslation } from "@Hooks/useTranslation";

interface DatePickerModalProps {
  visible: boolean;
  value?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  value,
  minimumDate = new Date(1900, 0, 1),
  maximumDate = new Date(),
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [showPicker, setShowPicker] = useState(false);
  const { t, language } = useTranslation();
  const locale = language === "vi" ? vi : undefined;
  const dateFormat = language === "vi" ? "dd MMMM yyyy" : "MMMM dd, yyyy";

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && date) {
        setSelectedDate(date);
      }
    } else {
      if (date) {
        setSelectedDate(date);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
  };

  if (Platform.OS === "android" && showPicker) {
    return (
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="spinner"
        onChange={handleDateChange}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        locale={language}
      />
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel} />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
              <PickText size={16} font="semibold" style={{ color: "#666" }}>
                {t("COMMON_CANCEL")}
              </PickText>
            </TouchableOpacity>

            <PickText size={18} font="bold" style={{ color: "#1a1a2e" }}>
              {t("AUTH_DOB_PICKER_TITLE")}
            </PickText>

            <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
              <PickText size={16} font="semibold" style={{ color: "#6d5edc" }}>
                {t("COMMON_DONE")}
              </PickText>
            </TouchableOpacity>
          </View>

          {/* Date Display */}
          <View style={styles.dateDisplay}>
            <PickText size={16} font="semibold" style={{ color: "#1a1a2e" }}>
              {format(selectedDate, dateFormat, { locale })}
            </PickText>
          </View>

          {/* iOS DateTimePicker */}
          {Platform.OS === "ios" && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                locale={language}
                textColor="#1a1a2e"
                style={styles.picker}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerButton: {
    minWidth: 60,
  },
  dateDisplay: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  pickerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  picker: {
    width: "100%",
    height: 200,
  },
});
