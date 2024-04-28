import { Meta, StoryObj } from "@storybook/react";
import {
  screen,
  userEvent,
  waitFor,
  waitForElementToBeRemoved,
} from "@storybook/testing-library";
import { rest } from "msw";
import { Provider } from "react-redux";

import store from "../lib/store";
import InboxScreen from "./InboxScreen";
import { MockedState } from "./TaskList.stories";

export default {
  component: InboxScreen,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
} as Meta<typeof InboxScreen>;

type Story = StoryObj<typeof InboxScreen>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          "https://jsonplaceholder.typicode.com/todos",
          (req, res, ctx) => {
            const userId = req.url.searchParams.get("userId");
            if (userId === "1") return res(ctx.json(MockedState.tasks));
          }
        ),
      ],
    },
  },
  play: async () => {
    await waitForElementToBeRemoved(await screen.findByTestId("loading"));
    await waitFor(async () => {
      await userEvent.click(screen.getByRole("button", { name: /pinTask-1/i }));
      await userEvent.click(screen.getByRole("button", { name: /pinTask-3/i }));
    });
  },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        rest.get(
          "https://jsonplaceholder.typicode.com/todos",
          (req, res, ctx) => {
            const userId = req.url.searchParams.get("userId");
            if (userId === "1") return res(ctx.status(403));
          }
        ),
      ],
    },
  },
};
