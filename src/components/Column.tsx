import { useState } from "react";
import { useStore } from "../store";
import "./Column.css";
import Task from "./Task";
import classNames from "classnames";

export default function Column({ state }: { state: ITask["state"] }) {
  const tasks = useStore((store) =>
    store.tasks.filter((task) => task.state === state)
  );
  const addTask = useStore((store) => store.addTask);
  const draggedTask = useStore((store) => store.draggedTask);
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const moveTask = useStore((store) => store.moveTask);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const onSubmit = () => {
    addTask({
      title: text,
      state,
    });
    setText("");
    setOpen(false);
  };

  return (
    <div
      className={classNames("column", { drop })}
      onDragOver={(e) => {
        setDrop(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false);

        e.preventDefault();
      }}
      onDrop={() => {
        setDrop(false);
        moveTask({
          title: draggedTask!,
          state,
        });
        setDraggedTask(null);
      }}
    >
      <div className="titleWrapper">
        <p>{state}</p>
        <button onClick={() => setOpen(true)}>Add</button>
      </div>
      {tasks.map((task) => (
        <Task key={task.title} title={task.title} />
      ))}

      {open && (
        <div className="Modal">
          <div className="modalContent">
            <input onChange={(e) => setText(e.target.value)} value={text} />
            <button onClick={onSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}
