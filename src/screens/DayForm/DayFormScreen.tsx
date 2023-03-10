import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import { useController, useForm } from "react-hook-form";
import { type TFunction, useTranslation } from "react-i18next";
import { type TextInput as RNPTextInput, ScrollView, StyleSheet } from "react-native";
import { Button, IconButton, SegmentedButtons } from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { type BottomSheetRef, IconSelectSheet } from "@components/dialogs";
import { Checkbox, DateTimeInput, TextInput } from "@components/form";
import { DayIcon } from "@components/icons";
import { AppBar, Page, Stack } from "@components/layout";
import { useAppTheme, useDayActions, useMounted } from "@hooks";
import { type MaterialCommunityIcons } from "@typings/app.types";
import { type DayUnit } from "@typings/day.types";
import { type RootRouterParams } from "src/AppRouter";

type DayFormScreenRouteProps = NativeStackScreenProps<RootRouterParams, "DayFormScreen">;

interface IFormData {
  date: string;
  icon: keyof MaterialCommunityIcons | null;
  title: string;
  repeats: boolean;
  unit: DayUnit;
}

const maxTitleLength = 40;

const getSchema = (t: TFunction<("common" | "screens")[], undefined>) => {
  return yup.object({
    date: yup
      .string()
      .label(t("screens:dayForm.dayDateLabel"))
      .required()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("screens:dayForm.dayDateFormatError")),
    title: yup
      .string()
      .label(t("screens:dayForm.dayTitleLabel"))
      .required()
      .min(2)
      .max(maxTitleLength),
  });
};

const DayFormScreen = () => {
  const route = useRoute<DayFormScreenRouteProps["route"]>();
  const navigation = useNavigation<DayFormScreenRouteProps["navigation"]>();

  const { day: editingDay } = route.params;
  const editing = !!editingDay;

  const { t } = useTranslation(["common", "screens"]);
  const { colors } = useAppTheme();

  const titleRef = useRef<RNPTextInput | null>(null);
  const dateRef = useRef<RNPTextInput | null>(null);

  const iconSheetRef = useRef<BottomSheetRef | null>(null);

  const form = useForm<IFormData>({
    defaultValues: {
      date: editingDay?.date ?? "",
      icon: editingDay?.icon ?? null,
      title: editingDay?.title ?? "",
      repeats: editingDay?.repeats ?? false,
      unit: editingDay?.unit ?? "day",
    },
    resolver: yupResolver(getSchema(t)),
  });

  const timeUnits: DayUnit[] = ["day", "week", "month", "year"];
  const timeUnitOptions: { label: string; value: DayUnit }[] = timeUnits.map((unit) => ({
    label: t(`common:timeUnits.${unit}`, { count: 2 }),
    labelStyle: {
      // Allow more space for longer labels
      marginHorizontal: -8,
    },
    value: unit,
  }));

  // NOTE: Need dynamic access to the selected icon for display purposes
  const {
    field: { value: iconValue },
  } = useController({
    control: form.control,
    name: "icon",
  });

  // NOTE: Need dynamic access to the selected unit
  const {
    field: { value: unitValue },
  } = useController({
    control: form.control,
    name: "unit",
  });

  useMounted(() => {
    // Only autofocus when adding a new day (uncertain what should have focus if editing)
    if (editing) return;

    // NOTE: Short timeout necessary to access ref and open keyboard!
    setTimeout(() => {
      titleRef.current?.focus();
    }, 250);
  });

  const onCancelPress = () => {
    navigation.goBack();
  };

  const onIconSelectOpen = () => {
    iconSheetRef.current?.open();
  };

  const onIconSelectChoose = (icon: keyof MaterialCommunityIcons) => {
    form.setValue("icon", iconValue !== icon ? icon : null);
    iconSheetRef.current?.close();
  };

  const onIconClear = () => {
    form.setValue("icon", null);
  };

  const { onDayAdd, onDayEdit } = useDayActions({
    onDayAddCallback: () => {
      navigation.goBack();
    },
    onDayEditCallback: () => {
      navigation.goBack();
    },
  });

  const onSubmitPress = (data: IFormData) => {
    // NOTE: Must use 'editingDay' rather than 'editing' due to TypeScript inference
    if (!editingDay) {
      onDayAdd({
        ...data,
        id: uuidv4(),
      });
    } else {
      onDayEdit({
        ...editingDay,
        ...data,
      });
    }
  };

  return (
    <Page invertStatusBar>
      <AppBar
        backColor={colors.onPrimary}
        background={colors.primary}
        title={editing ? t("screens:dayForm.titleEdit") : t("screens:dayForm.titleAdd")}
        titleStyle={{ color: colors.onPrimary }}
      />

      {/* TODO: Add KeyboardAvoidingView */}
      <ScrollView contentContainerStyle={styles.pageContent} style={styles.pageScroll}>
        <Stack alignItems="center" direction="row" spacing={1} style={{ marginBottom: 16 }}>
          <IconButton
            icon={({ size }) => (
              <DayIcon
                backgroundColor={colors.primary}
                defaultIcon="help"
                icon={iconValue}
                iconColor={colors.surface}
                // NOTE: Hack to fill icon button completely, taken from 'IconButton' source
                // const buttonSize = isV3 ? size + 2 * PADDING : size * 1.5;
                size={size + 2 * 8}
              />
            )}
            size={32}
            style={{
              margin: 0,
            }}
            onPress={onIconSelectOpen}
            onLongPress={onIconClear}
          />
          <Button mode="text" onPress={onIconSelectOpen}>
            {iconValue ? t("screens:dayForm.dayIconChange") : t("screens:dayForm.dayIconAdd")}
          </Button>
          {!!iconValue && (
            <IconButton
              icon="close"
              style={{ margin: 0, marginLeft: "auto" }}
              onPress={onIconClear}
            />
          )}
        </Stack>
        <TextInput
          autoCapitalize="words"
          // Prevent keyboard from flickering when moving to next field
          blurOnSubmit={false}
          control={form.control}
          innerRef={titleRef}
          label={t("screens:dayForm.dayTitleLabel")}
          maxLength={maxTitleLength}
          name="title"
          returnKeyType="next"
          onSubmitEditing={() => dateRef.current?.focus()}
        />
        <DateTimeInput
          // Prevent keyboard from flickering when moving to next field
          blurOnSubmit={false}
          control={form.control}
          innerRef={dateRef}
          label={t("screens:dayForm.dayDateLabel")}
          name="date"
          returnKeyType="next"
          style={{ marginTop: 4 }}
        />
        <SegmentedButtons
          buttons={timeUnitOptions}
          style={{ marginBottom: 8 }}
          value={unitValue}
          onValueChange={(v) => form.setValue("unit", v as DayUnit)}
        />
        <Checkbox
          control={form.control}
          hideHint
          label={t("screens:dayForm.dayRepeatsLabel")}
          name="repeats"
          style={{ paddingVertical: 4 }}
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          style={{ marginTop: 16 }}
        >
          <Button mode="text" textColor={colors.secondary} onPress={onCancelPress}>
            {t("common:actions.cancel")}
          </Button>
          <Button mode="contained" onPress={form.handleSubmit(onSubmitPress)}>
            {t("common:actions.save")}
          </Button>
        </Stack>
      </ScrollView>

      <IconSelectSheet ref={iconSheetRef} value={iconValue} onSelect={onIconSelectChoose} />
    </Page>
  );
};

const pagePadding = 32;
const styles = StyleSheet.create({
  pageContent: {
    flexGrow: 1,
  },
  pageScroll: {
    paddingHorizontal: pagePadding,
    paddingVertical: pagePadding,
    flex: 1,
  },
});

export default DayFormScreen;
