import { useNavigation } from "@react-navigation/native";
import React, { type ReactElement, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { List, useTheme } from "react-native-paper";

import { useSnackbar } from "@hooks";
import {
  type SettingsRouterNavigation,
  type SettingsRouterParams,
} from "@screens/Settings/SettingsRouter";
import { type MaterialCommunityIcons } from "@typings/app.types";

export type Props = {
  /** Whether list item is disabled */
  disabled?: boolean;
  /** Whether list item is implemented */
  implemented?: boolean;
  /** List item icon */
  icon: keyof MaterialCommunityIcons;
  /** List item right slot (defaults to arrow icon) */
  right?: (props: any) => ReactElement;
  /** List item navigation route */
  route?: keyof SettingsRouterParams;
  /** List item title */
  title: string;
  /** Press handler (if not route) */
  onPress?: () => void;
};

const SettingsListItem = (props: Props) => {
  const { disabled = false, implemented = true, icon, right, route, title, onPress } = props;

  const navigator = useNavigation<SettingsRouterNavigation>();
  const { notifyError } = useSnackbar();
  const { colors } = useTheme();
  const { t } = useTranslation(["common"]);

  /**
   * List item press handler
   */
  const onItemPress = useCallback(() => {
    if (!implemented) {
      notifyError(t("common:errors.notImplemented"));
      return;
    }

    if (route) {
      navigator.navigate(route);
    } else if (onPress) {
      onPress();
    }
  }, [implemented, navigator, notifyError, onPress, route, t]);

  /**
   * Render right icon
   *
   * @param   rightProps - Right props
   * @returns Rendered right icon
   */
  const renderRight = (rightProps: any) => {
    if (right) {
      return right(rightProps);
    } else {
      return disabled ? null : <List.Icon {...rightProps} icon="chevron-right" />;
    }
  };

  return (
    <List.Item
      {...props}
      disabled={disabled}
      left={(leftProps) => (
        <List.Icon
          {...leftProps}
          color={!disabled ? colors.primary : leftProps.color}
          icon={icon}
        />
      )}
      title={title}
      right={renderRight}
      onPress={onItemPress}
    />
  );
};

export default SettingsListItem;
