import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Surface, Text, TouchableRipple } from "react-native-paper";

import { DayIcon } from "@components/icons";
import { Stack } from "@components/layout";
import { useAppTheme } from "@hooks";
import { sharedColors } from "@styles/theme";
import { type DayExtended } from "@typings/day.types";
import { getDayDisplay } from "@utilities/day.util";

type DayDisplayProps = {
  day: DayExtended;
  style?: StyleProp<ViewStyle>;
  onPress?: (day: DayExtended) => void;
  onLongPress?: (day: DayExtended) => void;
};

const DayListItem = (props: DayDisplayProps) => {
  const { day, style, onPress, onLongPress } = props;

  const { colors } = useAppTheme();
  const { t } = useTranslation(["common", "screens"]);

  const dateDisplay = t("screens:home.listItemDate", {
    context: day.repeats ? "noYear" : undefined,
    date: dayjs(day.date),
  });
  const dateCount = getDayDisplay(day);
  const countingDown = dateCount.direction === "down";
  const dayStartsOpen = day.startOpen ?? false;

  const displayNumber = Math.abs(Math.round(dateCount.count * 10) / 10);
  const displayUnit = t(`common:timeUnits.${day.unit}`, { count: displayNumber });

  const countdownColor = colors.primary;
  const countupColor = colors.tertiary;

  const backgroundColor = colors.surfaceVariant;
  const mainColor = countingDown ? countdownColor : countupColor;
  const mainColorText = countingDown ? colors.onPrimary : colors.onTertiary;

  return (
    <TouchableRipple
      rippleColor="transparent"
      onPress={onPress ? () => onPress(day) : () => {}}
      onLongPress={() => onLongPress?.(day)}
    >
      <Surface
        elevation={1}
        style={[
          style,
          styles.day,
          {
            backgroundColor: backgroundColor,
            borderColor: mainColor,
            borderWidth: dateCount.today ? 4 : 2,
          },
        ]}
      >
        <DayIcon
          backgroundColor={mainColor}
          icon={day.icon}
          iconColor={backgroundColor}
          size={40}
          style={styles.dayIcon}
        />

        <View style={styles.dayContent}>
          <Stack alignItems="center" direction="row" spacing={0.5}>
            <Text
              numberOfLines={1}
              style={[
                // NOTE: Do not expand text when icon is shown (would force to right)
                { color: colors.onSurfaceVariant, flexGrow: dayStartsOpen ? 0 : 1 },
                styles.dayContentTitle,
              ]}
              variant="titleMedium"
            >
              {day.title}
            </Text>
            {dayStartsOpen && (
              <Icon color={mainColor} name="open-in-new" size={18} style={{ opacity: 0.8 }} />
            )}
          </Stack>
          <Stack alignItems="center" direction="row" spacing={0.5} style={styles.dayContentFooter}>
            <Text numberOfLines={1} variant="bodySmall">
              {dateDisplay}
            </Text>
            {day.repeats && (
              <Icon color={colors.secondary} name="update" size={14} style={{ marginTop: -2 }} />
            )}
          </Stack>
        </View>

        <View style={[styles.dayStats, { backgroundColor: mainColor }]}>
          {!dateCount.today ? (
            <Fragment>
              <View
                style={[
                  styles.dayStatsIconOutline,
                  // TODO: Support "inset" icon with alignment fix for lengthy numbers...
                  // { backgroundColor: countingDown ? mainColor : backgroundColor },
                  { backgroundColor: mainColor },
                ]}
              >
                <Icon
                  // TODO: Support "inset" icon with alignment fix for lengthy numbers...
                  // color={countingDown ? backgroundColor : mainColor}
                  color={backgroundColor}
                  name={countingDown ? "menu-down" : "menu-up"}
                  style={styles.dayStatsIcon}
                />
              </View>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.dayStatsCount, { color: mainColorText }]}
                variant="headlineMedium"
              >
                {displayNumber}
              </Text>
              <Text style={[styles.dayStatsUnit, { color: mainColorText }]} variant="bodySmall">
                {displayUnit}
              </Text>
            </Fragment>
          ) : (
            <Fragment>
              <Icon color={colors.warning} name="alert-decagram" style={styles.dayStatsTodayIcon} />
            </Fragment>
          )}
        </View>
      </Surface>
    </TouchableRipple>
  );
};

const counterWidth = 90;
const iconFontSize = 32;
const iconFontOffset = 4;

const styles = StyleSheet.create({
  day: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  dayContent: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    // Must layout content above the up/down arrow (due to background color interference)
    zIndex: 1,
  },
  dayContentTitle: {
    // Flex shrink must be set to properly shrink title when icon is shown
    flexShrink: 1,
  },
  dayContentFooter: {
    marginTop: 2,
    opacity: 0.6,
  },
  dayIcon: {
    alignSelf: "center",
    marginLeft: 12,
  },
  dayStats: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: counterWidth,
    padding: 8,
    flexShrink: 0,
  },
  dayStatsCount: {
    fontWeight: "700",
  },
  dayStatsIcon: {
    fontSize: iconFontSize,
    // NOTE: This is a hack to easily align up/down arrows with current margin values
    borderWidth: 0.5,
    borderColor: sharedColors.transparent,
    margin: -iconFontOffset,
  },
  dayStatsIconOutline: {
    position: "absolute",
    left: -(iconFontSize / 2 - iconFontOffset),
    borderRadius: iconFontSize * 2,
  },
  dayStatsTodayIcon: {
    fontSize: iconFontSize * 1.25,
  },
  dayStatsUnit: {
    // TODO: Determine whether unit should be centered with day count (offsets it) or not
    position: "absolute",
    bottom: 4,
    opacity: 0.8,
  },
});

export default DayListItem;
