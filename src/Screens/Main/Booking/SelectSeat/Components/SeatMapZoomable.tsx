import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import {
  PanGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import ViewShot from "react-native-view-shot";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MINI_MAP_SIZE = 100;
const MINI_VIEWPORT_COLOR = "#012e6e";

interface SeatMapZoomableProps {
  children: React.ReactNode;
  watchDeps?: any[];
  containerSize: { width: number; height: number };
}

const SeatMapZoomable: React.FC<SeatMapZoomableProps> = ({
  children,
  watchDeps = [],
  containerSize,
}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [miniMapUri, setMiniMapUri] = useState<string | null>(null);

  const mapRef = useRef<any>(null);

  /** Chụp map để render mini-map */
  const captureMiniMap = () => {
    if (mapRef.current) {
      mapRef.current.capture().then((uri: string) => setMiniMapUri(uri));
    }
  };

  /** Lấy layout map thật để scale mini-map */
  const onMapLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setMapSize({ width, height });

    const scaleFit = Math.min(SCREEN_WIDTH / width, (SCREEN_HEIGHT * 0.65) / height);
    scale.value = withTiming(scaleFit, { duration: 200 });
    translateX.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(0, { duration: 200 });

    runOnJS(captureMiniMap)();
  };

  /** Tự động cập nhật mini-map khi dữ liệu map thay đổi */
  useEffect(() => {
    captureMiniMap();
  }, watchDeps); // watchDeps = [seats, ...] từ SelectSeatScreen

  /** Xử lý pinch zoom */
  const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, any>({
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      const newScale = ctx.startScale * event.scale;
      scale.value = Math.min(Math.max(0.6, newScale), 2.8);
    },
  });

  /** Xử lý pan */
  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (e, ctx: any) => {
      translateX.value = ctx.startX + e.translationX;
      translateY.value = ctx.startY + e.translationY;
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value * 0.7, { damping: 10 });
      translateY.value = withSpring(translateY.value * 0.7, { damping: 10 });
    },
  });

  /** Style map chính */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  /** Style viewport mini-map */
  const miniViewportStyle = useAnimatedStyle(() => {
    if (!mapSize.width || !mapSize.height || !containerSize.width || !containerSize.height)
      return {};

    const scaleX = MINI_MAP_SIZE / mapSize.width;
    const scaleY = MINI_MAP_SIZE / mapSize.height;

    const viewportWidth = (containerSize.width / scale.value) * scaleX;
    const viewportHeight = (containerSize.height / scale.value) * scaleY;

    // bù padding map + rowLabel
    const paddingLeft = 16;
    const paddingTop = 75;
    const rowLabelWidth = 20;
    const rowLabelMarginRight = 60;

    const offsetX = paddingLeft + rowLabelWidth + rowLabelMarginRight;
    const offsetY = paddingTop;

    const translateXViewport = (-translateX.value + offsetX) * scaleX;
    const translateYViewport = (-translateY.value + offsetY) * scaleY;

    return {
      width: viewportWidth,
      height: viewportHeight,
      transform: [{ translateX: translateXViewport }, { translateY: translateYViewport }],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View
              style={[animatedStyle, { alignItems: "center", justifyContent: "center" }]}
            >
              {/* ViewShot để capture map */}
              <ViewShot
                ref={mapRef}
                options={{ format: "png", quality: 0.9 }}
                onLayout={onMapLayout}
              >
                {children}
              </ViewShot>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>

      {/* MINI MAP */}
      {miniMapUri && (
        <View style={styles.miniMap}>
          <Image
            source={{ uri: miniMapUri }}
            style={[styles.miniMapContent, { opacity: 0.8 }]}
            resizeMode="contain"
          />
          <Animated.View style={[styles.miniMapViewport, miniViewportStyle]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  miniMap: {
    position: "absolute",
    top: 10,
    left: 10,
    width: MINI_MAP_SIZE,
    height: MINI_MAP_SIZE,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#00000055",
    padding: 2,
  },
  miniMapContent: {
    flex: 1,
    width: MINI_MAP_SIZE,
    height: MINI_MAP_SIZE,
  },
  miniMapViewport: {
    position: "absolute",
    borderWidth: 2,
    borderColor: MINI_VIEWPORT_COLOR,
    borderRadius: 2,
  },
});

export default SeatMapZoomable;
