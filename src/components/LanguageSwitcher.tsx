import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import "./LanguageSwitcher.css";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ur" : "en";
    i18n.changeLanguage(newLang);
    // Update document direction for RTL support
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      title={
        i18n.language === "en" ? "Switch to Urdu" : "انگریزی میں سوئچ کریں"
      }
    >
      <Languages size={18} />
      <span className="lang-text">
        {i18n.language === "en" ? "اردو" : "English"}
      </span>
    </button>
  );
};

export default LanguageSwitcher;

