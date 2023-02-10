import { useState } from "react";

import { type Day } from "@typings/day.types";

interface DayDeleteDialogProps {
  onCancel?: () => void;
  onConfirm: (day: Day) => void;
}

interface DayDeleteDialog {
  /** Day being deleted */
  deletedDay: Day | null;
  /** Set the day being deleted */
  setDeletedDay: (day: Day | null) => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
}

export const useDayDeleteDialog = (props: DayDeleteDialogProps): DayDeleteDialog => {
  const { onCancel: onCancelProp, onConfirm: onConfirmProp } = props;

  const [deletedDay, setDeletedDay] = useState<Day | null>(null);

  const onCancel = () => {
    setDeletedDay(null);
    onCancelProp?.();
  };

  const onConfirm = () => {
    setDeletedDay(null);
    onConfirmProp(deletedDay!);
  };

  return {
    deletedDay,
    setDeletedDay,
    onDeleteCancel: onCancel,
    onDeleteConfirm: onConfirm,
  };
};
