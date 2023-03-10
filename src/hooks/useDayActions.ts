import { useNavigation } from "@react-navigation/native";
import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import qs from "qs";
import { useTranslation } from "react-i18next";

import { addDay, moveDay, removeDay, updateDay } from "@store/slices/days";
import { type UpDown } from "@typings/app.types";
import { type Day, type DayNew } from "@typings/day.types";
import { SHARED_DAY_VERSION } from "@utilities/day-parse.util";
import { type RootRouterParams } from "src/AppRouter";

import { useSnackbar } from "./useSnackbar";
import { useAppDispatch } from "./useStore";

type HomeScreenRouteProps = NativeStackScreenProps<RootRouterParams, "HomeScreen">;

interface DayActionsProps {
  onDayAddCallback?: (day: DayNew) => void;
  onDayDeleteCallback?: (day: Day) => void;
  onDayEditCallback?: (day: Day) => void;
  onDayMoveCallback?: (day: Day, direction: UpDown) => void;
  onDayShareCallback?: (day: Day, message: string) => void;
  onDayViewCallback?: (day: Day) => void;
}

interface DayActions {
  onDayAdd: (day: DayNew) => void;
  onDayDelete: (day: Day) => void;
  onDayEdit: (day: Day) => void;
  onDayMove: (day: Day, direction: UpDown) => void;
  onDayShare: (day: Day) => void;
  onDayView: (day: Day) => void;
}

export const useDayActions = (props: DayActionsProps): DayActions => {
  const {
    onDayAddCallback,
    onDayDeleteCallback,
    onDayEditCallback,
    onDayMoveCallback,
    onDayShareCallback,
    onDayViewCallback,
  } = props;

  const navigation = useNavigation<HomeScreenRouteProps["navigation"]>();

  const { t } = useTranslation(["common", "screens"]);
  const { notify } = useSnackbar();

  const dispatch = useAppDispatch();

  const dayAdd = (day: DayNew) => {
    dispatch(addDay(day));

    notify(t("screens:dayForm.dayAddSuccess", { title: day.title }));

    onDayAddCallback?.(day);
  };

  const dayDelete = (day: Day) => {
    dispatch(removeDay(day.id));

    notify(t("screens:dayDelete.deleteSuccess", { title: day.title }));

    onDayDeleteCallback?.(day);
  };

  const dayEdit = (day: Day) => {
    dispatch(updateDay(day));

    notify(t("screens:dayForm.dayEditSuccess", { title: day.title }));

    onDayEditCallback?.(day);
  };

  const dayMove = (day: Day, direction: UpDown) => {
    dispatch(moveDay({ id: day.id, direction }));

    onDayMoveCallback?.(day, direction);
  };

  const dayShare = async (day: Day) => {
    const mobileUrl = Linking.createURL("day/shared", {
      // While using triple slashes prevents splitting the path into separate hostname and path,
      //   it is not suitable as it prevents most applications from detecting a link. Instead,
      //   a hack has been employed to optionally join the hostname to the path if separated...
      // Source: https://github.com/expo/expo/issues/6497#issuecomment-574882448
      isTripleSlashed: false,
      queryParams: {
        date: day.date,
        icon: day.icon ?? undefined,
        id: day.id,
        repeats: day.repeats ? "true" : "false",
        title: day.title,
        unit: day.unit,
        version: `${SHARED_DAY_VERSION}`,
      },
    });

    const redirectSite = "https://my-days.kendallroth.ca";
    const webUrl = `${redirectSite}/mobile/redirect?${qs.stringify({
      url: mobileUrl,
    })}`;
    // Decided to use message over link as it contains more description (and link is iOS-only)
    const shareMessage = `A day has been shared with you from My Days! Follow this link to add '${day.title}' to the app!\n\n${mobileUrl}\n\nAlternative (web redirect)\n${webUrl}`;

    onDayShareCallback?.(day, shareMessage);
  };

  const dayView = (day: Day) => {
    navigation.navigate("DetailsScreen", { dayId: day.id });

    onDayViewCallback?.(day);
  };

  return {
    onDayAdd: dayAdd,
    onDayDelete: dayDelete,
    onDayEdit: dayEdit,
    onDayMove: dayMove,
    onDayShare: dayShare,
    onDayView: dayView,
  };
};
