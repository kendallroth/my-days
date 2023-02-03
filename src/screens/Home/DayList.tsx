import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, FAB } from "react-native-paper";

import { DayListItem } from "@components/days";
import { EmptyMessage } from "@components/layout";
import { Alert } from "@components/typography";
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";

const DayList = (): ReactElement | null => {
  const { notifyNotImplemented } = useSnackbar();
  const days = useAppSelector(selectDays);
  const { t } = useTranslation(["common", "screens"]);

  // TODO: Support reordering via long-press on item
  // Source: https://blog.logrocket.com/react-native-draggable-flatlist/

  if (!days.length) {
    return (
      <EmptyMessage
        action={() => (
          <Button
            icon="calendar-plus"
            mode="outlined"
            style={{ marginTop: 16 }}
            onPress={notifyNotImplemented}
          >
            Add Day
          </Button>
        )}
        text={t("common:errors.noDays")}
      />
    );
  }

  return (
    <View style={styles.list}>
      <FlatList
        data={days}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Alert>{t("common:errors.noDays")}</Alert>}
        renderItem={({ item }) => <DayListItem day={item} />}
      />
      <FAB icon="calendar-plus" style={styles.listAddFab} onPress={notifyNotImplemented} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    position: "relative",
    flex: 1,
    padding: 24,
  },
  listAddFab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});

export default DayList;
