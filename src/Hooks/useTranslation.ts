import { useI18nContext } from "@Contexts/I18nContext";

export const useTranslation = () => {
  const context = useI18nContext();
  return context;
};

export default useTranslation;
