import "react-i18next";

import { type defaultNamespace, type resources } from "../localization/config";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNamespace;
    resources: (typeof resources)["en"];
  }
}
