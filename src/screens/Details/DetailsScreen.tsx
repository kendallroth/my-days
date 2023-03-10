import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Menu, Text } from "react-native-paper";

import { type BottomSheetRef, DeleteDayDialog } from "@components/dialogs";
import { DayIcon } from "@components/icons";
import { AppBar, Page, Stack } from "@components/layout";
import { type AppBarMenuRef } from "@components/layout/AppBarMenu";
import {
  useAppDispatch,
  useAppSelector,
  useAppTheme,
  useDayActions,
  useDayDeleteDialog,
  useSnackbar,
} from "@hooks";
import { selectDay, setStartOpenDay } from "@store/slices/days";
import { type DayUnit } from "@typings/day.types";
import { getDayDisplay } from "@utilities/day.util";
import { type RootRouterParams } from "src/AppRouter";

import DayStat from "./DayStat";
import SwapDetailsTheme from "./SwapDetailsTheme";

type DetailsScreenRouteProps = NativeStackScreenProps<RootRouterParams, "DetailsScreen">;

interface CountStat {
  number: number;
  unit: DayUnit;
  unitLabel: string;
}

const DetailScreen = () => {
  const route = useRoute<DetailsScreenRouteProps["route"]>();
  const navigation = useNavigation<DetailsScreenRouteProps["navigation"]>();

  const { t } = useTranslation(["common", "screens"]);
  const dispatch = useAppDispatch();
  const { notifyError } = useSnackbar();

  const { colors } = useAppTheme();

  const selectedDay = useAppSelector((s) => selectDay(s, route.params.dayId));
  const dayStartsOpen = selectedDay?.startOpen ?? false;

  const menuActionRef = useRef<AppBarMenuRef>(null);
  const manageDayRef = useRef<BottomSheetRef>(null);

  const { onDayDelete, onDayShare } = useDayActions({
    onDayEditCallback: () => {
      manageDayRef.current?.close();
    },
    onDayDeleteCallback: () => {},
    onDayShareCallback: async (day, message) => {
      await Share.share({
        message,
      });
    },
  });

  /** Prepare deletion confirmation dialog (in response to selection menu choice) */
  const onDeletePress = () => {
    menuActionRef.current?.close();
    if (!selectedDay) return;

    setDeletedDay(selectedDay);
  };

  /** Prepare edit dialog (in response to selection menu choice) */
  const onEditPress = () => {
    // NOTE: May be smoother (but slower) to wait until menu has closed to trigger the navigation???
    menuActionRef.current?.close();
    if (!selectedDay) return;

    navigation.push("DayFormScreen", { day: selectedDay });
  };

  const onSharePress = () => {
    menuActionRef.current?.close();
    if (!selectedDay) return;

    onDayShare(selectedDay);
  };

  const onStartOpenPress = () => {
    menuActionRef.current?.close();
    if (!selectedDay) return;

    dispatch(setStartOpenDay(dayStartsOpen ? null : selectedDay.id));
  };

  const { deletedDay, setDeletedDay, onDeleteCancel, onDeleteConfirm } = useDayDeleteDialog({
    onConfirm: (day) => {
      navigation.navigate("HomeScreen");

      setTimeout(() => {
        onDayDelete(day);
      }, 100);
    },
  });

  // NOTE: Must come after all hooks (as it ends render abruptly)
  if (!selectedDay) {
    notifyError("Invalid day selected");
    navigation.navigate("HomeScreen");
    return null;
  }

  const dateCount = getDayDisplay(selectedDay);
  const countingDown = dateCount.direction === "down";

  const dateString = t("screens:dayDetails.dayDate", {
    context: selectedDay.repeats ? "noYear" : undefined,
    date: dayjs(selectedDay.date),
  });

  const mainColor = countingDown ? colors.primary : colors.tertiary;
  const mainColorText = countingDown ? colors.onPrimary : colors.onTertiary;
  const mainColorContainer = countingDown ? colors.primaryContainer : colors.tertiaryContainer;

  const stats: CountStat[] = [
    {
      number: dateCount.stats.days,
      unit: "day",
      unitLabel: t("common:timeUnits.day", { count: dateCount.stats.days }),
    },
    {
      number: dateCount.stats.weeks,
      unit: "week",
      unitLabel: t("common:timeUnits.week", { count: dateCount.stats.weeks }),
    },
    {
      number: dateCount.stats.months,
      unit: "month",
      unitLabel: t("common:timeUnits.month", { count: dateCount.stats.months }),
    },
    {
      number: dateCount.stats.years,
      unit: "year",
      unitLabel: t("common:timeUnits.year", { count: dateCount.stats.years }),
    },
  ];

  return (
    <Page invertStatusBar style={{ backgroundColor: mainColor }}>
      <AppBar
        backColor={mainColorText}
        background={mainColor}
        titleStyle={{ color: mainColorText, opacity: 0.75 }}
      >
        <AppBar.Action color={mainColorText} icon="share" onPress={onSharePress} />
        <SwapDetailsTheme>
          <AppBar.ActionMenu ref={menuActionRef} anchorColor={colors.inverseOnSurface}>
            <Menu.Item
              leadingIcon="pencil"
              title={t("screens:dayDetails.menuEdit")}
              onPress={onEditPress}
            />
            <Menu.Item
              leadingIcon="delete"
              title={t("screens:dayDetails.menuDelete")}
              onPress={onDeletePress}
            />
            <Menu.Item
              leadingIcon="open-in-new"
              title={t("screens:dayDetails.menuStartOpen")}
              titleStyle={{ marginRight: 8 }}
              trailingIcon={selectedDay.startOpen ? "check-circle" : "blank"}
              onPress={onStartOpenPress}
            />
          </AppBar.ActionMenu>
        </SwapDetailsTheme>
      </AppBar>

      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        <View style={styles.dayHeaderIcons}>
          <DayIcon
            backgroundColor={mainColorContainer}
            borderWidth={3}
            icon={selectedDay.icon}
            iconColor={mainColor}
            size={60}
          />
          <Stack alignItems="center" direction="row" spacing={2}>
            {dayStartsOpen && (
              <Icon
                color={mainColorContainer}
                name="open-in-new"
                size={32}
                style={{ opacity: 0.8 }}
              />
            )}
            {dateCount.today && <Icon color={colors.warning} name="alert-decagram" size={48} />}
          </Stack>
        </View>
        <Text style={[styles.dayHeaderTitle, { color: mainColorText }]} variant="headlineLarge">
          {selectedDay.title}
        </Text>
        <View style={styles.dayHeaderDateRow}>
          <Text style={[styles.dayHeaderDate, { color: mainColorText }]} variant="bodyLarge">
            {dateString}
          </Text>
          {selectedDay.repeats && (
            <Icon color={mainColorText} name="update" size={22} style={styles.dayHeaderRepeats} />
          )}
        </View>

        <View style={styles.dayStats}>
          {stats.map((stat, idx) => {
            const decimals = stat.unit === "day" ? 0 : 2;

            return (
              <DayStat
                key={stat.unit}
                colorHighlight={mainColorText}
                colorNormal={mainColorContainer}
                number={t("common:numbers", {
                  value: stat.number,
                  signDisplay: "never",
                  maximumFractionDigits: decimals,
                  minimumFractionDigits: decimals,
                })}
                unitLabel={stat.unitLabel}
                highlighted={stat.unit === selectedDay.unit}
                today={dateCount.today}
                style={idx > 0 ? { marginTop: pagePadding / 1.5 } : undefined}
              />
            );
          })}
        </View>
      </ScrollView>

      <SwapDetailsTheme>
        <DeleteDayDialog
          day={deletedDay}
          visible={!!deletedDay}
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
        />
      </SwapDetailsTheme>
    </Page>
  );
};

const pagePadding = 32;
const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
  },
  pageScroll: {
    paddingHorizontal: pagePadding,
    flex: 1,
  },
  dayHeaderDateRow: {
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.75,
  },
  dayHeaderDate: {
    marginTop: 4,
  },
  dayHeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayHeaderRepeats: {
    marginTop: 4,
    marginLeft: 8,
  },
  dayHeaderTitle: {
    marginTop: 32,
    fontWeight: "bold",
  },
  dayStats: {
    marginVertical: pagePadding,
  },
});

export default DetailScreen;
