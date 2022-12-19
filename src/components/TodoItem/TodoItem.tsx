import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoModifier } from '../../types/TodoModifier';

interface Props {
  todo: Todo;
  isModifying: boolean;
  onTodoDelete?: (todoId: number[]) => void;
  onTodoModify?: (modifiedTodos: TodoModifier[]) => void;
}

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    isModifying,
    onTodoDelete = () => {},
    onTodoModify = () => {},
  } = props;

  const [isTitleModifying, setIsTitleModifying] = useState(false);
  const [modifiedTitle, setModifiedTitle] = useState(todo.title);
  const modifiedTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modifiedTodoField.current) {
      modifiedTodoField.current.focus();
    }
  }, [isTitleModifying]);

  const handleOnSubmit = () => {
    if (modifiedTitle.length) {
      onTodoModify(
        [{ id: todo.id, title: modifiedTitle }],
      );
    } else {
      onTodoDelete([todo.id]);
    }

    setIsTitleModifying(false);
  };

  const handleOnCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setModifiedTitle(todo.title);
      setIsTitleModifying(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onTodoModify(
            [{ id: todo.id, completed: !todo.completed }],
          )}
        />
      </label>

      { isTitleModifying
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleOnSubmit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={modifiedTitle}
              ref={modifiedTodoField}
              onChange={event => setModifiedTitle(event.target.value)}
              onBlur={handleOnSubmit}
              onKeyDown={handleOnCancel}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleModifying(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onTodoDelete([todo.id])}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isModifying },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
