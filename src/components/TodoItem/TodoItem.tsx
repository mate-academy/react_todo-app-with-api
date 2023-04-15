import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoCondition } from '../../types/TodoCondition';

type Props = {
  todo: Todo,
  todoCondition: TodoCondition,
  onDeleteTodo?: (todoId: number) => void,
  toggleTodo?: (curentTodo: Todo, status?: boolean | undefined) => void,
  handleSubmitEditing?: (id: number, thisTitle: string) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todoCondition,
  onDeleteTodo = () => { },
  toggleTodo = () => { },
  handleSubmitEditing = () => { },
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [thisTitle, setThisTitle] = useState(title);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (thisTitle === '') {
      onDeleteTodo(id);
    }

    if (thisTitle !== title) {
      handleSubmitEditing(id, thisTitle);
    }

    setIsEditing(false);
  };

  const cancelEditing = (key: string) => {
    if (key === 'Escape') {
      setIsEditing(false);
      setThisTitle(title);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={thisTitle}
              onChange={(e) => setThisTitle(e.target.value)}
              onBlur={() => handleSubmit()}
              onKeyUp={({ key }) => cancelEditing(key)}
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(id)}
            >
              x
            </button>
          </>
        )}

      <div className={classNames(
        'modal',
        'overlay',
        { 'is-active': todoCondition !== TodoCondition.neutral },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
