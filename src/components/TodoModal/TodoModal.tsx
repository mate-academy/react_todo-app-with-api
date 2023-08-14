import { FC } from 'react';
import { useTodosContext } from '../../context/useTodosContext';

export const TodoModal: FC = () => {
  const {
    tempTodo,
  } = useTodosContext();

  return (
    <div className="todo">
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{tempTodo?.title}</span>
      <button type="button" className="todo__remove">×</button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
