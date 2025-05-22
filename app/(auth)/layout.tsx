"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [theme, setTheme] = useState<"light-mode" | "dark-mode">("light-mode");

  useEffect(() => {
    // 保存されたテーマを適用または初期テーマを設定
    const savedTheme = localStorage.getItem("theme") as "light-mode" | "dark-mode" || "light-mode";
    setTheme(savedTheme);
  }, []);

  // テーマ切り替え処理
  const toggleTheme = () => {
    const newTheme = theme === "light-mode" ? "dark-mode" : "light-mode";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={`min-h-screen hermit-system ${theme}`}>
      {/* パーティクル背景 */}
      <div id="particles-js"></div>

      {/* 垂直ナビゲーション */}
      <nav className="vertical-nav">
        <div className="mode-toggle" id="mode-toggle" onClick={toggleTheme}>
          {theme === "dark-mode" ? (
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="main-content">
        {children}
      </div>

      <Script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" onLoad={() => {
        // @ts-ignore
        if (window.particlesJS) {
          // @ts-ignore
          window.particlesJS("particles-js", {
            "particles": {
              "number": {
                "value": 38,
                "density": {
                  "enable": true,
                  "value_area": 800
                }
              },
              "color": {
                "value": ["#6979F8", "#00C6FF", "#BE52F2", "#FF5EDF"]
              },
              "shape": {
                "type": "polygon",
                "stroke": {
                  "width": 0
                },
                "polygon": {
                  "nb_sides": 5
                }
              },
              "opacity": {
                "value": 0.7,
                "random": false,
                "anim": {
                  "enable": true,
                  "speed": 2.2,
                  "opacity_min": 0.08,
                  "sync": false
                }
              },
              "size": {
                "value": 4,
                "random": true,
                "anim": {
                  "enable": false,
                  "speed": 40,
                  "size_min": 0.1,
                  "sync": false
                }
              },
              "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#6979F8",
                "opacity": 0.6,
                "width": 1
              },
              "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                  "enable": false,
                  "rotateX": 600,
                  "rotateY": 961.4
                }
              }
            },
            "interactivity": {
              "detect_on": "canvas",
              "events": {
                "onhover": {
                  "enable": false,
                  "mode": "repulse"
                },
                "onclick": {
                  "enable": false
                },
                "resize": true
              }
            },
            "retina_detect": true
          });
        }
      }} />
    </div>
  );
}
