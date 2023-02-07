import React from "react";
import { List, Switch } from "react-native-paper";

import { type IAppBehaviours } from "@typings/settings.types";

type BehavioursScreenListItemSwitchProps = {
  /** Switch description */
  description?: string;
  /** Behaviour state key */
  stateKey: keyof IAppBehaviours;
  /** Switch title */
  title: string;
  /** Switch value */
  value: boolean;
  /** Change handler */
  onChange: (behaviourKey: keyof IAppBehaviours, value: boolean) => void;
};

const BehavioursScreenListItemSwitch = (props: BehavioursScreenListItemSwitchProps) => {
  const { description, stateKey, title, value, onChange } = props;

  return (
    <List.Item
      description={description}
      right={() => (
        <Switch value={value} onValueChange={(val: boolean): void => onChange(stateKey, val)} />
      )}
      title={title}
    />
  );
};

export default BehavioursScreenListItemSwitch;
