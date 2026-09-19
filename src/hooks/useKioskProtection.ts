import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const useKioskProtection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isExitingKiosk, setIsExitingKiosk] = useState(false);

  const isKioskMode = sessionStorage.getItem("kioskMode") === "true";
  const currentIsKioskRoute = 
    location.pathname === "/admin" && 
    searchParams.get("fullscreen") === "true" && 
    searchParams.get("kiosk") === "true";

  useEffect(() => {
    // If kiosk mode is active but we're not on the kiosk route, show PIN modal
    // UNLESS we're intentionally exiting kiosk mode
    if (isKioskMode && !currentIsKioskRoute && !isExitingKiosk) {
      setShowPinModal(true);
      setPendingNavigation(location.pathname + location.search);
    }
  }, [location.pathname, location.search, isKioskMode, currentIsKioskRoute, isExitingKiosk]);

  const activateKioskMode = () => {
    sessionStorage.setItem("kioskMode", "true");
    setIsExitingKiosk(false);
  };

  const deactivateKioskMode = () => {
    setIsExitingKiosk(true);
    sessionStorage.removeItem("kioskMode");
    setShowPinModal(false);
    
    if (pendingNavigation) {
      if (pendingNavigation.includes("/admin")) {
        navigate(pendingNavigation);
      } else {
        navigate("/admin");
      }
      setPendingNavigation(null);
    } else {
      navigate("/admin");
    }
    
    setTimeout(() => {
      setIsExitingKiosk(false);
    }, 500);
  };

  const cancelPinModal = () => {
    // Force back to kiosk route
    setShowPinModal(false);
    setPendingNavigation(null);
    navigate("/admin?fullscreen=true&kiosk=true", { replace: true });
  };

  return {
    isKioskMode,
    showPinModal,
    activateKioskMode,
    deactivateKioskMode,
    cancelPinModal,
  };
};
