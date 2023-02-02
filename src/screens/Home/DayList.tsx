import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

import { DayListItem } from "@components/days";
import { Alert } from "@components/typography";
import { useAppSelector, useSnackbar } from "@hooks";
import { selectDays } from "@store/slices/days";

const DayList = (): ReactElement | null => {
  const { notifyError } = useSnackbar();
  const days = useAppSelector(selectDays);
  const { t } = useTranslation(["common", "screens"]);

  // TODO: Support reordering via long-press on item
  // Source: https://blog.logrocket.com/react-native-draggable-flatlist/

  return (
    <View style={styles.list}>
      <FlatList
        data={days}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Alert>{t("common:errors.noDays")}</Alert>}
        renderItem={({ item }) => <DayListItem day={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 24,
  },
});

export default DayList;
