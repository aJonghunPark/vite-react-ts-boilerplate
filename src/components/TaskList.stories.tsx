import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Meta, StoryObj } from "@storybook/react";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";

import { ITask } from "./Task";
import * as TaskStories from "./Task.stories";
import TaskList from "./TaskList";

export const MockedState = {
  tasks: [
    { ...(TaskStories.Default.args?.task as ITask), id: 1, title: "Task 1" },
    { ...(TaskStories.Default.args?.task as ITask), id: 2, title: "Task 2" },
    { ...(TaskStories.Default.args?.task as ITask), id: 3, title: "Task 3" },
    { ...(TaskStories.Default.args?.task as ITask), id: 4, title: "Task 4" },
    { ...(TaskStories.Default.args?.task as ITask), id: 5, title: "Task 5" },
    { ...(TaskStories.Default.args?.task as ITask), id: 6, title: "Task 6" },
  ],
  status: "idle",
  error: null,
};

interface MockStoreProps {
  taskboxState: typeof MockedState;
  children: ReactNode;
}

const MockStore: FC<MockStoreProps> = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: "taskbox",
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskSlice } = action.payload;
              const task = state.tasks.findIndex(
                (task: ITask) => task.id === id
              );
              if (task >= 0) {
                state.tasks[task].state = newTaskSlice;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

export default {
  component: TaskList,
  decorators: [(story) => <div style={{ padding: "3rem" }}>{story()}</div>],
  excludeStories: /.*MockedState$/,
} as Meta<typeof TaskList>;

type Story = StoryObj<typeof TaskList>;

// https://reffect.co.jp/react/react-typescript-storybook7#Argsrender
export const Default: Story = {
  // args: {
  //   tasks: [
  //     { ...(TaskStories.args?.task as ITask), id: 1, title: "Task 1" },
  //     { ...(TaskStories.args?.task as ITask), id: 2, title: "Task 2" },
  //     { ...(TaskStories.args?.task as ITask), id: 3, title: "Task 3" },
  //     { ...(TaskStories.args?.task as ITask), id: 4, title: "Task 4" },
  //     { ...(TaskStories.args?.task as ITask), id: 5, title: "Task 5" },
  //     { ...(TaskStories.args?.task as ITask), id: 6, title: "Task 6" },
  //   ],
  // },
  decorators: [
    (story) => <MockStore taskboxState={MockedState}>{story()}</MockStore>,
  ],
};

export const WithPinnedTasks: Story = {
  // args: {
  //   tasks: [
  //     ...Default.args!.tasks!.slice(0, 5),
  //     { id: 6, title: "Task 6 (pinned)", state: "TASK_PINNED" },
  //   ],
  // },
  decorators: [
    (story) => {
      const pinnedtasks = [
        ...MockedState.tasks.slice(0, 5),
        { id: 6, title: "Task 6 (pinned)", state: "TASK_PINNED" },
      ];

      return (
        <MockStore taskboxState={{ ...MockedState, tasks: pinnedtasks }}>
          {story()}
        </MockStore>
      );
    },
  ],
};

export const Loading: Story = {
  // args: {
  //   tasks: [],
  //   loading: true,
  // },
  decorators: [
    (story) => (
      <MockStore taskboxState={{ ...MockedState, status: "loading" }}>
        {story()}
      </MockStore>
    ),
  ],
};

export const Empty: Story = {
  // args: {
  //   ...Loading.args,
  //   loading: false,
  // },
  decorators: [
    (story) => (
      <MockStore taskboxState={{ ...MockedState, tasks: [] }}>
        {story()}
      </MockStore>
    ),
  ],
};
