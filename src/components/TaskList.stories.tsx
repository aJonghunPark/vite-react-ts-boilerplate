import { Meta, StoryObj } from "@storybook/react";

import { ITask } from "./Task";
import TaskStories from "./Task.stories";
import TaskList from "./TaskList";

export default {
  component: TaskList,
  decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
} as Meta<typeof TaskList>;

type Story = StoryObj<typeof TaskList>;

// https://reffect.co.jp/react/react-typescript-storybook7#Argsrender
export const Default: Story = {
  args: {
    tasks: [
      { ...(TaskStories.args?.task as ITask), id: 1, title: "Task 1" },
      { ...(TaskStories.args?.task as ITask), id: 2, title: "Task 2" },
      { ...(TaskStories.args?.task as ITask), id: 3, title: "Task 3" },
      { ...(TaskStories.args?.task as ITask), id: 4, title: "Task 4" },
      { ...(TaskStories.args?.task as ITask), id: 5, title: "Task 5" },
      { ...(TaskStories.args?.task as ITask), id: 6, title: "Task 6" },
    ],
  },
};

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      ...Default.args!.tasks!.slice(0, 5),
      { id: 6, title: "Task 6 (pinned)", state: "TASK_PINNED" },
    ],
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Loading.args,
    loading: false,
  },
};
