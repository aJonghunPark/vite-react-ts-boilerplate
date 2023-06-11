import { Meta, StoryObj } from "@storybook/react";

import Task, { ITask } from "./Task";

export default {
  component: Task,
} as Meta<typeof Task>;

type Story = StoryObj<typeof Task>;

export const Default: Story = {
  args: {
    task: {
      id: 1,
      title: "Test Task",
      state: "TASK_INBOX",
      updatedAt: new Date(2021, 0, 1, 9, 0),
    },
  },
};

// https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type
export const Pinned: Story = {
  args: {
    task: {
      ...(Default.args?.task as ITask),
      state: "TASK_PINNED",
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...(Default.args?.task as ITask),
      state: "TASK_ARCHIVED",
    },
  },
};
