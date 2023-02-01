/** Base day shape */
export interface IDayBase {
  id: string;
  /** Day occurrence */
  date: string;
  /** When a day repeats */
  repeats: null | "year";
  /** Day name/title */
  title: string;
  /** Whether day uses a countdown/countup mode */
  type: "countdown" | "countup";
}

export interface IDay extends IDayBase {
  /** When day was created */
  createdAt: string;
  /** Whether day is pinned to dashboard */
  pinned: boolean;
}
