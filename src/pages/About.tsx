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
import "./About.css";

const About: React.FC = () => {
  const features = [
    {
      icon: <Mic size={32} />,
      title: "Voice-First Interface",
      description:
        "Natural communication in local languages makes farming advice accessible to everyone, regardless of literacy level.",
    },
    {
      icon: <Camera size={32} />,
      title: "Smart Crop Analysis",
      description:
        "Camera-based analysis provides instant insights on crop health, growth progress, and potential issues.",
    },
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Predictions",
      description:
        "Advanced algorithms predict optimal sowing and harvesting periods with accurate ripening time estimates.",
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Yield Optimization",
      description:
        "Real-time recommendations help improve crop yield through data-driven farming decisions.",
    },
    {
      icon: <Globe size={32} />,
      title: "Localized Guidance",
      description:
        "Personalized advice that adapts to your specific crop conditions and local farming practices.",
    },
    {
      icon: <Shield size={32} />,
      title: "Sustainable Farming",
      description:
        "Promotes eco-friendly practices that protect the environment while maximizing productivity.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Farmers Helped" },
    { number: "50+", label: "Crop Varieties" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "AI Support" },
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
            <h1>About KhetiAI</h1>
            <p className="hero-description">
              KhetiAI is an intelligent agricultural assistant designed to
              revolutionize farming through AI-powered insights, natural
              communication, and smart crop analysis.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p className="mission-text">
              We believe that every farmer deserves access to cutting-edge
              agricultural technology. KhetiAI bridges the gap between
              traditional farming wisdom and modern AI capabilities, making
              sustainable and profitable agriculture accessible to farmers
              worldwide.
            </p>
            <div className="mission-values">
              <div className="value-item">
                <Zap className="value-icon" />
                <div>
                  <h4>Innovation</h4>
                  <p>
                    Leveraging the latest AI technology to solve real farming
                    challenges
                  </p>
                </div>
              </div>
              <div className="value-item">
                <Users className="value-icon" />
                <div>
                  <h4>Accessibility</h4>
                  <p>
                    Making advanced farming tools available to farmers of all
                    backgrounds
                  </p>
                </div>
              </div>
              <div className="value-item">
                <BarChart3 className="value-icon" />
                <div>
                  <h4>Results</h4>
                  <p>
                    Delivering measurable improvements in crop yield and farming
                    efficiency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="section-header">
            <h2>Key Features</h2>
            <p>Discover how KhetiAI transforms your farming experience</p>
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
            <h2>Impact in Numbers</h2>
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
            <h2>How It Works</h2>
            <p>Simple steps to smarter farming</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Ask Questions</h3>
                <p>
                  Use your voice or text to ask about your crops, weather, or
                  farming challenges.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Capture Images</h3>
                <p>
                  Take photos of your crops for instant health analysis and
                  growth monitoring.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Get Insights</h3>
                <p>
                  Receive personalized recommendations and predictions tailored
                  to your farm.
                </p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Apply & Improve</h3>
                <p>
                  Implement the suggestions and watch your farming efficiency
                  and yield improve.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Farming?</h2>
            <p>
              Join thousands of farmers who are already using KhetiAI to make
              smarter, more sustainable farming decisions.
            </p>
            <button className="cta-button">Start Your Journey</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
