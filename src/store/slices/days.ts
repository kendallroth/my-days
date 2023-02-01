import dayjs from "dayjs";
import { createEntityAdapter, createSlice, PayloadAction, Update } from "@reduxjs/toolkit";

// Utilites
import { addDebugDataAction, resetAppAction } from "../actions";
import { fakeDays } from "../data/days";
import { RootState } from "../index";

// Types
import { IDay, IDayBase } from "@typings/day.types";

interface IDaysState {
  /** Indicate primary countdown/countup on dashboard */
  primary: string | null;
}

export const daysAdapter = createEntityAdapter<IDay>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

////////////////////////////////////////////////////////////////////////////////
// Slice
////////////////////////////////////////////////////////////////////////////////

const initialState = daysAdapter.getInitialState<IDaysState>({
  primary: null,
});

const daysSlice = createSlice({
  name: "days",
  initialState,
  reducers: {
    addDay(state, action: PayloadAction<IDayBase>): void {
      const newDay: IDay = {
        ...action.payload,
        createdAt: dayjs().toISOString(),
        pinned: false,
        title: action.payload.title.trim(),
      };

      daysAdapter.addOne(state, newDay);
    },
    removeDay(state, action: PayloadAction<string>): void {
      // NOTE: Cleaning up attendance is handled by 'attendance' slice
      daysAdapter.removeOne(state, action.payload);
    },
    updateDay(state, action: PayloadAction<IDay>): void {
      const update: Update<IDay> = {
        id: action.payload.id,
        changes: {
          date: action.payload.date,
          repeats: action.payload.repeats,
          title: action.payload.title,
          type: action.payload.type,
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
export const selectDay = (state: RootState, id: string): IDay | undefined =>
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
