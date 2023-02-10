import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Avatar, Text } from "react-native-paper";

import { AppBar, Page } from "@components/layout";
import { useAppSelector, useAppTheme, useSnackbar } from "@hooks";
import { selectDay } from "@store/slices/days";
import { type DayUnit } from "@typings/day.types";
import { getDayDisplay } from "@utilities/day.util";
import { type RootRouterParams } from "src/AppRouter";

type DetailsScreenRouteProps = NativeStackScreenProps<RootRouterParams, "DetailsScreen">;

interface CountStat {
  number: number;
  unit: DayUnit;
  /** Unit localization key */
  unitLabel: string;
}

const DetailScreen = () => {
  const route = useRoute<DetailsScreenRouteProps["route"]>();
  const navigation = useNavigation<DetailsScreenRouteProps["navigation"]>();

  const { t } = useTranslation(["common", "screens"]);
  const { notifyError } = useSnackbar();

  const { colors } = useAppTheme();

  const day = useAppSelector((s) => selectDay(s, route.params.dayId));
  if (!day) {
    notifyError("Invalid day selected");
    navigation.navigate("HomeScreen");
    return null;
  }

  const dateCount = getDayDisplay(day);
  const countingDown = dateCount.direction === "down";

  // TODO: Update localization key
  const dateString = t("screens:home.listItemDate", {
    context: day.repeats ? "noYear" : undefined,
    date: dayjs(day.date),
  });

  const mainColor = countingDown ? colors.primary : colors.tertiary;
  const mainColorText = countingDown ? colors.onPrimary : colors.onTertiary;
  const mainColorContainer = countingDown ? colors.primaryContainer : colors.tertiaryContainer;

  const stats: CountStat[] = [
    {
      number: dateCount.stats.days,
      unit: "day",
      unitLabel: t("common:timeUnits.days", { count: dateCount.stats.days }),
    },
    {
      number: dateCount.stats.months,
      unit: "month",
      unitLabel: t("common:timeUnits.months", { count: dateCount.stats.months }),
    },
    {
      number: dateCount.stats.weeks,
      unit: "week",
      unitLabel: t("common:timeUnits.weeks", { count: dateCount.stats.weeks }),
    },
    {
      number: dateCount.stats.years,
      unit: "year",
      unitLabel: t("common:timeUnits.years", { count: dateCount.stats.years }),
    },
  ];

  const dayIconStyle: StyleProp<ViewStyle> = day.icon
    ? {
        backgroundColor: mainColorContainer,
      }
    : {
        backgroundColor: "transparent",
        borderWidth: 4,
        borderColor: mainColorContainer,
      };

  return (
    <Page invertStatusBar style={{ backgroundColor: mainColor }}>
      <AppBar
        backColor={mainColorText}
        background={mainColor}
        titleStyle={{ color: mainColorText, opacity: 0.75 }}
      >
        <AppBar.Action color={mainColorText} icon="pencil" onPress={() => {}} />
        <AppBar.Action color={mainColorText} icon="dots-vertical" onPress={() => {}} />
      </AppBar>

      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        <View style={styles.dayDetails}>
          <View style={styles.dayIcons}>
            <Avatar.Icon
              color={day.icon ? mainColor : mainColorContainer}
              icon={day.icon ?? "plus"}
              size={60}
              style={dayIconStyle}
            />
            {dateCount.today && <Icon color={colors.warning} name="alert-decagram" size={48} />}
          </View>
          <Text style={[styles.dayDetailsTitle, { color: mainColorText }]} variant="headlineLarge">
            {day.title}
          </Text>
          <View style={styles.dayDetailsDateRow}>
            <Text style={[styles.dayDetailsDate, { color: mainColorText }]} variant="bodyLarge">
              {dateString}
            </Text>
            {day.repeats && (
              <Icon
                color={mainColorText}
                name="update"
                size={22}
                style={styles.dayDetailsRepeats}
              />
            )}
          </View>
          <View style={styles.dayCounts}>
            {stats.map((stat, idx) => {
              const isDisplayUnit = stat.unit === day.unit;
              const displayNumber = Math.abs(stat.number).toFixed(stat.unit === "day" ? 0 : 2);
              const textColor = isDisplayUnit ? mainColorText : mainColorContainer;

              return (
                <View
                  key={stat.unit}
                  style={[styles.dayCount, idx > 0 ? { marginTop: pagePadding / 1.5 } : undefined]}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={[
                        styles.dayCountNumber,
                        {
                          color: textColor,
                          fontWeight: isDisplayUnit ? "bold" : undefined,
                        },
                      ]}
                      variant={isDisplayUnit ? "displayLarge" : "displayMedium"}
                    >
                      {displayNumber}
                    </Text>
                    {isDisplayUnit && !dateCount.today && (
                      <Icon
                        color={mainColorContainer}
                        name={countingDown ? "arrow-down" : "arrow-up"}
                        size={40}
                        style={{ marginLeft: 8, marginTop: -6 }}
                      />
                    )}
                  </View>
                  <Text style={[styles.dayCountUnit, { color: textColor }]} variant="bodyLarge">
                    {stat.unitLabel}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </Page>
  );
};

const pagePadding = 32;
const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
  },
  pageScroll: {
    flex: 1,
  },
  dayDetails: {
    paddingHorizontal: pagePadding,
  },
  dayDetailsTitle: {
    marginTop: 32,
    fontWeight: "bold",
  },
  dayDetailsDateRow: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.75,
  },
  dayDetailsDate: {
    marginTop: 4,
  },
  dayDetailsRepeats: {
    marginTop: 4,
    marginLeft: 8,
  },
  dayIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayCounts: {
    marginVertical: pagePadding,
  },
  dayCount: {},
  dayCountNumber: {
    // TODO: Determine if a monospace font looks best
    // fontFamily: Platform.OS === "android" ? "monospace" : undefined,
    // fontVariant: ["tabular-nums"],
  },
  dayCountUnit: {
    marginTop: -4,
  },
});

export default DetailScreen;
