import React, { type ComponentPropsWithoutRef, Fragment } from "react";
import { type Control, useController } from "react-hook-form";
import { Checkbox as RNPCheckbox } from "react-native-paper";

import { type Optional } from "@typings/app.types";

import InputHelperText from "./InputHelperText";

type CheckboxProps = {
  /** Control from 'react-hook-form' */
  control: Control<any>;
  hideHint?: boolean;
  /** Hint text */
  hint?: string;
  /** Form control name */
  name: string;
} & Optional<ComponentPropsWithoutRef<typeof RNPCheckbox.Item>, "status">;

const Checkbox = (props: CheckboxProps) => {
  const { control, hint, hideHint, name, position = "trailing", ...rest } = props;

  const { field, fieldState, formState } = useController({
    control,
    name,
  });
  const { error, isTouched } = fieldState;
  const { isSubmitted } = formState;

  // Show errors when field has been touched or submitted (apparently does not touch fields...)
  const errorShown = Boolean(error?.message) && (isTouched || isSubmitted);
  // Numbers must be cast to strings (type warnings)
  const fieldValue = field.value ? `${field.value}` : field.value;

  const checkboxStatus: ComponentPropsWithoutRef<typeof RNPCheckbox.Item>["status"] = fieldValue
    ? "checked"
    : "unchecked";

  return (
    <Fragment>
      <RNPCheckbox.Item
        {...rest}
        // TODO: Change color based on error?
        mode="android"
        position={position}
        status={checkboxStatus}
        onPress={() => field.onChange(!fieldValue)}
      />
      {!hideHint && (
        <InputHelperText error={error?.message} hint={hint} visible={Boolean(errorShown || hint)} />
      )}
    </Fragment>
  );
};

export default Checkbox;
