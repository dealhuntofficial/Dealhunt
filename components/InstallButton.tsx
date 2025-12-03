"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // capture beforeinstallprompt
    function handleBeforeInstall(e: any) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // optional: detect already installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    // register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW registered"))
        .catch((err) => console.warn("SW registration failed:", err));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (!deferredPrompt || isInstalled) return null;

  const onInstallClick = async () => {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    setDeferredPrompt(null);
  };

  return (
    <button
      onClick={onInstallClick}
      className="fixed bottom-6 right-6 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg z-50"
    >
      Install DealHunt
    </button>
  );
}
