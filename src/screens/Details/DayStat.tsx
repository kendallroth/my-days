import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import React from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Text } from "react-native-paper";

interface DayStatProps {
  colorHighlight: string;
  colorNormal: string;
  highlighted?: boolean;
  number: number | string;
  style?: StyleProp<ViewStyle>;
  today?: boolean;
  unitLabel: string;
}

const DayStat = (props: DayStatProps) => {
  const { colorHighlight, colorNormal, highlighted, number, style, today, unitLabel } = props;

  const textColor = highlighted ? colorHighlight : colorNormal;
  const countdown = number >= 0;

  return (
    <View style={[styles.dayStat, style]}>
      <View style={styles.dayStatNumberRow}>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[
            styles.dayStatNumber,
            {
              color: textColor,
              fontWeight: highlighted ? "bold" : undefined,
            },
          ]}
          variant={highlighted ? "displayLarge" : "displayMedium"}
        >
          {number}
        </Text>
        {highlighted && !today && (
          <Icon
            color={colorNormal}
            name={countdown ? "arrow-down" : "arrow-up"}
            size={40}
            style={styles.dayStatDirectionIcon}
          />
        )}
      </View>
      <Text style={[styles.dayStatUnit, { color: textColor }]} variant="bodyLarge">
        {unitLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dayStat: {},
  dayStatDirectionIcon: {
    marginLeft: 8,
    marginTop: -6,
  },
  dayStatNumber: {
    // TODO: Determine if a monospace font looks best
    // fontFamily: Platform.OS === "android" ? "monospace" : undefined,
    // fontVariant: ["tabular-nums"],
  },
  dayStatNumberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dayStatUnit: {
    marginTop: -4,
  },
});

export default DayStat;
