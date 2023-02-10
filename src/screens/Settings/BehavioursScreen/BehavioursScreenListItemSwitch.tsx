import React from "react";
import { StyleSheet } from "react-native";
import { List, Switch } from "react-native-paper";

import { type AppBehaviours } from "@typings/settings.types";

type BehavioursScreenListItemSwitchProps = {
  /** Switch description */
  description?: string;
  disabled?: boolean;
  /** Behaviour state key */
  stateKey: keyof AppBehaviours;
  /** Switch title */
  title: string;
  /** Switch value */
  value: boolean;
  /** Change handler */
  onChange: (behaviourKey: keyof AppBehaviours, value: boolean) => void;
};

const BehavioursScreenListItemSwitch = (props: BehavioursScreenListItemSwitchProps) => {
  const { description, disabled, stateKey, title, value, onChange } = props;

  return (
    <List.Item
      description={description}
      disabled={disabled}
      right={() => (
        <Switch
          disabled={disabled}
          style={styles.itemSwitch}
          value={value}
          onValueChange={(val: boolean) => onChange(stateKey, val)}
        />
      )}
      title={title}
    />
  );
};

const styles = StyleSheet.create({
  itemSwitch: {
    alignSelf: "center",
    marginLeft: 4,
  },
});

export default BehavioursScreenListItemSwitch;
