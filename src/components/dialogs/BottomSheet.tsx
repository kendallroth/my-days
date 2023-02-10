import React, { forwardRef, type ReactElement, useImperativeHandle, useRef, useState } from "react";
import { Keyboard, Platform, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Modal from "react-native-modal";
import { Text, useTheme } from "react-native-paper";

export type BottomSheetProps = {
  /** Modal contents */
  children: ReactElement | ReactElement[];
  /**
   * Whether modal can be dismissed by backdrop
   */
  dismissable?: boolean;
  /** Whether content should be inset horizontally (20px) */
  inset?: boolean;
  /** Modal content style */
  style?: StyleProp<ViewStyle>;
  /** Modal title */
  title?: string;
  /** Slot for content to title's right */
  titleRight?: ReactElement | null;
  /** Title style */
  titleStyle?: StyleProp<ViewStyle>;
  /** Close callback */
  onClose?: () => void;
  /** Hide callback (triggered after close animation finishes) */
  onHide?: () => void;
  /** Open callback */
  onOpen?: () => void;
};

type HideCallback = () => void;

export type BottomSheetRef = {
  /**
   * Close the modal
   *
   * @source https://github.com/react-native-modal/react-native-modal#i-cant-show-multiple-modals-one-after-another
   *
   * @param onHide - Callback executed after modal finished hide animation
   */
  close: (onHide?: HideCallback) => void;
  /** Open the modal */
  open: () => void;
};

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>((props: BottomSheetProps, ref) => {
  const {
    children,
    dismissable = false,
    inset = true,
    style = {},
    title,
    titleRight,
    titleStyle = {},
    onClose,
    onHide: onHideProp,
    onOpen,
  } = props;

  /**
   * Allow passing a callback on close to wait until modal is fully closed before responding,
   *   as only one modal can be displayed at once (causes iOS issues first).
   *
   * @source: https://github.com/react-native-modal/react-native-modal#i-cant-show-multiple-modals-one-after-another
   */
  const onHideCallbackRef = useRef<HideCallback | undefined>();

  const [isOpen, setIsOpen] = useState(false);
  const { colors, dark } = useTheme();

  useImperativeHandle(ref, (): BottomSheetRef => {
    return {
      close,
      open,
    };
  });

  const themeStyles = {
    backdropColor: dark ? "#444444aa" : "#44444466",
    backgroundColor: colors.background,
  };

  /**
   * Close the modal (from external source)
   *
   * @param onHide - Callback executed after modal is finished hide animation
   */
  const close = (onHide?: HideCallback) => {
    if (!isOpen) return;
    setIsOpen(false);

    // Store a reference to the closure callback function to ensure dialog is fully closed
    //   before trying to show another modal (edge case, but causes bugs).
    onHideCallbackRef.current = typeof onHide === "function" ? onHide : undefined;

    // NOTE: Manually hiding keyboard ensures a smoother transition than
    //         the automatic closure when inputs unmount (where needed)!
    Keyboard.dismiss();

    // Notify parent component that modal has closed (only for internal closures)!
    onClose?.();
  };

  /**
   * Open the modal
   */
  const open = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Ensure closure callback reference has been cleaned up
    onHideCallbackRef.current = undefined;

    // Notify parent component that modal has opened (only for internal closures)!
    onOpen?.();
  };

  /** Modal hide callback (after animation finishes) */
  const onHide = () => {
    // Call the closure callback once hide animation has finished, at which point another modal
    //   could be displayed (earliest point). However, this still isn't quite enough and sometimes
    //   requires waiting an additional brief period to ensure modal has completely hidden.
    setTimeout(() => {
      onHideProp?.();
      onHideCallbackRef.current?.();
    }, 10);

    // Clean up the 'onHide' callback ref soon after completing the modal closure
    setTimeout(() => {
      onHideCallbackRef.current = undefined;
    }, 250);
  };

  return (
    <Modal
      // NOTE: Apparently only necessary on iOS (Android handles already)
      avoidKeyboard={Platform.OS === "ios"}
      backdropColor={themeStyles.backdropColor}
      backdropOpacity={0.8}
      // NOTE: Necessary to fix backdrop flicker bug when closing. If flickering
      //         persists try 'hideModalContentWhileAnimating' as well.
      backdropTransitionOutTiming={0}
      isVisible={isOpen}
      style={[styles.sheetModal]}
      onBackdropPress={dismissable ? close : undefined}
      // TODO: Determine if this should always close modal (maybe allow confirming?)
      onBackButtonPress={close}
      onModalHide={onHide}
    >
      <View
        style={[styles.sheetContent, themeStyles, inset ? styles.sheetInset : undefined, style]}
      >
        {Boolean(title) && (
          <View style={[styles.sheetTitle, inset ? undefined : styles.sheetInset]}>
            <Text
              numberOfLines={1}
              style={[styles.sheetTitleText, titleStyle]}
              variant="titleLarge"
            >
              {title}
            </Text>
            {titleRight}
          </View>
        )}
        {children}
      </View>
    </Modal>
  );
});

export const BOTTOM_SHEET_PADDING = 24;
const styles = StyleSheet.create({
  sheetContent: {
    paddingVertical: BOTTOM_SHEET_PADDING,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    width: "100%",
  },
  // Optional inset applied to content/title
  sheetInset: {
    paddingHorizontal: BOTTOM_SHEET_PADDING,
  },
  sheetModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: BOTTOM_SHEET_PADDING,
  },
  sheetTitleText: {
    flexGrow: 0,
    flexShrink: 1,
    marginRight: "auto",
  },
});

export default BottomSheet;
