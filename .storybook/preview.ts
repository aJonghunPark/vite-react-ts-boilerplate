import type { Preview } from "@storybook/react";
import { initialize, mswDecorator } from "msw-storybook-addon";

import "../src/index.css";

initialize();

export const decorators = [mswDecorator];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
