export const parseLatLng = (url: string) => {
  try {
    const matchLat = url.match(/!3d([-0-9.]+)/);
    const matchLng = url.match(/!2d([-0-9.]+)/);

    const lat = matchLat ? Number(matchLat[1]) : 0;
    const lng = matchLng ? Number(matchLng[1]) : 0;

    return { lat, lng };
  } catch {
    return { lat: 0, lng: 0 };
  }
};