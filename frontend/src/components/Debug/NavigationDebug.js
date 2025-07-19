import React from 'react';
import { useLocation } from 'react-router-dom';

const NavigationDebug = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.log('🧭 Navigation Debug - Current route:', location.pathname);
    console.log('🧭 Navigation Debug - Full location:', location);
  }, [location]);

  return null; // This component doesn't render anything
};

export default NavigationDebug;
