import React from "react";
import {
  Mic,
  Camera,
  Brain,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Leaf,
  Users,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./About.css";

const About: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Mic size={32} />,
      title: t("about.voiceInterface"),
      description: t("about.voiceInterfaceDescription"),
    },
    {
      icon: <Camera size={32} />,
      title: t("about.smartAnalysis"),
      description: t("about.smartAnalysisDescription"),
    },
    {
      icon: <Brain size={32} />,
      title: t("about.aiPredictions"),
      description: t("about.aiPredictionsDescription"),
    },
    {
      icon: <TrendingUp size={32} />,
      title: t("about.yieldOptimization"),
      description: t("about.yieldOptimizationDescription"),
    },
    {
      icon: <Globe size={32} />,
      title: t("about.localizedGuidance"),
      description: t("about.localizedGuidanceDescription"),
    },
    {
      icon: <Shield size={32} />,
      title: t("about.sustainableFarming"),
      description: t("about.sustainableFarmingDescription"),
    },
  ];

  const stats = [
    { number: "10K+", label: t("about.farmersHelped") },
    { number: "50+", label: t("about.cropVarieties") },
    { number: "95%", label: t("about.accuracyRate") },
    { number: "24/7", label: t("about.aiSupport") },
  ];

  return (
    <div className="about">
      <div className="about-container">
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-content">
            <div className="hero-icon">
              <Leaf size={48} />
            </div>
            <h1>{t("about.title")}</h1>
            <p className="hero-description">{t("about.description")}</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="section-content">
            <h2>{t("about.mission")}</h2>
            <p className="mission-text">{t("about.missionText")}</p>
            <div className="mission-values">
              <div className="value-item">
                <Zap className="value-icon" />
                <div>
                  <h4>{t("about.innovationTitle")}</h4>
                  <p>{t("about.innovationDescription")}</p>
                </div>
              </div>
              <div className="value-item">
                <Users className="value-icon" />
                <div>
                  <h4>{t("about.accessibilityTitle")}</h4>
                  <p>{t("about.accessibilityDescription")}</p>
                </div>
              </div>
              <div className="value-item">
                <BarChart3 className="value-icon" />
                <div>
                  <h4>{t("about.resultsTitle")}</h4>
                  <p>{t("about.resultsDescription")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>{t("about.keyFeatures")}</h2>
            <p>{t("about.keyFeaturesDescription")}</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="section-content">
            <h2>{t("about.impactNumbers")}</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section">
          <div className="section-header">
            <h2>{t("about.howItWorks")}</h2>
            <p>{t("about.howItWorksDescription")}</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>{t("about.step1Title")}</h3>
                <p>{t("about.step1Description")}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>{t("about.step2Title")}</h3>
                <p>{t("about.step2Description")}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>{t("about.step3Title")}</h3>
                <p>{t("about.step3Description")}</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>{t("about.step4Title")}</h3>
                <p>{t("about.step4Description")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>{t("about.ctaTitle")}</h2>
            <p>{t("about.ctaDescription")}</p>
            <button className="cta-button">{t("about.ctaButton")}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
