import { composeStories } from "@storybook/react";
import { render } from "@testing-library/react";

import * as TaskListStories from "./TaskList.stories";

const { WithPinnedTasks } = composeStories(TaskListStories);

it("renders pinned tasks at the start of the list", () => {
  const { container } = render(<WithPinnedTasks />);

  expect(
    container.querySelector(
      '.list-item:nth-child(1) input[value="Task 6 (pinned)"]'
    )
  ).not.toBe(null);
});
