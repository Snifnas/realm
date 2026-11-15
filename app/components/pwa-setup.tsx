"use client";
import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PWASetup() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [ios, setIos] = useState(false);
  const [visible, setVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setInstalled(isStandalone);
    setIos(isIos);
    const dismissed = localStorage.getItem("realm-install-dismissed") === "1";
    if (!isStandalone && !dismissed) setVisible(true);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
      setVisible(true);
    };
    const onInstalled = () => { setInstalled(true); setVisible(false); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") { setVisible(false); setInstalled(true); }
    setPrompt(null);
  }
  function dismiss() {
    setVisible(false);
    localStorage.setItem("realm-install-dismissed", "1");
  }
  if (!visible || installed) return null;
  return <aside className="install-nudge" aria-label="Install REALM">
    <span className="install-icon">R</span>
    <div className="install-copy"><b>Take REALM with you</b><small>{ios ? "Tap Share, then “Add to Home Screen”." : prompt ? "Install REALM for a full-screen app experience." : "Use your browser menu to install or add to your home screen."}</small></div>
    {prompt && <button onClick={install}>INSTALL</button>}
    <button className="install-dismiss" onClick={dismiss} aria-label="Dismiss install prompt">×</button>
  </aside>;
}
