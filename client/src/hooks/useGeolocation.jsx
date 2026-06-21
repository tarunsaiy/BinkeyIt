import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "user_location_address";

const formatAddress = (data) => {
  const parts = [data.locality, data.city, data.principalSubdivision].filter(
    Boolean
  );
  const formatted = parts.join(", ");
  if (!formatted) return "Unknown location";
  return formatted.length > 38 ? `${formatted.slice(0, 35)}...` : formatted;
};

const useGeolocation = () => {
  const [address, setAddress] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ""
  );
  const [loading, setLoading] = useState(!localStorage.getItem(STORAGE_KEY));

  const fetchAddress = useCallback(async (lat, lon) => {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();
    const formatted = formatAddress(data);
    setAddress(formatted);
    localStorage.setItem(STORAGE_KEY, formatted);
  }, []);

  const refreshLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setAddress("Geolocation not supported");
      setLoading(false);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await fetchAddress(
            position.coords.latitude,
            position.coords.longitude
          );
        } catch {
          setAddress("Unable to detect location");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setAddress("Enable location access");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }, [fetchAddress]);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return { address, loading, refreshLocation };
};

export default useGeolocation;
