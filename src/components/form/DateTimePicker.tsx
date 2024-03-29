import dayjs from "dayjs";
import React, { type ComponentPropsWithoutRef, Fragment, useState } from "react";
import { useController } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput as RNPTextInput } from "react-native-paper";

import { DATE_FORMAT_ISO_SHORT, formatDateString } from "@utilities/date.util";

import TextInput from "./TextInput";

type DatePickerInputProps = {
  /** Parent selection callback */
  onSelect?: (value: string) => void;
} & ComponentPropsWithoutRef<typeof TextInput>;

const DatePickerInput = (props: DatePickerInputProps) => {
  const { control, name, onSelect, ...rest } = props;

  const [open, setOpen] = useState(false);

  const { field } = useController({
    control,
    name,
  });
  const { t } = useTranslation(["common", "screens"]);

  const valueDate = field.value ? dayjs(field.value).toDate() : new Date();

  /**
   * Custom change handler to convert from date to string
   *
   * @param date - Selected date
   */
  const onChange = (date?: Date) => {
    if (!date) {
      setOpen(false);
      return;
    }

    const dateString = date ? formatDateString(date.toISOString(), DATE_FORMAT_ISO_SHORT) : "";

    setOpen(false);

    field.onChange(dateString);
    onSelect && onSelect(dateString);
  };

  return (
    <Fragment>
      <TextInput
        {...rest}
        control={control}
        name={name}
        readonly
        right={<RNPTextInput.Icon icon="calendar" onPress={() => setOpen(true)} />}
        // Prevent text input (no input mask)
        onChange={() => {}}
        // NOTE: On iOS the input field apparently gets focused immediately again
        //         after focusing on the next field (unknown reason)...
        onFocus={() => setOpen(true)}
      />
      <DateTimePickerModal
        cancelTextIOS={t("common:choices.cancel")} // iOS only
        confirmTextIOS={t("common:choices.confirm")} // iOS only
        date={valueDate}
        display={Platform.OS === "ios" ? "inline" : "default"}
        isVisible={open}
        mode="date"
        onCancel={onChange}
        onConfirm={onChange}
      />
    </Fragment>
  );
};

DatePickerInput.Affix = RNPTextInput.Affix;
DatePickerInput.Icon = RNPTextInput.Icon;

export default DatePickerInput;
