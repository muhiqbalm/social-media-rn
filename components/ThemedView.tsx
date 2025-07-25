import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useRef } from "react";
import { Animated, View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "primary" | "secondary";
  skeleton?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type = "primary",
  skeleton = false,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    type === "primary" ? "background" : "secondaryBg"
  );

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (skeleton) {
      startAnimation();
    }

    return () => {
      animatedValue.stopAnimation();
    };
  }, [skeleton]);

  const animatedStyle = skeleton
    ? {
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
      }
    : {};

  const Component = skeleton ? Animated.View : View;

  return (
    <Component
      style={[{ backgroundColor }, style, animatedStyle]}
      {...otherProps}
    />
  );
}
