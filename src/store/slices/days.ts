import { createEntityAdapter, createSlice, PayloadAction, Update } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import { Day, DayNew } from "@typings/day.types";

import { RootState } from "..";
import { addDebugDataAction, resetAppAction } from "../actions";
import { fakeDays } from "../data/days";

interface DaysState {
  // NOTE: Additional state items can be added here
}

export const daysAdapter = createEntityAdapter<Day>({
  // sortComparer: (a, b) => b.date.localeCompare(a.date),
});

////////////////////////////////////////////////////////////////////////////////
// Slice
////////////////////////////////////////////////////////////////////////////////

const initialState = daysAdapter.getInitialState<DaysState>({});

const daysSlice = createSlice({
  name: "days",
  initialState,
  reducers: {
    addDay(state, action: PayloadAction<DayNew>): void {
      const newDay: Day = {
        ...action.payload,
        createdAt: dayjs().toISOString(),
        title: action.payload.title.trim(),
        unit: action.payload.unit ?? "day",
      };

      daysAdapter.addOne(state, newDay);
    },
    removeDay(state, action: PayloadAction<string>): void {
      // NOTE: Cleaning up attendance is handled by 'attendance' slice
      daysAdapter.removeOne(state, action.payload);
    },
    updateDay(state, action: PayloadAction<Day>): void {
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
    });
  },
});

////////////////////////////////////////////////////////////////////////////////
// Selectors
////////////////////////////////////////////////////////////////////////////////

export const daysSelectors = daysAdapter.getSelectors<RootState>((state) => state.days);

// TODO: Expand selectors to calculate day offset

/**
 * Select a specific day
 *
 * @param   state - Store state
 * @param   id    - Day ID
 * @returns Selected day
 */
export const selectDay = (state: RootState, id: string): Day | undefined =>
  daysSelectors.selectById(state, id);
/**
 * Select a list of all days (ordered by date)
 *
 * @param   state - Store state
 * @returns All days
 */
export const selectDays = daysSelectors.selectAll;
/**
 * Total number of days
 */
export const selectDaysCount = daysSelectors.selectTotal;

export const { addDay, removeDay, updateDay } = daysSlice.actions;

export default daysSlice.reducer;
