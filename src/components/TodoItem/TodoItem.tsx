import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isActive?: boolean,
  selectedTodosId?: number[],
  onDelete: (id: number[]) => void;
  onUpdate: (event: React.ChangeEvent<HTMLInputElement>, id: number[]) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isActive,
  selectedTodosId,
  onDelete,
  onUpdate,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          name="completed"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => onUpdate(event, [id])}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete([id])}
      >
        &times;
      </button>

      {/* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          defaultValue={title}
        />
      </form> */}

      <Loader
        isActive={isActive}
        selectedTodosId={selectedTodosId}
        id={id}
      />
    </div>
  );
};
