export const latLngToTile = (lat: number, lng: number, zoom: number) => {
  const tileCount = 2 ** zoom;

  const x = Math.floor(((lng + 180) / 360) * tileCount);

  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) +
          1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      tileCount
  );

  return { x, y };
};

export const getTileUrl = (x: number, y: number, zoom: number) => {
  const sub = ["a", "b", "c"][Math.floor(Math.random() * 3)];
  return `https://${sub}.tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
};
