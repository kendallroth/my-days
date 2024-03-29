import React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Badge } from "react-native-paper";
import { SvgXml } from "react-native-svg";

import { useAppTheme } from "@hooks";

type LanguageIconProps = {
  /** Whether language is in beta (warning badge) */
  beta?: boolean;
  /** Flag XML string */
  flag: string;
  /** Whether language is selected */
  selected?: boolean;
  /** Icon size */
  size: number;
  /** Style object */
  style?: StyleProp<ViewStyle>;
};

const LanguageIcon = (props: LanguageIconProps) => {
  const { beta = false, flag, selected = false, size, style } = props;

  const { colors } = useAppTheme();

  // Flags are a constant 3x2 ratio
  const heightRatio = 2 / 3;
  const height = size * heightRatio;

  const themeStyles = {
    languageIcon: {
      borderColor: colors.outline,
    },
    languageIconBadge: {
      backgroundColor: colors.warning,
    },
    languageIconSelected: {
      borderColor: colors.primary,
    },
  };

  return (
    <View style={[styles.languageIconParent, style]}>
      <View
        style={[
          styles.languageIcon,
          themeStyles.languageIcon,
          selected ? themeStyles.languageIconSelected : undefined,
        ]}
      >
        <SvgXml xml={flag} height={height} width={size} style={styles.languageIconSvg} />
      </View>
      {beta && (
        <Badge size={12} style={[styles.languageIconBadge, themeStyles.languageIconBadge]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  languageIcon: {
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 2,
  },
  languageIconBadge: {
    position: "absolute",
    right: -4,
    top: -4,
  },
  // SVG has slight borders around to be hidden
  languageIconSvg: {
    transform: [{ scale: 1.025 }],
  },
  languageIconParent: {
    alignSelf: "center",
    position: "relative",
  },
});

export default LanguageIcon;
