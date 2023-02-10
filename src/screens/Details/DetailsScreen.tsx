import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Share, StyleSheet, View } from "react-native";
import { Menu, Text } from "react-native-paper";

import { type BottomSheetRef, DeleteDayDialog, ManageDaySheet } from "@components/dialogs";
import { DayIcon } from "@components/icons";
import { AppBar, Page } from "@components/layout";
import { type AppBarMenuRef } from "@components/layout/AppBarMenu";
import {
  useAppSelector,
  useAppTheme,
  useDayActions,
  useDayDeleteDialog,
  useSnackbar,
} from "@hooks";
import { selectDay } from "@store/slices/days";
import { type DayUnit } from "@typings/day.types";
import { getDayDisplay } from "@utilities/day.util";
import { type RootRouterParams } from "src/AppRouter";

import DayStat from "./DayStat";

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
  const { notifyError } = useSnackbar();

  const { colors } = useAppTheme();

  const selectedDay = useAppSelector((s) => selectDay(s, route.params.dayId));

  const menuActionRef = useRef<AppBarMenuRef>(null);
  const manageDayRef = useRef<BottomSheetRef>(null);

  const { onDayDelete, onDayEdit, onDayShare } = useDayActions({
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
    menuActionRef.current?.close();
    if (!selectedDay) return;

    manageDayRef.current?.open();
  };

  const onEditCancel = () => {
    manageDayRef.current?.close();
  };

  const onSharePress = () => {
    menuActionRef.current?.close();
    if (!selectedDay) return;

    onDayShare(selectedDay);
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

  return (
    <Page invertStatusBar style={{ backgroundColor: mainColor }}>
      <AppBar
        backColor={mainColorText}
        background={mainColor}
        titleStyle={{ color: mainColorText, opacity: 0.75 }}
      >
        <AppBar.Action color={mainColorText} icon="share" onPress={onSharePress} />
        <AppBar.ActionMenu ref={menuActionRef}>
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
        </AppBar.ActionMenu>
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
          {dateCount.today && <Icon color={colors.warning} name="alert-decagram" size={48} />}
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
          {stats.map((stat, idx) => (
            <DayStat
              key={stat.unit}
              colorHighlight={mainColorText}
              colorNormal={mainColorContainer}
              number={stat.number}
              unitLabel={stat.unitLabel}
              decimals={stat.unit === "day" ? 0 : 2}
              highlighted={stat.unit === selectedDay.unit}
              today={dateCount.today}
              style={idx > 0 ? { marginTop: pagePadding / 1.5 } : undefined}
            />
          ))}
        </View>
      </ScrollView>

      <ManageDaySheet
        ref={manageDayRef}
        day={selectedDay}
        onCancel={onEditCancel}
        onEdit={onDayEdit}
      />
      <DeleteDayDialog
        day={deletedDay}
        visible={!!deletedDay}
        onCancel={onDeleteCancel}
        onConfirm={onDeleteConfirm}
      />
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
