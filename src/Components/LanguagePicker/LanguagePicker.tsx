import React, { useState } from "react";
import { PickView } from "@Components";
import { Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";
import { PickButton } from "@Components/Button";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "vn", name: "Vietnamese", nativeName: "Tiếng Việt" },
];

export const LanguagePicker = () => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setModalVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      onPress={() => handleLanguageChange(item.code)}
      style={[styles.languageItem, item.code === i18n.language && styles.selectedLanguageItem]}
      accessibilityRole="button"
    >
      <Text style={styles.languageName}>{item.nativeName}</Text>
      <Text style={styles.languageDesc}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <PickView style={{ alignItems: "flex-end", marginBottom: 8 }}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          backgroundColor: "#3366ff",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          minWidth: 100,
          alignItems: "center",
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          {currentLanguage.nativeName}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <PickView style={styles.backdrop}>
          <PickView style={styles.modal}>
            <Text style={styles.modalTitle}>{t("CHANGE_LANGUAGE")}</Text>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              style={styles.languageList}
            />
            <PickButton
              style={styles.cancelButton}
              type="Tertiary"
              onPress={() => setModalVisible(false)}
              size="sm"
              title={t("CANCEL")}
            ></PickButton>
          </PickView>
        </PickView>
      </Modal>
    </PickView>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "700",
    fontSize: 16,
  },
  languageList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  languageItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  selectedLanguageItem: {
    backgroundColor: "rgba(51, 102, 255, 0.1)",
  },
  languageName: {
    fontWeight: "600",
    fontSize: 15,
  },
  languageDesc: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
  },
  cancelButton: {
    marginTop: 8,
    alignSelf: "center",
    minWidth: 100,
  },
});
