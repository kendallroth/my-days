import React, { ReactElement } from "react";
import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Title, useTheme } from "react-native-paper";

interface EmptyMessageProps {
  action?: () => ReactElement;
  style?: StyleProp<ViewStyle>;
  text: string;
}

const EmptyMessage = (props: EmptyMessageProps): ReactElement => {
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
      <Title style={styles.contentText}>{text}</Title>
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
    fontWeight: "700",
    marginTop: 16,
  },
});

export default EmptyMessage;
