import { useNavigation, useRoute } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import dayjs from "dayjs";
import * as Linking from "expo-linking";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, Vibration, View } from "react-native";
import { Text } from "react-native-paper";

import {
  AddSharedDayDialog,
  type BottomSheetRef,
  DeleteDayDialog,
  ManageDaySheet,
} from "@components/dialogs";
import { AppBar, Page, ScreenFAB } from "@components/layout";
import { useAppDispatch, useAppSelector, useAppTheme, useScrollingFab, useSnackbar } from "@hooks";
import { addDay, moveDay, removeDay, selectDays, updateDay } from "@store/slices/days";
import { selectBehaviours } from "@store/slices/settings";
import { type UpDown } from "@typings/app.types";
import { type Day, type DayNew } from "@typings/day.types";
import { SHARED_DAY_VERSION } from "@utilities/day-parse.util";
import { type RootRouterParams } from "src/AppRouter";

import DayList from "./DayList";
import SelectedDayModal from "./SelectedDayModal";

type HomeScreenRouteProps = NativeStackScreenProps<RootRouterParams, "HomeScreen">;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenRouteProps["navigation"]>();
  const route = useRoute<HomeScreenRouteProps["route"]>();

  const { t } = useTranslation(["common", "screens"]);
  const { notify } = useSnackbar();

  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();

  const days = useAppSelector(selectDays);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const selectedDayPosition = selectedDay
    ? { count: days.length, position: days.findIndex((d) => d.id === selectedDay.id) + 1 }
    : null;
  const selectedDayRef = useRef<BottomSheetRef>(null);

  // FAB should disappear when scrolling down and reappear when scrolling back up
  const { fabVisible, toggleFab, onListScroll } = useScrollingFab();

  const manageDayRef = useRef<BottomSheetRef>(null);
  const [editedDay, setEditedDay] = useState<Day | null>(null);

  const [deletedDay, setDeletedDay] = useState<Day | null>(null);

  const today = dayjs();

  const appBehaviours = useAppSelector(selectBehaviours);
  const [sharedDay, setSharedDay] = useState<Day | null>(null);

  const onSharedDayConfirm = useCallback(
    (day: Day) => {
      dispatch(addDay(day));
      notify(t("screens:daySharedLink.dayAddSuccess", { title: day.title }));
      setSharedDay(null);
    },
    [dispatch, notify, t],
  );

  useEffect(() => {
    const day = route.params?.sharedDay;
    if (!day) return;

    if (!appBehaviours.confirmSharedDays) {
      onSharedDayConfirm(day);
    } else {
      // Must wait briefly for navigation to occur before displaying dialog
      setTimeout(() => {
        setSharedDay(day);
      }, 100);
    }

    // Avoid re-handling shared day again on route re-render (if param is kept)!
    navigation.setParams({ sharedDay: undefined });
  }, [appBehaviours, navigation, route.params, onSharedDayConfirm]);

  /** Open selected day options menu */
  const onDaySelect = (day: Day) => {
    setSelectedDay(day);
    setDeletedDay(null);
    setEditedDay(null);
    Vibration.vibrate(100);
    selectedDayRef.current?.open();
  };

  /** Close selected day options menu */
  const onDaySelectCancel = () => {
    if (!selectedDay) return;

    setSelectedDay(null);
  };

  /** Prepare deletion confirmation dialog (in response to selection menu choice) */
  const onDayDeletePress = () => {
    // NOTE: Ensure previous modal has finished closing before displaying another
    selectedDayRef.current?.close(() => {
      if (!selectedDay) return;

      setDeletedDay(selectedDay);
      setSelectedDay(null);
    });
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

  const onDayManageAdd = (day: DayNew) => {
    dispatch(addDay(day));

    manageDayRef.current?.close();
    notify(t("screens:dayAddEdit.dayAddSuccess", { title: day.title }));
  };

  /** Cleanup day add/edit dialog */
  const onDayManageCancel = () => {
    manageDayRef.current?.close();
    setEditedDay(null);
  };

  /** Prepare edit dialog (in response to selection menu choice) */
  const onDayEditPress = () => {
    // NOTE: Ensure previous modal has finished closing before displaying another
    selectedDayRef.current?.close(() => {
      if (!selectedDay) return;

      setEditedDay(selectedDay);
      setSelectedDay(null);

      manageDayRef.current?.open();
    });
  };

  const onDayManageEdit = (day: Day) => {
    dispatch(updateDay(day));

    manageDayRef.current?.close();
    setEditedDay(null);
    notify(t("screens:dayAddEdit.dayEditSuccess", { title: day.title }));
  };

  const onDayMove = (day: Day, direction: UpDown) => {
    dispatch(moveDay({ id: day.id, direction }));
  };

  const onDayShare = async (day: Day) => {
    const url = Linking.createURL("day/shared", {
      // Must use triple slashes to prevent splitting the above path into hostname and path
      // Source: https://github.com/expo/expo/issues/6497
      isTripleSlashed: true,
      queryParams: {
        date: day.date,
        icon: day.icon,
        id: day.id,
        repeats: day.repeats ? "true" : "false",
        title: day.title,
        version: `${SHARED_DAY_VERSION}`,
      },
    });

    const shareMessage = `A day has been shared with you from My Days! Follow this link to add '${day.title}' to the app!\n\n${url}`;

    // NOTE: Must either close selection dialog before sharing or not close it at all
    selectedDayRef.current?.close(async () => {
      await Share.share({
        // Decided to use message over link as it contains more description (and link is iOS-only)
        message: shareMessage,
      });
    });
  };

  return (
    <Page invertStatusBar>
      <AppBar
        back={false}
        background={colors.primary}
        contentStyle={styles.appBarContent}
        logo
        title={t("common:app.title")}
        titleStyle={{ color: colors.onPrimary, opacity: 0.75 }}
      >
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
        <Text style={[styles.pageHeaderDay, { color: colors.onPrimary }]} variant="headlineLarge">
          {t("screens:home.todayDay", { date: today })}
        </Text>
        <Text style={[{ color: colors.onPrimary }]} variant="headlineSmall">
          {t("screens:home.todayDate", { date: today })}
        </Text>
      </View>

      <View style={styles.pageContent}>
        <DayList days={days} onItemLongPress={onDaySelect} onScroll={onListScroll} />
      </View>
      <ScreenFAB
        icon="calendar-plus"
        visible={fabVisible}
        onPress={() => manageDayRef.current?.open()}
      />

      <AddSharedDayDialog
        day={sharedDay}
        visible={!!sharedDay}
        onCancel={() => setSharedDay(null)}
        onConfirm={() => onSharedDayConfirm(sharedDay!)}
      />
      <ManageDaySheet
        ref={manageDayRef}
        day={editedDay}
        onAdd={onDayManageAdd}
        onCancel={onDayManageCancel}
        onEdit={onDayManageEdit}
      />
      <DeleteDayDialog
        day={deletedDay}
        visible={!!deletedDay}
        onCancel={onDayDeleteCancel}
        onConfirm={onDayDeleteConfirm}
      />
      <SelectedDayModal
        ref={selectedDayRef}
        day={selectedDay}
        dayPosition={selectedDayPosition}
        onClose={onDaySelectCancel}
        onEdit={onDayEditPress}
        onDelete={onDayDeletePress}
        onMove={onDayMove}
        onShare={onDayShare}
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
  pageHeaderDay: {
    fontWeight: "700",
  },
  appBarContent: {
    alignItems: "flex-start",
    paddingLeft: 16,
  },
});

export default HomeScreen;
