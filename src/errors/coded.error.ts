import { BaseError } from "./base.error";

/** Coded error class for localized messages */
export class CodedError extends BaseError {
  constructor(localeCode: string) {
    super(localeCode);
  }
}
