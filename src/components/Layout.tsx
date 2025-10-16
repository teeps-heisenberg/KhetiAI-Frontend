import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <Leaf className="logo-icon" />
              <span className="logo-text">{t("layout.appName")}</span>
            </Link>

            <nav className="nav">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
              >
                {t("layout.home")}
              </Link>
              <Link
                to="/about"
                className={`nav-link ${
                  location.pathname === "/about" ? "active" : ""
                }`}
              >
                <Info size={16} />
                {t("layout.about")}
              </Link>
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>
              &copy; 2024 {t("layout.appName")}. {t("layout.footer")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
