import React, { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

import { DayListItem } from "@components/days";
import { EmptyMessage } from "@components/layout";
import { Alert } from "@components/typography";
import { Day } from "@typings/day.types";

interface DayListProps {
  days: Day[];
  onItemLongPress?: (day: Day) => void;
}

const DayList = (props: DayListProps): ReactElement | null => {
  const { days, onItemLongPress } = props;

  const { t } = useTranslation(["common", "screens"]);

  // TODO: Support reordering via long-press on item
  // Source: https://blog.logrocket.com/react-native-draggable-flatlist/

  if (!days.length) {
    return <EmptyMessage text={t("common:errors.noDays")} />;
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={days}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Alert>{t("common:errors.noDays")}</Alert>}
      renderItem={({ item }) => <DayListItem day={item} onLongPress={onItemLongPress} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 24,
  },
});

export default DayList;
