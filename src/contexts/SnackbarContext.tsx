import React, { type ReactElement, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Snackbar, useTheme } from "react-native-paper";

// Delay snackbar slightly to allow previous snackbars to close (animate) properly
const SNACKBAR_DELAY = 200;

interface ISnackbarState {
  buttonText: string | null;
  duration: number;
  message: string;
  open: boolean;
  permanent: boolean;
  type: SnackbarType;
  onDismiss: () => void;
  onPress: () => void;
}

type SnackbarType = "info" | "error" | "warning";
type SnackbarOptions = Partial<ISnackbarState>;

export interface ISnackbarContext {
  /** Close notification */
  closeNotification: () => void;
  /** Notify user (regular) */
  notify: (message: string, options?: SnackbarOptions) => void;
  /** Notify user (error) */
  notifyError: (message: string, options?: SnackbarOptions) => void;
  /** Notify user (not implemented) */
  notifyNotImplemented: (options?: SnackbarOptions) => void;
  /** Snackbar state/options */
  snackbar: ISnackbarState;
}

interface ISnackbarAction {
  payload?: SnackbarOptions;
  type: string;
}

type SnackbarProviderProps = {
  children?: ReactElement | ReactElement[];
};

const initialState: ISnackbarState = {
  buttonText: "",
  duration: Snackbar.DURATION_SHORT,
  permanent: false,
  message: "",
  open: false,
  type: "info",
  onDismiss: () => null,
  onPress: () => null,
};

const reducer = (state: ISnackbarState, action: ISnackbarAction): ISnackbarState => {
  switch (action.type) {
    case "close":
      // NOTE: Resetting all state will cause visual bugs while the snackbar closes!
      return {
        ...state,
        open: false,
      };
    case "open":
      return {
        ...initialState,
        ...action.payload,
        open: true,
      };
    default:
      return state;
  }
};

// @ts-ignore - Will be set by context provider
const SnackbarContext = React.createContext<ISnackbarContext>({});

const SnackbarProvider = (props: SnackbarProviderProps) => {
  const { children } = props;
  const [snackbar, snackbarDispatch] = useReducer(reducer, initialState);

  const { t } = useTranslation(["common"]);
  const { colors } = useTheme();

  let snackbarStyle = {};
  switch (snackbar.type) {
    case "error":
      snackbarStyle = {
        backgroundColor: colors.error,
      };
      break;
    case "info":
    default:
      break;
  }

  const snackbarAction =
    snackbar.buttonText && snackbar.onPress
      ? { label: snackbar.buttonText, onPress: snackbar.onPress }
      : null;

  /**
   * Handle closing the snackbar
   */
  const onDismiss = () => {
    closeNotification();

    snackbar?.onDismiss();
  };

  /**
   * Close the notification
   */
  const closeNotification = () => snackbarDispatch({ type: "close" });

  /**
   * Open a notification
   *
   * @param message - Notification message
   * @param options - Snackbar options
   */
  const notify = (message: string, options: SnackbarOptions = {}) => {
    // Close the previous notification
    closeNotification();

    // Use short timeout to allow close animation to finish
    setTimeout(() => {
      snackbarDispatch({ type: "open", payload: { ...options, message } });
    }, SNACKBAR_DELAY);
  };

  /**
   * Open an error notification
   *
   * @param message - Notification message
   * @param options - Snackbar options
   */
  const notifyError = (message: string, options: SnackbarOptions = {}) => {
    notify(message, { ...options, type: "error" });
  };

  /**
   * Open a not implemented notification
   *
   * @param options - Snackbar options
   */
  const notifyNotImplemented = (options: SnackbarOptions = {}) => {
    notify(t("common:errors.notImplemented"), { ...options, type: "error" });
  };

  return (
    <SnackbarContext.Provider
      value={{
        closeNotification,
        notify,
        notifyError,
        notifyNotImplemented,
        snackbar,
      }}
    >
      {children}
      <Snackbar
        // @ts-ignore - Cannot cast to snackbar actions
        action={snackbarAction}
        duration={snackbar.duration}
        style={snackbarStyle}
        visible={snackbar.open}
        onDismiss={onDismiss}
      >
        {snackbar.message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export { SnackbarContext, SnackbarProvider };
