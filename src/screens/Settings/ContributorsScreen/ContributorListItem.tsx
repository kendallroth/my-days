import { openURL } from "expo-linking";
import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Chip, IconButton, Text, useTheme } from "react-native-paper";

import { getShadowStyles } from "@styles/utilities";
import { type LeftRight, type MaterialCommunityIcons } from "@typings/app.types";
import { getInitials } from "@utilities/string";

import { type Contributor, type ContributorActionType } from "./ContributorsScreen";

type ContributorListItemProps = {
  /** List item alignment */
  align?: LeftRight;
  /** Contributor */
  contributor: Contributor;
};

const ContributorActionIconMap: Record<ContributorActionType, keyof MaterialCommunityIcons> = {
  development: "code-tags",
  documentation: "file-document-edit",
  localization: "flag",
  testing: "test-tube",
};

const ContributorListItem = (props: ContributorListItemProps): ReactElement => {
  const { align, contributor } = props;

  const { colors } = useTheme();

  const themeStyles = {
    contributor: {
      backgroundColor: colors.surfaceVariant,
    },
    contributorAvatar: {
      backgroundColor: contributor.color,
    },
  };

  /** Open an external link */
  const onLink = (link: string): void => {
    openURL(link);
  };

  return (
    <View
      key={contributor.name}
      style={[
        styles.contributor,
        themeStyles.contributor,
        align === "left" ? styles.contributorLeft : styles.contributorRight,
      ]}
    >
      <Avatar.Text
        label={getInitials(contributor.name)}
        size={48}
        style={[styles.contributorAvatar, themeStyles.contributorAvatar]}
      />
      <View style={styles.contributorContent}>
        <Text variant="titleMedium">{contributor.name}</Text>
        <View style={styles.contributorActions}>
          {contributor.actions.map((a): ReactElement => {
            const icon = ContributorActionIconMap[a.type];
            return (
              <Chip key={a.type} icon={icon} style={styles.contributorActionsChip} mode="outlined">
                {a.description}
              </Chip>
            );
          })}
        </View>
      </View>
      {Boolean(contributor.website) && (
        <IconButton
          iconColor={colors.primary}
          icon="link"
          style={styles.contributorWebsite}
          onPress={() => onLink(contributor.website as string)}
        />
      )}
    </View>
  );
};

const chipSpacing = 4;
const styles = StyleSheet.create({
  contributor: {
    marginVertical: 8,
    flexDirection: "row",
    padding: 16,
    elevation: 2,
    ...getShadowStyles(),
  },
  contributorAvatar: {
    elevation: 2,
    ...getShadowStyles(1),
  },
  contributorLeft: {
    marginRight: 24,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  contributorRight: {
    marginLeft: 24,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  contributorActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: -chipSpacing,
    marginTop: 8,
  },
  contributorActionsChip: {
    margin: chipSpacing,
  },
  contributorContent: {
    flexShrink: 1,
    marginLeft: 16,
  },
  contributorWebsite: {
    marginLeft: 8,
  },
});

export default ContributorListItem;
