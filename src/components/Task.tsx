import { FC } from "react";

import "../index.css";

export interface ITask {
  id: number;
  title: string;
  state: string;
  completed?: boolean;
  updatedAt?: Date;
}

export interface Props {
  task: ITask;
  onArchiveTask: (id: number) => void;
  onPinTask: (id: number) => void;
}

const Task: FC<Props> = (props) => {
  const { task, onArchiveTask, onPinTask } = props;
  return (
    <div className={`list-item ${task.state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${task.id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${task.id}`}
          checked={task.state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(task.id)}
        />
      </label>

      <label htmlFor="title" aria-label={task.title} className="title">
        <input
          type="text"
          value={task.title}
          readOnly={true}
          name="title"
          placeholder="Input title"
          style={{ textOverflow: "ellipsis" }}
        />
      </label>

      {task.state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(task.id)}
          id={`pinTask-${task.id}`}
          aria-label={`pinTask-${task.id}`}
          key={`pinTask-${task.id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
};

export default Task;
