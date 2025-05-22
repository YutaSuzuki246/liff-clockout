"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";
import { VerticalNav } from "./verticalnav";
import { Header } from "./header";

export function Dashboard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("notices");
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  
  // テーマの値を業務管理システム用に変換
  const businessTheme = mounted && theme === "dark" ? "dark-mode" : "light-mode";

  // マウント後にのみレンダリングを行い、ハイドレーションエラーを防止
  useEffect(() => {
    setMounted(true);
  }, []);

  // タブ切り替え処理
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // タブ切り替え時に施設選択を解除
    setActiveFacility(null);
  };

  // 施設アイテムクリック処理
  const handleFacilityClick = (facilityName: string) => {
    if (activeFacility === facilityName) {
      // 既に選択されている施設なら選択解除
      setActiveFacility(null);
      setActiveTab("notices");
    } else {
      // 新しい施設を選択
      setActiveFacility(facilityName);
    }
  };

  return (
    <>
      {/* パーティクル背景 */}
      <div id="particles-js"></div>

      {/* 垂直ナビゲーション */}
      <VerticalNav />

      {/* メインコンテンツ */}
      <div className={`business-system ${businessTheme}`}>
        {/* ヘッダー */}
        <Header />

        {/* コンテンツエリア */}
        <div className="content-area">
          {/* サイドバー (25%) */}
          <div className="sidebar">
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <svg className="icon card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  施設一覧
                </div>
                <div className="card-action toggle-facility-name" title="施設名表示切替">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M17 6H3"></path><path d="M21 12H3"></path><path d="M15.5 18H3"></path></svg>
                </div>
              </div>
              <ul className="facility-list">
                {["施設A", "施設B", "施設C", "施設D", "施設E"].map((facility) => (
                  <li 
                    key={facility}
                    className={`facility-item ${activeFacility === facility ? 'active' : ''}`}
                    onClick={() => handleFacilityClick(facility)}
                  >
                    <div className="facility-name">
                      <svg className="icon facility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      <span>{facility}</span>
                    </div>
                    <svg className="icon pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* メインエリア (75%) */}
          <div className="content">
            <div className="card">
              <div className="tab-nav" style={{ display: activeFacility ? 'none' : 'flex' }}>
                <div 
                  className={`tab ${activeTab === 'notices' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('notices')}
                >お知らせ</div>
                <div 
                  className={`tab ${activeTab === 'unread' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('unread')}
                >お知らせ(未読)</div>
                <div 
                  className={`tab ${activeTab === 'read' ? 'active' : ''}`} 
                  onClick={() => handleTabClick('read')}
                >お知らせ(既読)</div>
              </div>

              {/* お知らせパネル */}
              <div className="panel" id="notices-panel" style={{ display: activeTab === 'notices' && !activeFacility ? 'block' : 'none' }}>
                <div className="panel-header">
                  <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <h3 className="panel-title">お知らせ2件</h3>
                </div>
                <div className="notice-list">
                  <div className="notice-item">
                    <div className="notice-content">
                      <div className="notice-header">
                        <span className="notice-badge badge-important">重要</span>
                        <h4 className="notice-title">OTA 障害復旧</h4>
                      </div>
                      <div className="notice-meta">
                        <span>2025-04-21</span>
                        <span>佐藤太郎(管理者)</span>
                      </div>
                    </div>
                    <div className="unread-dot"></div>
                  </div>
                  <div className="notice-item">
                    <div className="notice-content">
                      <div className="notice-header">
                        <h4 className="notice-title">月次メンテナンス予定</h4>
                      </div>
                      <div className="notice-meta">
                        <span>2025-04-18</span>
                        <span>佐藤太郎(管理者)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 未読パネル */}
              <div className="panel" id="unread-panel" style={{ display: activeTab === 'unread' && !activeFacility ? 'block' : 'none' }}>
                <div className="panel-header">
                  <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <h3 className="panel-title">未読お知らせ1件</h3>
                </div>
                <div className="notice-list">
                  <div className="notice-item">
                    <div className="notice-content">
                      <div className="notice-header">
                        <span className="notice-badge badge-important">重要</span>
                        <h4 className="notice-title">OTA 障害復旧</h4>
                      </div>
                      <div className="notice-meta">
                        <span>2025-04-21</span>
                        <span>管理者</span>
                      </div>
                    </div>
                    <div className="unread-dot"></div>
                  </div>
                </div>
              </div>

              {/* 既読パネル */}
              <div className="panel" id="read-panel" style={{ display: activeTab === 'read' && !activeFacility ? 'block' : 'none' }}>
                <div className="panel-header">
                  <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <h3 className="panel-title">既読お知らせ1件</h3>
                </div>
                <div className="notice-list">
                  <div className="notice-item read">
                    <div className="notice-content">
                      <div className="notice-header">
                        <h4 className="notice-title">月次メンテナンス予定</h4>
                      </div>
                      <div className="notice-meta">
                        <span>2025-04-18</span>
                        <span>管理者</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 施設情報パネル */}
              {activeFacility && (
                <div className="panel" id="facility-info-panel">
                  <div className="panel-header">
                    <svg className="icon panel-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                    <h3 className="panel-title">施設情報</h3>
                    <button className="back-to-notices" title="お知らせに戻る" onClick={() => {
                      setActiveFacility(null);
                      setActiveTab("notices");
                    }}>
                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                    </button>
                  </div>
                  <div className="facility-info-content">
                    <div className="facility-detail">
                      <h4 className="facility-name-title">{activeFacility}</h4>
                      <div className="facility-status">
                        <div className="status-item">
                          <div className="status-label">電話番号</div>
                          <div className="status-value-container">
                            <div className="status-value facility-phone">03-{activeFacility === "施設A" ? "1234-5678" : activeFacility === "施設B" ? "2345-6789" : activeFacility === "施設C" ? "3456-7890" : activeFacility === "施設D" ? "4567-8901" : "5678-9012"}</div>
                            <button className="copy-button" data-copy-target="facility-phone" title="電話番号をコピー">
                              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="status-item">
                          <div className="status-label">メールアドレス</div>
                          <div className="status-value-container">
                            <div className="status-value facility-email">
                              {activeFacility === "施設A" ? "towerA@example.com" : 
                               activeFacility === "施設B" ? "hotelB@example.com" : 
                               activeFacility === "施設C" ? "esteC@example.com" : 
                               activeFacility === "施設D" ? "apartmentD@example.com" : 
                               "restaurantE@example.com"}
                            </div>
                            <button className="copy-button" data-copy-target="facility-email" title="メールアドレスをコピー">
                              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="facility-stats">
                      <div className="stats-item site-info-container">
                        <div className="stats-header">
                          <h5>サイト情報</h5>
                        </div>
                        <div className="tab-nav site-tabs">
                          <div className="tab site-tab active">サイトコントローラー</div>
                          <div className="tab site-tab">自社サイト</div>
                          <div className="tab site-tab">連携非対応OTA1</div>
                          <div className="tab site-tab">連携非対応OTA2</div>
                        </div>
                        
                        <div className="site-panel active" id="controller-panel">
                          <table className="site-info-table">
                            <tbody>
                              <tr>
                                <th>サイト名</th>
                                <td className="site-name">サイトコントローラー</td>
                              </tr>
                              <tr>
                                <th>URL</th>
                                <td>
                                  <div className="site-value-container">
                                    <div className="site-url">
                                      <a href={`https://controller.${activeFacility.toLowerCase()}.example.com`} target="_blank" rel="noopener noreferrer">
                                        {`https://controller.${activeFacility.toLowerCase()}.example.com`}
                                      </a>
                                    </div>
                                    <button className="copy-button" data-copy-target="controller-url" title="URLをコピー">
                                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>ID</th>
                                <td>
                                  <div className="site-value-container">
                                    <div className="site-id">{`admin${activeFacility.replace("施設", "")}`}</div>
                                    <button className="copy-button" data-copy-target="controller-id" title="IDをコピー">
                                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>PASS</th>
                                <td>
                                  <div className="site-value-container">
                                    <div className="site-pass">********</div>
                                    <button className="copy-button" data-copy-target="controller-pass" title="パスワードをコピー">
                                      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* トースト通知 */}
                  <div className="copy-toast">クリップボードにコピーしました</div>
                </div>
              )}
            </div>
          </div>
        </div>
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
