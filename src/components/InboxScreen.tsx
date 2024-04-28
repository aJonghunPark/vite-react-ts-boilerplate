import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../lib/hook";
import { fetchTasks } from "../lib/store";
import TaskList from "./TaskList";

const InboxScreen = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.taskbox);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  );
};

export default InboxScreen;
