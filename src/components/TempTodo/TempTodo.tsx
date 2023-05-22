import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo;
}

export const TempTodo: FC<Props> = ({ tempTodo }) => {
  return (
    <div className={classNames('todo', { completed: tempTodo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{tempTodo.title}</span>
      <button type="button" className="todo__remove">×</button>
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
