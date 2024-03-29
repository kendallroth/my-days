import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export type ComingSoonProps = {
  /** Explanation of timing, etc */
  description?: string;
};

const ComingSoon = (props: ComingSoonProps) => {
  const { description } = props;

  const { colors } = useTheme();
  const { t } = useTranslation(["common"]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* TODO: Fix colors */}
        <Icon color={`${colors.primary}aa`} name="hammer-wrench" size={96} />
        <Text style={styles.contentTitle}>{t("common:phrases.comingSoon")}</Text>
        {Boolean(description) && <Text style={styles.contentDescription}>{description}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  content: {
    alignItems: "center",
    padding: 32,
  },
  contentTitle: {
    marginTop: 8,
    fontSize: 24,
  },
  contentDescription: {
    marginTop: 16,
  },
});

export default ComingSoon;
