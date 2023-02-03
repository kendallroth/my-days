import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Vibration, View } from "react-native";
import { Text } from "react-native-paper";

import { BottomSheetRef, DeleteDayDialog, ManageDaySheet } from "@components/dialogs";
import { AppBar, Page, ScreenFAB } from "@components/layout";
import { useAppDispatch, useAppSelector, useAppTheme, useScrollingFab, useSnackbar } from "@hooks";
import { addDay, moveDay, removeDay, selectDays, updateDay } from "@store/slices/days";

import DayList from "./DayList";
import SelectedDayModal from "./SelectedDayModal";

import type { UpDown } from "@typings/app.types";
import type { Day, DayNew } from "@typings/day.types";
import type { RootRouterNavigation } from "src/AppRouter";

const HomeScreen = (): ReactElement | null => {
  const navigation = useNavigation<RootRouterNavigation>();

  const { t } = useTranslation(["common", "screens"]);
  const { notify } = useSnackbar();

  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();

  const days = useAppSelector(selectDays);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const selectedDayPosition = selectedDay
    ? { count: days.length, position: days.findIndex((d) => d.id === selectedDay.id) + 1 }
    : null;
  const dayOptionsRef = useRef<BottomSheetRef>(null);

  // FAB should disappear when scrolling down and reappear when scrolling back up
  const { fabVisible, toggleFab, onListScroll } = useScrollingFab();

  const manageDayRef = useRef<BottomSheetRef>(null);
  const [editedDay, setEditedDay] = useState<Day | null>(null);

  const [deletedDay, setDeletedDay] = useState<Day | null>(null);

  const today = dayjs();
  const dateDisplay = {
    date: today.format("MMMM DD, YYYY"),
    weekDay: today.format("dddd"),
  };

  /** Open selected day options menu */
  const onDaySelect = (day: Day) => {
    setSelectedDay(day);
    setDeletedDay(null);
    setEditedDay(null);
    Vibration.vibrate(100);
    dayOptionsRef.current?.open();
  };

  /** Close selected day options menu */
  const onDaySelectCancel = () => {
    if (!selectedDay) return;

    setSelectedDay(null);
  };

  /** Prepare deletion confirmation dialog (in response to selection menu choice) */
  const onDayDeletePress = () => {
    dayOptionsRef.current?.close(() => {
      // NOTE: Ensure previous modal has finished closing before displaying another
      if (!selectedDay) return;
      setDeletedDay(selectedDay);
    });

    if (!selectedDay) return;
    setSelectedDay(null);
  };

  const onDayDeleteCancel = () => {
    setDeletedDay(null);
  };

  const onDayDeleteConfirm = () => {
    if (!deletedDay) return;

    const deletedDayTitle = deletedDay.title;
    setDeletedDay(null);
    dispatch(removeDay(deletedDay.id));

    // Ensure FAB can be seen (if deleting last scrollable item when FAB was hidden)
    setTimeout(() => {
      toggleFab(true);
    }, 250);

    notify(
      t("screens:dayDelete.deleteSuccess", {
        title: deletedDayTitle,
      }),
    );
  };

  /** Cleanup day add/edit dialog */
  const onDayManageCancel = () => {
    manageDayRef.current?.close();
    setEditedDay(null);
  };

  const onDayAdd = (day: DayNew) => {
    dispatch(addDay(day));

    manageDayRef.current?.close();
    notify(t("screens:dayAddEdit.dayAddSuccess", { title: day.title }));
  };

  /** Prepare edit dialog (in response to selection menu choice) */
  const onDayEditPress = () => {
    dayOptionsRef.current?.close(() => {
      // NOTE: Ensure previous modal has finished closing before displaying another
      if (!selectedDay) return;
      manageDayRef.current?.open();
    });

    if (!selectedDay) return;
    setEditedDay(selectedDay);
    setSelectedDay(null);
  };

  const onDayEdit = (day: Day) => {
    dispatch(updateDay(day));

    manageDayRef.current?.close();
    setEditedDay(null);
    notify(t("screens:dayAddEdit.dayEditSuccess", { title: day.title }));
  };

  const onDayMove = (direction: UpDown) => {
    if (!selectedDay) return;

    dispatch(moveDay({ id: selectedDay.id, direction }));
  };

  return (
    <Page invertStatusBar>
      <AppBar back={false} background={colors.primary} logo>
        <AppBar.Action
          color={colors.onPrimary}
          icon="help-circle"
          onPress={() => navigation.navigate("SettingsRouter", { screen: "About" })}
        />
        <AppBar.Action
          color={colors.onPrimary}
          icon="cog"
          onPress={() => navigation.navigate("SettingsRouter")}
        />
      </AppBar>
      <View style={[styles.pageHeader, { backgroundColor: colors.primary }]}>
        <Text style={[styles.pageHeaderDay, { color: colors.onPrimary }]}>
          {dateDisplay.weekDay}
        </Text>
        <Text style={[styles.pageHeaderDate, { color: colors.onPrimary }]}>{dateDisplay.date}</Text>
      </View>
      <View style={styles.pageContent}>
        <DayList days={days} onItemLongPress={onDaySelect} onScroll={onListScroll} />
      </View>
      <ScreenFAB
        icon="calendar-plus"
        visible={fabVisible}
        onPress={() => manageDayRef.current?.open()}
      />
      <ManageDaySheet
        ref={manageDayRef}
        day={editedDay}
        onCancel={onDayManageCancel}
        onAdd={onDayAdd}
        onEdit={onDayEdit}
      />
      <DeleteDayDialog
        day={deletedDay}
        visible={!!deletedDay}
        onCancel={onDayDeleteCancel}
        onConfirm={onDayDeleteConfirm}
      />
      <SelectedDayModal
        ref={dayOptionsRef}
        day={selectedDay}
        dayPosition={selectedDayPosition}
        onClose={onDaySelectCancel}
        onEdit={onDayEditPress}
        onDelete={onDayDeletePress}
        onMove={onDayMove}
      />
    </Page>
  );
};

const pagePadding = 24;
const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
  },
  pageHeader: {
    padding: pagePadding,
    paddingTop: 0,
  },
  pageHeaderDate: {
    fontSize: 24,
  },
  pageHeaderDay: {
    marginBottom: 4,
    fontSize: 32,
    fontWeight: "700",
  },
});

export default HomeScreen;
