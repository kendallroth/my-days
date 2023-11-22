import React, { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text, TextInput as TextFieldRNP, useTheme } from "react-native-paper";

import { useDebouncedValue } from "@hooks";
import { type MaterialCommunityIcons } from "@typings/app.types";
import { dayIcons } from "@utilities/icons.util";

import BottomSheet, { type BottomSheetRef } from "./BottomSheet";

interface IconSelectProps {
  /** Whether to also search tags when searching icons (slower) */
  searchTags?: boolean;
  value: keyof MaterialCommunityIcons | null;
  onSelect: (icon: keyof MaterialCommunityIcons) => void;
}

const IconSelectSheet = forwardRef<BottomSheetRef, IconSelectProps>(
  (props: IconSelectProps, ref) => {
    const { searchTags = true, value, onSelect } = props;

    const { colors } = useTheme();
    const { t } = useTranslation(["common", "screens"]);

    const [iconSearch, setIconSearch] = useState("");

    // Limit how often icons are filtered via debouncing
    const filteredSearch = useDebouncedValue(iconSearch, 100);
    const [filteredIcons, setFilteredIcons] = useState<(keyof MaterialCommunityIcons)[]>([]);

    // TODO: Figure out how to improve performance (mainly rendering issues???)
    useEffect(() => {
      const simpleSearch = filteredSearch.toLowerCase().replace(/[^a-z]gi/, "");
      const icons = dayIcons.reduce(
        (accum, icon) => {
          if (!simpleSearch) return [...accum, icon.name];
          let matches = icon.name.includes(simpleSearch);
          if (!matches && searchTags) {
            // TODO: Remove hyphens when searching (in icon name keys)
            matches = icon.tags.some((tag) => tag.includes(simpleSearch));
          }
          return matches ? [...accum, icon.name] : accum;
        },
        [] as (keyof MaterialCommunityIcons)[],
      );
      setFilteredIcons(icons);
    }, [filteredSearch, searchTags]);

    return (
      <BottomSheet ref={ref} dismissable title={t("screens:dayIconSelect.title")}>
        <TextFieldRNP
          autoCapitalize="none"
          dense
          placeholder={t("common:phrases.search")}
          left={<TextFieldRNP.Icon icon="magnify" />}
          right={
            !!iconSearch && <TextFieldRNP.Icon icon="close" onPress={() => setIconSearch("")} />
          }
          value={iconSearch}
          onChangeText={setIconSearch}
        />
        <ScrollView
          contentContainerStyle={styles.iconScrollContent}
          style={styles.iconScrollContainer}
        >
          {filteredIcons.map((icon) => (
            <View key={icon}>
              <IconButton
                containerColor={icon === value ? colors.primaryContainer : undefined}
                iconColor={icon === value ? colors.onPrimaryContainer : undefined}
                icon={icon}
                size={24}
                onPress={() => onSelect(icon)}
                style={{ margin: 0 }}
              />
            </View>
          ))}
          {!filteredIcons.length && (
            <Text style={{ paddingHorizontal: 16 }}>{t("screens:dayIconSelect.noMatches")}</Text>
          )}
        </ScrollView>
      </BottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  iconScrollContainer: {
    marginTop: 8,
    height: 200,
  },
  iconScrollContent: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 4,
    paddingVertical: 4,
  },
});

export default IconSelectSheet;
