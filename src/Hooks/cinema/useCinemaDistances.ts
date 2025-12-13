import { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { parseLatLng } from "@Utils/parseLatLng";
import { requestLocationPermission } from "@Hooks/useRequestLocationPermission";

export const useCinemaDistances = (cinemas: any[]) => {
  const [distances, setDistances] = useState<{ [id: number]: number }>({});

  useEffect(() => {
    if (cinemas.length === 0) return;

    const fetchDistances = async () => {
      const granted = await requestLocationPermission();
      if (!granted) {
        console.warn("Location permission denied → skipping distance calculation");
        return;
      }

      Geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          const R = 6371; // km
          const newDistances: any = {};

          cinemas.forEach((c) => {
            const { lat, lng } = parseLatLng(c.mapLocation);

            const dLat = ((lat - latitude) * Math.PI) / 180;
            const dLon = ((lng - longitude) * Math.PI) / 180;

            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos((latitude * Math.PI) / 180) *
                Math.cos((lat * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;

            const cc = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            newDistances[c.id] = Number((R * cc).toFixed(1));
          });

          setDistances(newDistances);
        },
        (err) => console.error("GPS error:", err),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    };

    fetchDistances();
  }, [cinemas]);

  return distances;
};
