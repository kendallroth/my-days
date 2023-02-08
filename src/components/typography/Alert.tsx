import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React, { type ReactElement } from "react";
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from "react-native";
import { Text } from "react-native-paper";

import { useAppTheme } from "@hooks";
import { type MaterialCommunityIcons } from "@typings/app.types";

type AlertType = "info" | "error" | "warning";

type AlertProps = {
  /** Alert content */
  children: ReactElement | ReactElement[] | string;
  /** Alert icon */
  icon?: keyof MaterialCommunityIcons;
  /** Alert icon size */
  iconSize?: number;
  /** Style */
  style?: StyleProp<ViewStyle>;
  /** Text style */
  textStyle?: StyleProp<TextStyle>;
  /** Type of alert */
  type?: AlertType;
};

const Alert = (props: AlertProps) => {
  const {
    children,
    icon = "alert-decagram",
    iconSize = 24,
    style,
    textStyle,
    type = "warning",
  } = props;

  const { colors } = useAppTheme();

  const iconColorMap: Record<AlertType, string> = {
    error: colors.error,
    info: colors.primary,
    warning: colors.warning,
  };

  const themeStyles = {
    alertText: {
      color: colors.secondary,
    },
  };

  const childIsString = typeof children === "string";

  return (
    <View style={[styles.alert, style]}>
      <Icon color={iconColorMap[type]} name={icon} size={iconSize} style={styles.alertIcon} />
      {childIsString ? (
        <Text style={[styles.alertText, themeStyles.alertText, textStyle]} variant="bodyLarge">
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertIcon: {
    top: -3,
    marginRight: 8,
  },
  alertText: {
    flexShrink: 1,
  },
});

export default Alert;
