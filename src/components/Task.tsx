import { FC } from "react";

import "../index.css";

export interface ITask {
  id: number;
  title: string;
  state: string;
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
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={task.state === "TASK_ARCHIVED"}
          disabled={true}
          name="checked"
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(task.id)}
          id={`archiveTask-${task.id}`}
          aria-label={`archiveTask-${task.id}`}
        />
      </label>
      <div className="title">
        <input
          type="text"
          value={task.title}
          readOnly={true}
          placeholder="Input title"
        />
      </div>
      <div className="actions" onClick={(event) => event.stopPropagation()}>
        {task.state !== "TASK_ARCHIVED" && (
          <a onClick={() => onPinTask(task.id)}>
            <span
              className={`icon-star`}
              id={`pinTask-${task.id}`}
              aria-label={`pinTask-${task.id}`}
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default Task;
