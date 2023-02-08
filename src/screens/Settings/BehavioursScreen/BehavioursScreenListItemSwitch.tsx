import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { List, Switch } from "react-native-paper";

import { IAppBehaviours } from "@typings/settings.types";

type BehavioursScreenListItemSwitchProps = {
  /** Switch description */
  description?: string;
  disabled?: boolean;
  /** Behaviour state key */
  stateKey: keyof IAppBehaviours;
  /** Switch title */
  title: string;
  /** Switch value */
  value: boolean;
  /** Change handler */
  onChange: (behaviourKey: keyof IAppBehaviours, value: boolean) => void;
};

const BehavioursScreenListItemSwitch = (
  props: BehavioursScreenListItemSwitchProps,
): ReactElement => {
  const { description, disabled, stateKey, title, value, onChange } = props;

  return (
    <List.Item
      description={description}
      disabled={disabled}
      right={(): ReactElement => (
        <Switch
          disabled={disabled}
          style={styles.itemSwitch}
          value={value}
          onValueChange={(val: boolean): void => onChange(stateKey, val)}
        />
      )}
      title={title}
    />
  );
};

const styles = StyleSheet.create({
  itemSwitch: {
    marginLeft: 4,
  },
});

export default BehavioursScreenListItemSwitch;
