import { type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/** Left or right direction */
export type LeftRight = "left" | "right";

/** Up or down direction */
export type UpDown = "up" | "down";

/** Material community icons */
export type MaterialCommunityIcons =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  typeof import("react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json");

/** ScrollView scroll event */
export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;
