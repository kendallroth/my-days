import React, { type ReactElement } from "react";
import { Image, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface EmptyMessageProps {
  action?: () => ReactElement;
  style?: StyleProp<ViewStyle>;
  text: string;
}

const EmptyMessage = (props: EmptyMessageProps) => {
  const { action, style, text } = props;

  const imageSize = 280;

  const { dark } = useTheme();

  const emptyImage = !dark
    ? require("@assets/illustrations/illustration_taken_light.png")
    : require("@assets/illustrations/illustration_taken_dark.png");

  return (
    <View style={[styles.content, style]}>
      <Image
        fadeDuration={100}
        resizeMode="contain"
        source={emptyImage}
        style={{ width: imageSize, height: imageSize }}
      />
      <Text style={styles.contentText} variant="titleMedium">
        {text}
      </Text>
      {action?.()}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  contentText: {
    marginTop: 16,
  },
});

export default EmptyMessage;
