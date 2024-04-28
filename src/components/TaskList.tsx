import { FC } from "react";

import "../index.css";
import { useAppDispatch, useAppSelector } from "../lib/hook";
import { updateTaskState } from "../lib/store";
import Task, { ITask } from "./Task";

// interface Props {
//   tasks: ITask[];
//   loading: boolean;
//   onPinTask?: (id: number) => void;
//   onArchiveTask?: (id: number) => void;
// }

const TaskList: FC = () => {
  // const { loading, tasks, onPinTask, onArchiveTask } = props;
  // const events = { onPinTask, onArchiveTask };
  const tasks = useAppSelector((state) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === "TASK_PINNED"),
      ...state.taskbox.tasks.filter((t) => t.state !== "TASK_PINNED"),
    ];
    // const filteredTasks = tasksInOrder.filter(
    //   (t) => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    // );
    // return filteredTasks;
    return tasksInOrder;
  });

  const { status } = useAppSelector((state) => state.taskbox);

  const dispatch = useAppDispatch();

  const pinTask = (value: number) => {
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_PINNED" }));
  };

  const archiveTask = (value: number) => {
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_ARCHIVED" }));
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span>
        <span>cool</span>
        <span>state</span>
      </span>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  // const tasksInOrder = [
  //   ...tasks.filter((t) => t.state === "TASK_PINNED"),
  //   ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  // ];
  return (
    <div className="list-items">
      {tasks.map((task: ITask) => (
        <Task
          key={task.id}
          task={task}
          onPinTask={() => pinTask(task.id)}
          onArchiveTask={() => archiveTask(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;
