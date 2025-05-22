"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";
import { VerticalNav } from "./verticalnav";
import { Header } from "./header";
import { Dashboard01 } from "./dashboard01";
import { Dashboard02 } from "./dashboard02";
import { Dashboard03 } from "./dashboard03";
import { Dashboard04 } from "./dashboard04";

export function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  
  // テーマの値を業務管理システム用に変換
  const businessTheme = mounted && theme === "dark" ? "dark-mode" : "light-mode";

  // マウント後にのみレンダリングを行い、ハイドレーションエラーを防止
  useEffect(() => {
    setMounted(true);
  }, []);

  // ナビゲーションアイテムが変更されたときの処理
  const handleNavChange = (index: number) => {
    setActiveNavIndex(index);
  };

  // アクティブなコンポーネントを表示
  const renderActiveComponent = () => {
    switch (activeNavIndex) {
      case 0:
        return <Dashboard01 />;
      case 1:
        return <Dashboard02 />;
      case 2:
        return <Dashboard03 />;
      case 3:
        return <Dashboard04 />;
      default:
        return <Dashboard01 />;
    }
  };

  return (
    <>
      {/* パーティクル背景 */}
      <div id="particles-js"></div>

      {/* 垂直ナビゲーション */}
      <VerticalNav activeNavIndex={activeNavIndex} onNavChange={handleNavChange} />

      {/* メインコンテンツ */}
      <div className={`business-system ${businessTheme}`}>
        {/* ヘッダー */}
        <Header />

        {/* アクティブなコンポーネントを表示 */}
        {renderActiveComponent()}
      </div>

      {/* particles.js ライブラリ */}
      <Script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js" 
        onLoad={() => {
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
        }} 
      />
    </>
  );
}
