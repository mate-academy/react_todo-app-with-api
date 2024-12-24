import { Todo } from '../types/Todo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  tempTodo: Todo | null;
};
export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" disabled />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>
      <div data-cy="TodoLoader" className={'modal overlay is-active'}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
