import { BaseError } from "./base.error";

/** Coded error class for localized messages */
export class CodedError extends BaseError {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(localeCode: string) {
    super(localeCode);
  }
}
