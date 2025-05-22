"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// サイト情報の型定義
interface SiteInfo {
  name: string;
  url: string;
  id: string;
  pass: string;
}

interface SiteInfoData {
  [key: string]: SiteInfo;
}

export function Dashboard04() {
  const [activeTab, setActiveTab] = useState("notices");
  const [activeFacility, setActiveFacility] = useState<string | null>(null);
  const [activeSiteTab, setActiveSiteTab] = useState("controller");
  const [showCompatibleOTAs, setShowCompatibleOTAs] = useState(false);
  const [isNicknameMode, setIsNicknameMode] = useState(false);
  const siteTabsRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // 施設の正式名称と通称のマッピング
  const facilityNames: {[key: string]: string} = {
    "施設A": "通称A",
    "施設B": "通称B",
    "施設C": "通称C",
    "施設D": "通称D",
    "施設E": "通称E",
  };

  // 逆引き用のマッピング（通称→正式名称）を作成
  const reverseNames: {[key: string]: string} = {};
  for (const [official, nickname] of Object.entries(facilityNames)) {
    reverseNames[nickname] = official;
  }

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
      // サイトタブをデフォルトに戻す
      setActiveSiteTab("controller");
    }
  };

  // サイトタブの切り替え処理
  const handleSiteTabClick = (tabId: string) => {
    setActiveSiteTab(tabId);
  };

  // 施設名表示切替処理
  const toggleFacilityName = () => {
    setIsNicknameMode(!isNicknameMode);
  };

  // 実際の表示名を取得（正式名称または通称）
  const getDisplayName = (officialName: string | null) => {
    if (!officialName) return "";
    return isNicknameMode ? facilityNames[officialName] || officialName : officialName;
  };

  // 施設名から内部で使用する正式名称を取得
  const getOfficialName = (displayName: string | null) => {
    if (!displayName) return "";
    if (isNicknameMode) {
      return reverseNames[displayName] || displayName;
    }
    return displayName;
  };

  // タブのスクロール処理（ホイール）
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (siteTabsRef.current) {
        e.preventDefault();
        siteTabsRef.current.scrollLeft += e.deltaY;
      }
    };

    const tabsElement = siteTabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("wheel", handleWheel, { passive: false });
    }
    
    return () => {
      if (tabsElement) {
        tabsElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [activeFacility, showCompatibleOTAs]);

  // タブのドラッグによるスクロール処理
  useEffect(() => {
    if (!siteTabsRef.current) return;
    
    const tabsElement = siteTabsRef.current;
    
    // ドラッグ開始
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - tabsElement.offsetLeft);
      setScrollLeft(tabsElement.scrollLeft);
    };
    
    // ドラッグ中
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - tabsElement.offsetLeft;
      const walk = (x - startX) * 2; // スクロール速度調整
      tabsElement.scrollLeft = scrollLeft - walk;
    };
    
    // ドラッグ終了
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // マウスがタブエリアから離れた場合
    const handleMouseLeave = () => {
      setIsDragging(false);
    };

    // タッチスクリーン用イベント
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - tabsElement.offsetLeft);
        setScrollLeft(tabsElement.scrollLeft);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const x = e.touches[0].pageX - tabsElement.offsetLeft;
      const walk = (x - startX) * 2;
      tabsElement.scrollLeft = scrollLeft - walk;
      e.preventDefault();
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
    };
    
    // イベントリスナー登録
    tabsElement.addEventListener("mousedown", handleMouseDown);
    tabsElement.addEventListener("mousemove", handleMouseMove);
    tabsElement.addEventListener("mouseup", handleMouseUp);
    tabsElement.addEventListener("mouseleave", handleMouseLeave);
    
    // タッチイベント登録
    tabsElement.addEventListener("touchstart", handleTouchStart);
    tabsElement.addEventListener("touchmove", handleTouchMove, { 
      passive: false,
    });
    tabsElement.addEventListener("touchend", handleTouchEnd);
    
    // クリーンアップ
    return () => {
      tabsElement.removeEventListener("mousedown", handleMouseDown);
      tabsElement.removeEventListener("mousemove", handleMouseMove);
      tabsElement.removeEventListener("mouseup", handleMouseUp);
      tabsElement.removeEventListener("mouseleave", handleMouseLeave);
      
      tabsElement.removeEventListener("touchstart", handleTouchStart);
      tabsElement.removeEventListener("touchmove", handleTouchMove);
      tabsElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, scrollLeft, activeFacility, showCompatibleOTAs]);

  // OTA表示切り替え処理
  const toggleCompatibleOTAs = useCallback(() => {
    setShowCompatibleOTAs(!showCompatibleOTAs);
    // 非表示にするときに連携対応OTAタブがアクティブなら、コントローラータブに戻す
    if (showCompatibleOTAs && activeSiteTab.startsWith("ota-compatible")) {
      setActiveSiteTab("controller");
    }
  }, [showCompatibleOTAs, activeSiteTab]);

  // クリップボードへのコピー処理
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("クリップボードへのコピーに失敗しました:", err);
    });
    showCopyToast();
  };

  // トースト通知を表示
  const showCopyToast = () => {
    const toast = document.querySelector(".copy-toast") as HTMLElement;
    if (toast) {
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 2000);
    }
  };

  // 各施設のサイト情報データ
  const getSiteInfoData = (facilityName: string): SiteInfoData => {
    const lowercaseName = facilityName.toLowerCase().replace("施設", "");
    
    const baseInfo: SiteInfoData = {
      "controller": {
        name: "サイトコントローラー",
        url: `https://controller.${lowercaseName}.example.com`,
        id: `admin${facilityName.replace("施設", "")}`,
        pass: `pass${facilityName.replace("施設", "")}123`
      },
      "official": {
        name: "自社サイト",
        url: `https://${lowercaseName}.example.com/official`,
        id: `user${facilityName.replace("施設", "")}`,
        pass: `official${facilityName.replace("施設", "")}`
      },
      "ota-incompatible1": {
        name: "連携非対応OTA1",
        url: `https://booking.example.com/${lowercaseName}`,
        id: `otaUser${facilityName.replace("施設", "")}1`,
        pass: `ota${facilityName.replace("施設", "")}123`
      },
      "ota-incompatible2": {
        name: "連携非対応OTA2",
        url: `https://hotels.example.com/${lowercaseName}`,
        id: `otaUser${facilityName.replace("施設", "")}2`,
        pass: `ota${facilityName.replace("施設", "")}234`
      },
      "ota-incompatible3": {
        name: "連携非対応OTA3",
        url: `https://travel.example.com/${lowercaseName}`,
        id: `otaUser${facilityName.replace("施設", "")}3`,
        pass: `ota${facilityName.replace("施設", "")}345`
      },
      "ota-incompatible4": {
        name: "連携非対応OTA4",
        url: `https://stay.example.com/${lowercaseName}`,
        id: `otaUser${facilityName.replace("施設", "")}4`,
        pass: `ota${facilityName.replace("施設", "")}456`
      },
      "ota-compatible1": {
        name: "連携対応OTA1",
        url: `https://travelpartner1.example.com/${lowercaseName}`,
        id: `travel${facilityName.replace("施設", "")}1`,
        pass: `travel${facilityName.replace("施設", "")}123`
      },
      "ota-compatible2": {
        name: "連携対応OTA2",
        url: `https://travelpartner2.example.com/${lowercaseName}`,
        id: `travel${facilityName.replace("施設", "")}2`,
        pass: `travel${facilityName.replace("施設", "")}234`
      },
      "ota-compatible3": {
        name: "連携対応OTA3",
        url: `https://travelpartner3.example.com/${lowercaseName}`,
        id: `travel${facilityName.replace("施設", "")}3`,
        pass: `travel${facilityName.replace("施設", "")}345`
      },
      "ota-compatible4": {
        name: "連携対応OTA4",
        url: `https://travelpartner4.example.com/${lowercaseName}`,
        id: `travel${facilityName.replace("施設", "")}4`,
        pass: `travel${facilityName.replace("施設", "")}456`
      }
    };
    
    return baseInfo;
  };

  return (
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
            <div className={`card-action toggle-facility-name ${isNicknameMode ? "active" : ""}`} title="施設名表示切替" onClick={toggleFacilityName}>
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
                  <span>{getDisplayName(facility)}</span>
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
          <div className="panel" id="notices-panel" style={{ display: activeTab === "notices" && !activeFacility ? "block" : "none" }}>
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
          <div className="panel" id="unread-panel" style={{ display: activeTab === "unread" && !activeFacility ? "block" : "none" }}>
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
          <div className="panel" id="read-panel" style={{ display: activeTab === "read" && !activeFacility ? "block" : "none" }}>
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
                  <h4 className="facility-name-title">{getDisplayName(activeFacility)}</h4>
                  <div className="facility-status">
                    <div className="status-item">
                      <div className="status-label">電話番号</div>
                      <div className="status-value-container">
                        <div className="status-value facility-phone">03-{activeFacility === "施設A" ? "1234-5678" : activeFacility === "施設B" ? "2345-6789" : activeFacility === "施設C" ? "3456-7890" : activeFacility === "施設D" ? "4567-8901" : "5678-9012"}</div>
                        <button 
                          className="copy-button" 
                          title="電話番号をコピー"
                          onClick={() => copyToClipboard(`03-${activeFacility === "施設A" ? "1234-5678" : activeFacility === "施設B" ? "2345-6789" : activeFacility === "施設C" ? "3456-7890" : activeFacility === "施設D" ? "4567-8901" : "5678-9012"}`)}
                        >
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
                        <button 
                          className="copy-button" 
                          title="メールアドレスをコピー"
                          onClick={() => copyToClipboard(activeFacility === "施設A" ? "towerA@example.com" : 
                            activeFacility === "施設B" ? "hotelB@example.com" : 
                            activeFacility === "施設C" ? "esteC@example.com" : 
                            activeFacility === "施設D" ? "apartmentD@example.com" : 
                            "restaurantE@example.com")}
                        >
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
                      <button 
                        className={`toggle-ota-button ${showCompatibleOTAs ? "active" : ""}`} 
                        title="連携対応OTAの表示/非表示"
                        onClick={toggleCompatibleOTAs}
                      >
                        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="tab-nav site-tabs" 
                      ref={siteTabsRef} 
                      style={{ 
                        cursor: isDragging ? "grabbing" : "grab",
                        userSelect: "none" 
                      }}
                    >
                      <div 
                        className={`tab site-tab ${activeSiteTab === "controller" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("controller")}
                      >サイトコントローラー</div>
                      <div 
                        className={`tab site-tab ${activeSiteTab === "official" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("official")}
                      >自社サイト</div>
                      <div 
                        className={`tab site-tab ${activeSiteTab === "ota-incompatible1" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-incompatible1")}
                      >連携非対応OTA1</div>
                      <div 
                        className={`tab site-tab ${activeSiteTab === "ota-incompatible2" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-incompatible2")}
                      >連携非対応OTA2</div>
                      <div 
                        className={`tab site-tab ${activeSiteTab === "ota-incompatible3" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-incompatible3")}
                      >連携非対応OTA3</div>
                      <div 
                        className={`tab site-tab ${activeSiteTab === "ota-incompatible4" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-incompatible4")}
                      >連携非対応OTA4</div>
                      <div 
                        className={`tab site-tab ota-compatible-tab ${activeSiteTab === "ota-compatible1" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-compatible1")}
                        style={{ display: showCompatibleOTAs ? "block" : "none" }}
                      >連携対応OTA1</div>
                      <div 
                        className={`tab site-tab ota-compatible-tab ${activeSiteTab === "ota-compatible2" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-compatible2")}
                        style={{ display: showCompatibleOTAs ? "block" : "none" }}
                      >連携対応OTA2</div>
                      <div 
                        className={`tab site-tab ota-compatible-tab ${activeSiteTab === "ota-compatible3" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-compatible3")}
                        style={{ display: showCompatibleOTAs ? "block" : "none" }}
                      >連携対応OTA3</div>
                      <div 
                        className={`tab site-tab ota-compatible-tab ${activeSiteTab === "ota-compatible4" ? "active" : ""}`}
                        onClick={() => handleSiteTabClick("ota-compatible4")}
                        style={{ display: showCompatibleOTAs ? "block" : "none" }}
                      >連携対応OTA4</div>
                    </div>
                    
                    {/* サイト情報パネル */}
                    {activeFacility && Object.entries(getSiteInfoData(activeFacility)).map(([key, siteInfo]) => (
                      <div 
                        key={key}
                        className={`site-panel ${activeSiteTab === key ? "active" : ""}`} 
                        id={`${key}-panel`}
                        style={{ 
                          display: activeSiteTab === key ? "block" : "none",
                          ...(key.startsWith("ota-compatible") && !showCompatibleOTAs ? { display: "none" } : {})
                        }}
                      >
                        <table className="site-info-table">
                          <tbody>
                            <tr>
                              <th>サイト名</th>
                              <td className="site-name">{siteInfo.name}</td>
                            </tr>
                            <tr>
                              <th>URL</th>
                              <td>
                                <div className="site-value-container">
                                  <div className="site-url">
                                    <a href={siteInfo.url} target="_blank" rel="noopener noreferrer">
                                      {siteInfo.url}
                                    </a>
                                  </div>
                                  <button 
                                    className="copy-button" 
                                    title="URLをコピー"
                                    onClick={() => copyToClipboard(siteInfo.url)}
                                  >
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
                                  <div className="site-id">{siteInfo.id}</div>
                                  <button 
                                    className="copy-button" 
                                    title="IDをコピー"
                                    onClick={() => copyToClipboard(siteInfo.id)}
                                  >
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
                                  <div className="site-pass" data-real-password={siteInfo.pass}>********</div>
                                  <button 
                                    className="copy-button" 
                                    title="パスワードをコピー"
                                    onClick={() => copyToClipboard(siteInfo.pass)}
                                  >
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
                    ))}
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
  );
}
