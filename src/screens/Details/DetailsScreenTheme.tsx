import React from "react";

import DetailsScreen from "./DetailsScreen";
import SwapDetailsTheme from "./SwapDetailsTheme";

/** Potentially flip theme based on app behaviour option */
const DetailsScreenTheme = () => {
  return (
    <SwapDetailsTheme>
      <DetailsScreen />
    </SwapDetailsTheme>
  );
};

export default DetailsScreenTheme;
