import "./Task.css";
import { useStore } from "../store.ts";
import trash from "../assets/trask.svg";
import classNames from "classnames";

function Task({ title }: { title: string }) {
  const task = useStore((store) =>
    store.tasks.find((task) => task.title === title)
  );
  const deleteTask = useStore((store) => store.deleteTask);
  const setDraggedTask = useStore((store) => store.setDraggedTask);

  if (!task) return null;

  return (
    <div className="task" draggable onDragStart={() => setDraggedTask(title)}>
      <div>{task?.title}</div>

      <div className="bottomWrapper">
        <div>
          <img src={trash} onClick={() => deleteTask(task.title)} />
        </div>
        <div className={classNames("status", task.state)}>{task.state}</div>
      </div>
    </div>
  );
}

export default Task;
