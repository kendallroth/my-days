import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Avatar, Surface, Text, Title, useTheme } from "react-native-paper";

import { sharedColors } from "@styles/theme";
import { DATE_FORMAT_LONG, formatDateString } from "@utilities/date.util";
import { getDayDisplay } from "@utilities/day.util";

import type { Day } from "@typings/day.types";

type DayDisplayProps = {
  day: Day;
  style?: StyleProp<ViewStyle>;
};

const DayListItem = (props: DayDisplayProps): ReactElement | null => {
  const { day, style } = props;

  const theme = useTheme();
  const { t } = useTranslation(["common", "screens"]);

  const dateDisplay = day.repeats
    ? `${formatDateString(day.date, DATE_FORMAT_LONG.split(",")[0])}`
    : formatDateString(day.date, DATE_FORMAT_LONG);
  // TODO: Recalculate based on repeats, etc
  const dateCount = getDayDisplay(day);

  const isToday = dateCount.count === 0;
  const countingDown = dateCount.count >= 0;

  const countdownColor = theme.colors.accent;
  const countupColor = theme.colors.primary;
  const mainColor = countingDown ? countdownColor : countupColor;

  return (
    <Surface style={[style, styles.day, { borderColor: mainColor }]}>
      <Avatar.Icon
        color={sharedColors.white}
        icon={day.icon ?? "calendar"}
        size={40}
        style={[styles.dayIcon, { backgroundColor: day.color ?? mainColor }]}
      />

      <View style={styles.dayContent}>
        <Title numberOfLines={1} style={styles.dayContentTitle}>
          {day.title}
        </Title>
        <Text numberOfLines={1} style={styles.dayContentDate}>
          {dateDisplay}
        </Text>
      </View>

      <View style={[styles.dayStats, { backgroundColor: mainColor }]}>
        {!isToday && (
          <View
            style={[
              styles.dayStatsIconOutline,
              { backgroundColor: countingDown ? mainColor : theme.colors.white },
            ]}
          >
            <Icon
              color={countingDown ? theme.colors.white : mainColor}
              name={countingDown ? "menu-down" : "menu-up"}
              style={styles.dayStatsIcon}
            />
          </View>
        )}
        <Title style={styles.dayStatsCount}>{Math.abs(dateCount.count)}</Title>
        <Text style={styles.dayStatsUnit}>{t("common:timeUnits.days")}</Text>
      </View>
    </Surface>
  );
};

const counterWidth = 90;
const iconFontSize = 32;
const iconFontOffset = 4;

const styles = StyleSheet.create({
  day: {
    flexDirection: "row",
    borderRadius: 8,
    elevation: 1,
    overflow: "hidden",
    borderWidth: 2,
  },
  dayContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayContentDate: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 14 * 1.1,
    opacity: 0.6,
  },
  dayContentTitle: {
    fontSize: 18,
    lineHeight: 18 * 1.1,
    fontWeight: "700",
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
  },
  dayStatsCount: {
    fontSize: 28,
    lineHeight: 28 * 1.1,
    color: sharedColors.white,
    fontWeight: "800",
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
  dayStatsUnit: {
    position: "absolute",
    bottom: 6,
    color: sharedColors.white,
    opacity: 0.8,
  },
});

export default DayListItem;
