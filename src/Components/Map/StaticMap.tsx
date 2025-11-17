import React, { useMemo } from "react";
import { View, Image, ImageBackground, Text } from "react-native";
import { latLngToTile, getTileUrl } from "@Utils/osmTileUtils";
import { FONT_SIZE } from "@Constants/theme";

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  size?: number;
  distanceKm?: number;
}

const StaticMap: React.FC<Props> = ({ lat, lng, zoom = 15, size = 110, distanceKm }) => {
  const tileSize = 256;

  const { x, y } = latLngToTile(lat, lng, zoom);

  const tiles = useMemo(() => {
    const arr: { key: string; url: string }[] = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        arr.push({
          key: `${x + dx}_${y + dy}`,
          url: getTileUrl(x + dx, y + dy, zoom),
        });
      }
    }
    return arr;
  }, [x, y, zoom]);

  const distanceLabel = typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km` : null;

  return (
    <View
      style={{
        width: size,
        height: size,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      <ImageBackground source={{ uri: tiles[4]?.url }} style={{ width: size, height: size }}>
        {/* GHÉP 3×3 tiles */}
        <View
          style={{
            width: tileSize * 3,
            height: tileSize * 3,
            position: "absolute",
            left: -tileSize + size / 2,
            top: -tileSize + size / 2,
          }}
        >
          {tiles.map((t, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return (
              <Image
                key={t.key}
                source={{ uri: t.url }}
                style={{
                  width: tileSize,
                  height: tileSize,
                  position: "absolute",
                  left: col * tileSize,
                  top: row * tileSize,
                }}
              />
            );
          })}
        </View>

        {/* MARKER */}
        <Image
          source={require("@Assets/images/marker.png")}
          style={{
            width: 28,
            height: 28,
            position: "absolute",
            left: size / 2 - 14,
            top: size / 2 - 28,
          }}
        />

        {distanceLabel && (
          <View
            style={{
              position: "absolute",
              right: 8,
              bottom: 4,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: FONT_SIZE.xs ?? 11,
                fontWeight: "bold",
              }}
            >
              {distanceLabel}
            </Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default StaticMap;
