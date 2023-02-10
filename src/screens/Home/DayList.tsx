import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { DayListItem } from "@components/days";
import { EmptyMessage } from "@components/layout";
import { Alert } from "@components/typography";
import { type ScrollEvent } from "@typings/app.types";
import { type Day } from "@typings/day.types";

interface DayListProps {
  days: Day[];
  style?: StyleProp<ViewStyle>;
  onItemPress?: (day: Day) => void;
  onItemLongPress?: (day: Day) => void;
  onScroll?: (event: ScrollEvent) => void;
}

const DayList = (props: DayListProps) => {
  const { days, style, onItemPress, onItemLongPress, onScroll } = props;

  const { t } = useTranslation(["common", "screens"]);

  // TODO: Support reordering via long-press on item
  // Source: https://blog.logrocket.com/react-native-draggable-flatlist/

  if (!days.length) {
    return <EmptyMessage text={t("common:errors.noDays")} />;
  }

  return (
    <FlatList
      contentContainerStyle={[styles.list, style]}
      data={days}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Alert>{t("common:errors.noDays")}</Alert>}
      renderItem={({ item }) => (
        <DayListItem day={item} onPress={onItemPress} onLongPress={onItemLongPress} />
      )}
      onScroll={onScroll}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 24,
  },
});

export default DayList;
