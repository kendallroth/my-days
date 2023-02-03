import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";

import { useAppTheme } from "@hooks";
import { MaterialCommunityIcons } from "@typings/app.types";

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

const Alert = (props: AlertProps): ReactElement | null => {
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
    // TODO: Add warning color
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
        <Text style={[styles.alertText, themeStyles.alertText, textStyle]}>{children}</Text>
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
    fontSize: 16,
  },
});

export default Alert;
