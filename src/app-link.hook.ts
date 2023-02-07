import dayjs from "dayjs";
import * as Linking from "expo-linking";
import { QueryParams } from "expo-linking";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { CodedError } from "@errors";
import { useAppDispatch, useMounted, useSnackbar } from "@hooks";
import { store } from "@store";
import { addDay } from "@store/slices/days";
import { Day } from "@typings/day.types";
import { parseDay } from "@utilities/day-parse.util";
import { sleep } from "@utilities/misc.util";

/** Detect and handle external links used to open the app */
export const useAppOpenLink = () => {
  const { notify, notifyError } = useSnackbar();
  const dispatch = useAppDispatch();
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

    // NOTE: Considered navigating to HomeScreen and pre-filling "Add Day" form, but discarded
    //         as it required more work to only happen once when linked and added little...

    // NOTE: Must directly access store state as selectors are not updated (due to 'onMounted'?)
    if (!storeState.settings.behaviours.confirmSharedDays) {
      dispatch(addDay(day));
      notify(t("screens:daySharedLink.dayAddSuccess", { title: day.title }));
      return;
    }

    // Briefly pause to allow alert to display properly
    await sleep(100);
    Alert.alert(
      t("screens:daySharedLink.dayAddConfirmTitle", { title: day.title }),
      t("screens:daySharedLink.dayAddConfirmDescription", { date: dayjs(day.date) }),
      [
        { text: t("common:choices.no"), style: "cancel" },
        {
          text: t("common:choices.yes"),
          onPress: () => {
            dispatch(addDay(day));
            notify(t("screens:daySharedLink.dayAddSuccess", { title: day.title }));
          },
        },
      ],
    );
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
