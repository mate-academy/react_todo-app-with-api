import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo: Todo;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  const { title, completed } = tempTodo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>

      <button type="button" className="todo__remove">×</button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
