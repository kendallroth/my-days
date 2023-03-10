import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
  type Update,
} from "@reduxjs/toolkit";
import dayjs from "dayjs";

import { type UpDown } from "@typings/app.types";
import { type Day, type DayExtended, type DayNew } from "@typings/day.types";
import { mapDayExtended } from "@utilities/day.util";

import { type RootState } from "..";
import { addDebugDataAction, resetAppAction } from "../actions";
import { fakeDays } from "../data/days";

interface DaysState {
  /** Optional day to automatically open app to when opening app */
  startOpenDayId: string | null;
}

export const daysAdapter = createEntityAdapter<Day>({});

////////////////////////////////////////////////////////////////////////////////
// Slice
////////////////////////////////////////////////////////////////////////////////

const initialState = daysAdapter.getInitialState<DaysState>({
  startOpenDayId: null,
});

const daysSlice = createSlice({
  name: "days",
  initialState,
  reducers: {
    addDay(state, action: PayloadAction<DayNew>) {
      const newDay: Day = {
        ...action.payload,
        createdAt: dayjs().toISOString(),
        title: action.payload.title.trim(),
        unit: action.payload.unit ?? "day",
      };

      daysAdapter.addOne(state, newDay);
    },
    moveDay(state, action: PayloadAction<{ id: string; direction: UpDown }>) {
      const { direction, id } = action.payload;

      const currentIdx = state.ids.findIndex((i) => i === id);
      if (currentIdx < 0) return;

      const targetIdx = direction === "up" ? currentIdx - 1 : currentIdx + 1;
      if (targetIdx > state.ids.length - 1 || targetIdx < 0) return;

      // NOTE: Likely only works because immer captures direct mutations via proxies
      state.ids.splice(currentIdx, 1);
      state.ids.splice(targetIdx, 0, id);
    },
    removeDay(state, action: PayloadAction<string>) {
      daysAdapter.removeOne(state, action.payload);

      if (state.startOpenDayId === action.payload) {
        state.startOpenDayId = null;
      }
    },
    setStartOpenDay(state, action: PayloadAction<string | null>) {
      state.startOpenDayId = action.payload;
    },
    updateDay(state, action: PayloadAction<Day>) {
      const update: Update<Day> = {
        id: action.payload.id,
        changes: {
          date: action.payload.date,
          icon: action.payload.icon,
          repeats: action.payload.repeats,
          title: action.payload.title.trim(),
          unit: action.payload.unit,
        },
      };

      daysAdapter.updateOne(state, update);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addDebugDataAction, (state, action) => {
      if (!action.payload.days) return;

      // Only add debug days if not already populated in store
      const existingDays = Object.values(state.entities);
      fakeDays.forEach((day) => {
        if (existingDays.find((e) => e?.title === day.title)) return;

        daysAdapter.addOne(state, day);
      });
    });
    builder.addCase(resetAppAction, (state, action) => {
      if (!action.payload.days) return;

      daysAdapter.removeAll(state);
      state.startOpenDayId = null;
    });
  },
});

////////////////////////////////////////////////////////////////////////////////
// Selectors
////////////////////////////////////////////////////////////////////////////////

export const daysSelectors = daysAdapter.getSelectors<RootState>((state) => state.days);

// TODO: Expand selectors to calculate day offset

/** Select a specific day (by ID) */
export const selectDay = (state: RootState, id: string): DayExtended | undefined => {
  const day = daysSelectors.selectById(state, id);
  if (!day) return;

  return mapDayExtended(day, { startOpen: day.id === state.days.startOpenDayId });
};

/** Select a list of all days (respects order) */
export const selectDays = (state: RootState): DayExtended[] =>
  daysSelectors
    .selectAll(state)
    .map((d) => mapDayExtended(d, { startOpen: d.id === state.days.startOpenDayId }));

/** Total number of days */
export const selectDaysCount = daysSelectors.selectTotal;

/** Select the optional day that should start open with the app */
export const selectStartOpenDay = (state: RootState): DayExtended | undefined => {
  const { startOpenDayId } = state.days;
  if (!startOpenDayId) return;

  const day = daysSelectors.selectAll(state).find((d) => d.id === startOpenDayId);
  if (!day) return;

  return mapDayExtended(day, { startOpen: true });
};

export const { addDay, removeDay, moveDay, setStartOpenDay, updateDay } = daysSlice.actions;

export default daysSlice.reducer;
