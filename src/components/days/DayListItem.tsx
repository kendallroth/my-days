import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Avatar, Surface, Text, TouchableRipple } from "react-native-paper";

import { useAppTheme } from "@hooks";
import { sharedColors } from "@styles/theme";
import { type Day } from "@typings/day.types";
import { getDayDisplay } from "@utilities/day.util";

type DayDisplayProps = {
  day: Day;
  style?: StyleProp<ViewStyle>;
  onPress?: (day: Day) => void;
  onLongPress?: (day: Day) => void;
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
        <Avatar.Icon
          color={backgroundColor}
          icon={day.icon ?? ""}
          size={40}
          style={[styles.dayIcon, { backgroundColor: mainColor }]}
        />

        <View style={styles.dayContent}>
          <Text numberOfLines={1} style={{ color: colors.onSurfaceVariant }} variant="titleMedium">
            {day.title}
          </Text>
          <View style={styles.dayContentFooter}>
            <Text numberOfLines={1} variant="bodySmall">
              {dateDisplay}
            </Text>
            {day.repeats && (
              <Icon color={colors.secondary} name="update" style={styles.dayContentFooterIcon} />
            )}
          </View>
        </View>

        <View style={[styles.dayStats, { backgroundColor: mainColor }]}>
          {!dateCount.today ? (
            <Fragment>
              <View
                style={[
                  styles.dayStatsIconOutline,
                  { backgroundColor: countingDown ? mainColor : backgroundColor },
                ]}
              >
                <Icon
                  color={countingDown ? backgroundColor : mainColor}
                  name={countingDown ? "menu-down" : "menu-up"}
                  style={styles.dayStatsIcon}
                />
              </View>
              <Text
                style={[styles.dayStatsCount, { color: mainColorText }]}
                variant="headlineMedium"
              >
                {Math.abs(dateCount.count)}
              </Text>
              <Text style={[styles.dayStatsUnit, { color: mainColorText }]} variant="bodySmall">
                {t("common:timeUnits.days", { count: Math.abs(dateCount.count) })}
              </Text>
            </Fragment>
          ) : (
            <Fragment>
              <Icon
                color={colors.warning}
                // name="calendar-check"
                name="alert-decagram"
                style={styles.dayStatsTodayIcon}
              />
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
  },
  dayContentFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    opacity: 0.6,
  },
  dayContentFooterIcon: {
    marginTop: -2,
    marginLeft: 4,
    fontSize: 14,
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
