import React, { forwardRef, ReactElement, useImperativeHandle, useState } from "react";
import { Keyboard, Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
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
  /** Open callback */
  onOpen?: () => void;
};

export type BottomSheetRef = {
  /** Close the modal */
  close: () => void;
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
    onOpen,
  } = props;

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
   */
  const close = (): void => {
    if (!isOpen) return;
    setIsOpen(false);

    // NOTE: Manually hiding keyboard ensures a smoother transition than
    //         the automatic closure when inputs unmount (where needed)!
    Keyboard.dismiss();

    // Notify parent component that modal has closed (only for internal closures)!
    onClose && onClose();
  };

  /**
   * Open the modal
   */
  const open = (): void => {
    if (isOpen) return;
    setIsOpen(true);

    // Notify parent component that modal has opened (only for internal closures)!
    onOpen && onOpen();
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
    >
      <View
        style={[styles.sheetContent, themeStyles, inset ? styles.sheetInset : undefined, style]}
      >
        {Boolean(title) && (
          <View style={[styles.sheetTitle, inset ? undefined : styles.sheetInset]}>
            <Text style={[styles.sheetTitleText, titleStyle]}>{title}</Text>
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
    marginRight: "auto",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default BottomSheet;
