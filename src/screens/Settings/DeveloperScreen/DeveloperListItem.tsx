import React from "react";
import { StyleSheet } from "react-native";
import { List, Text } from "react-native-paper";

type DeveloperListItemProps = {
  /** Item title */
  title: string;
  /** Item value */
  value: string;
};

const DeveloperListItem = (props: DeveloperListItemProps) => {
  const { title, value } = props;

  return (
    <List.Item
      right={(rightProps: any) => <Text {...rightProps}>{value}</Text>}
      style={styles.listItem}
      title={title}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 4,
  },
});

export default DeveloperListItem;
