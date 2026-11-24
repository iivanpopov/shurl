/// <reference types="@kanjou/plugin/client" />

import type { DefaultMessageValue } from "@kanjou/react";

declare module "@kanjou/react" {
  export interface Register {
    locale: "en" | "uk";

    messages: {
      "input.shorten.placeholder": {};
      "input.shorten.placeholder-alert": {};
      "button.shorten": {};
      "button.clear": {};
      "validation.invalid-url": {};
      "button.copy-shortened.title": {};
      "button.copy-shortened.aria-label": {};
      "error.server": {};
      "error.network": {};
      "error.ratelimit": {};
      recaptcha: {};
    };
  }
}
