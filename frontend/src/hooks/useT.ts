// client/src/hooks/useT.ts
import { useTranslation } from "react-i18next";

export default function useT() {
  const { t, i18n } = useTranslation();
  // 👇 add a debug log
  console.log("Current_Language:", i18n.language);
  return { t, i18n };
}
