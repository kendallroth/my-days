import { useNavigation } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { QueryParams } from "expo-linking";
import { useTranslation } from "react-i18next";

import { CodedError } from "@errors";
import { useMounted, useSnackbar } from "@hooks";
import { store } from "@store";
import { Day } from "@typings/day.types";
import { parseDay } from "@utilities/day-parse.util";

import { RootRouterNavigation } from "./AppRouter";

/** Detect and handle external links used to open the app */
export const useAppOpenLink = () => {
  const { notifyError } = useSnackbar();
  const navigation = useNavigation<RootRouterNavigation>();
  const { t } = useTranslation(["common", "screens"]);

  /** Determine how to handle various external links */
  const handleOpeningLink = (link: string | null) => {
    if (!link) return;

    const { path, queryParams } = Linking.parse(link);
    if (!path || !queryParams) return;

    if (path === "day/shared") {
      handleSharedDay(queryParams);
    }
  };

  /** Handle receiving a shared day link configuration */
  const handleSharedDay = async (queryParams: QueryParams) => {
    let day: Day;
    try {
      day = parseDay(queryParams);
    } catch (e) {
      // Ignore errors and simply skip the linking attempt???
      let errorMessage = t("screens:daySharedLink.linkError");
      if (e instanceof CodedError) {
        // @ts-ignore
        errorMessage = t(e.message);
      } else {
        // eslint-disable-next-line no-console
        console.error("Error parsing linked day", e);
      }

      notifyError(errorMessage);
      return;
    }

    const storeState = store.getState();
    if (storeState.days.entities[day.id]) {
      notifyError(t("screens:daySharedLink.dayAddDuplicateError"));
      return;
    }

    navigation.navigate("HomeScreen", { sharedDay: day });
  };

  // Check whether app was opened via a link, as well as handle updates to the "opening" link.
  //   This avoids the recommended 'Linking.useLink' in an effort to only be executed specifically
  //   when opened via an external link (and not run on every re-render after)!
  useMounted(() => {
    Linking.getInitialURL().then((url) => handleOpeningLink(url));

    const openUrlSubscription = Linking.addEventListener("url", (event) => {
      handleOpeningLink(event.url);
    });

    return () => {
      openUrlSubscription.remove();
    };
  });
};
