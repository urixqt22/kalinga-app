import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface AdaptiveButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>; // Style for the outer container
  missPadding?: number;     // How much extra space around to detect "misses"
  missThreshold?: number;   // How many misses before scaling up?
  maxScale?: number;        // Max scale factor
  scaleIncrement?: number;  // How much to grow per miss threshold
  autoWidth?: boolean;      // If true, button sizes to content. If false (default), stretches to 100%.
  adaptive?: boolean;       // If true (default), enables adaptive scaling. If false, behaves like a standard button.
}

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  children,
  onPress,
  style,
  containerStyle,
  missPadding = 40,
  missThreshold = 2,
  maxScale = 1.5,
  scaleIncrement = 0.2,
  autoWidth = false,
  adaptive = true,
}) => {
  const [missCount, setMissCount] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!adaptive) {
    return (
      <View
        style={[
          styles.container,
          autoWidth ? { width: 'auto', alignSelf: 'flex-start' } : { width: '100%' },
          containerStyle
        ]}
      >
        <TouchableOpacity
          style={style}
          onPress={onPress}
          activeOpacity={0.8}
        >
          {children}
        </TouchableOpacity>
      </View>
    );
  }

  // Reset state when leaving the screen (blur)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Run when screen loses focus
        console.log('Screen blur: Resetting AdaptiveButton state');
        setMissCount(0);
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: false,
          friction: 5,
          tension: 40,
        }).start();
      };
    }, [scaleAnim])
  );

  const handleMiss = () => {
    console.log('Miss detected!', missCount + 1);
    const newMissCount = missCount + 1;
    setMissCount(newMissCount);

    if (newMissCount >= missThreshold) {
      const growthSteps = Math.floor(newMissCount / missThreshold);
      let newScale = 1 + (growthSteps * scaleIncrement);

      if (newScale > maxScale) newScale = maxScale;

      Animated.spring(scaleAnim, {
        toValue: newScale,
        useNativeDriver: false, // Changed to false for layout animation
        friction: 5,
        tension: 40,
      }).start();
    }
  };

  const handlePress = () => {
    console.log('Hit!');
    setMissCount(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false, // Changed to false
    }).start();

    onPress();
  };

  // Interpolate Scale Y (Height grows 3x faster)
  const scaleY = scaleAnim.interpolate({
    inputRange: [1, 2],
    outputRange: [1, 4]
  });

  // Inverse scales to keep content static while container grows
  const inverseScaleX = Animated.divide(1, scaleAnim);
  const inverseScaleY = Animated.divide(1, scaleY);

  // Calculate extra vertical space required to push neighbors
  // Gap created by scaling = (Height * ScaleY - Height)
  // We want to add half of that to top coverage (margin) and half to bottom?
  // Actually, transform scale expands from center.
  // So the element visuals extend by (H * (S-1)) / 2 upwards and downwards.
  // To stop overlap, we need to increase margin by that amount.

  const extraMargin = layoutHeight > 0
    ? Animated.multiply(
      layoutHeight / 2,
      Animated.subtract(scaleY, 1)
    )
    : 0;

  // Base margin used to be -missPadding, but now that we removed padding from the container,
  // we just need the positive extra margin to push neighbors away when scaling.
  const animatedMargin = extraMargin;

  // Flatten style to preserve layout (flexDirection, etc.) in the wrapper
  const flatStyle = StyleSheet.flatten(style || {});
  // Explicitly cast to ViewStyle to avoid TS errors if flatStyle is assumed to be ImageStyle etc.
  const { flexDirection, justifyContent, alignItems } = flatStyle as ViewStyle;

  return (
    <Animated.View
      style={[
        styles.container,
        autoWidth ? { width: 'auto', alignSelf: 'flex-start' } : { width: '100%' },
        {
          // paddingVertical: missPadding, // REMOVED: This was causing the walkthrough highlight to be too big
          marginVertical: animatedMargin
        },
        containerStyle
      ]}>
      {/* 
        The "Miss" detector:
        A transparent layer that fills the container AND extends outwards using hitSlop.
        We render it as 0 height/width so it doesn't affect layout, but use hitSlop to cover the area.
        Actually, we can just make it absolute fill and use hitSlop to go beyond.
      */}
      <TouchableWithoutFeedback
        onPress={handleMiss}
        hitSlop={{ top: missPadding, bottom: missPadding, left: missPadding, right: missPadding }}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {/* The Actual Button */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          {
            transform: [
              { scaleX: scaleAnim }, // Width grows normally
              { scaleY }             // Height grows 3x faster
            ]
          },
          { width: autoWidth ? 'auto' : '100%' }
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={style}
          onLayout={(event) => setLayoutHeight(event.nativeEvent.layout.height)}
        >
          {/* Wrap children in Inverse Scale View to keep content size static 
              We must replicate the layout properties of the parent style to prevent "jumbling".
          */}
          <Animated.View style={{
            transform: [{ scaleX: inverseScaleX }, { scaleY: inverseScaleY }],
            flexDirection,
            justifyContent,
            alignItems,
            width: '100%', // Ensure it fills the TouchableOpacity
          }}>
            {children}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    // Ensure the container does not clip the hitSlop area (though hitslop usually works regardless of overflow on Android)
  },
});
