import React, { ReactElement, useMemo } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Text, useTheme } from "react-native-paper";

type QuoteProps = {
  /** Quote content */
  children: string;
  /** Quote border colour */
  color?: string;
  /** Quote style */
  style?: ViewStyle;
  /** Quote content style */
  textStyle?: TextStyle;
};

const Quote = (props: QuoteProps): ReactElement => {
  const { children, color, style, textStyle } = props;

  const { colors } = useTheme();

  const themeStyles = useMemo(
    () => ({
      quote: {
        borderLeftColor: color ?? colors.primary,
      },
      quoteText: {
        color: colors.onSecondaryContainer,
        opacity: 0.8,
      },
    }),
    [color, colors],
  );

  return (
    <View style={[styles.quote, themeStyles.quote, style]}>
      <Text style={[themeStyles.quoteText, textStyle]} variant="bodyLarge">
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  quote: {
    paddingVertical: 4,
    paddingLeft: 16,
    borderLeftWidth: 4,
    borderRadius: 4,
  },
});

export default Quote;
